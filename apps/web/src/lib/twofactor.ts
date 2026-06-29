import { createHash, randomBytes } from "crypto";

const TOTP_STEP = 30;
const TOTP_DIGITS = 6;
const TOTP_ALGORITHM = "sha1";

function base32Encode(buf: Buffer): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  let output = "";
  for (let i = 0; i < buf.length; i++) {
    value = (value << 8) | buf[i];
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }
  return output;
}

export function generateTOTPSecret(): string {
  const key = randomBytes(20);
  return base32Encode(key);
}

function hmacSha1(key: Buffer, message: Buffer): Buffer {
  const blockSize = 64;
  let k = Buffer.from(key);
  if (k.length > blockSize) {
    k = Buffer.from(createHash("sha1").update(k).digest());
  }
  if (k.length < blockSize) {
    const padded = Buffer.alloc(blockSize, 0);
    k.copy(padded);
    k = padded;
  }

  const oKeyPad = Buffer.alloc(blockSize, 0x5c);
  const iKeyPad = Buffer.alloc(blockSize, 0x36);
  for (let i = 0; i < blockSize; i++) {
    oKeyPad[i] ^= k[i];
    iKeyPad[i] ^= k[i];
  }

  const inner = createHash("sha1").update(Buffer.concat([iKeyPad, message])).digest();
  const outer = createHash("sha1").update(Buffer.concat([oKeyPad, inner])).digest();
  return outer;
}

function base32Decode(s: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  s = s.replace(/=+$/, "").toUpperCase();
  const bits: number[] = [];
  for (const ch of s) {
    const val = alphabet.indexOf(ch);
    if (val < 0) continue;
    for (let i = 4; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  }
  const bytes: number[] = [];
  for (let i = 0; i + 7 < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i + j];
    }
    bytes.push(byte);
  }
  return Buffer.from(bytes);
}

function dynamicTruncate(hs: Buffer): number {
  const offset = hs[hs.length - 1] & 0xf;
  const binary =
    ((hs[offset] & 0x7f) << 24) |
    ((hs[offset + 1] & 0xff) << 16) |
    ((hs[offset + 2] & 0xff) << 8) |
    (hs[offset + 3] & 0xff);
  return binary;
}

function getTOTPToken(key: string, timestamp: number = Date.now()): string {
  const counter = Math.floor(timestamp / 1000 / TOTP_STEP);
  const counterBuf = Buffer.alloc(8);
  for (let i = 7; i >= 0; i--) {
    counterBuf[i] = counter & 0xff;
    counter >>>= 8;
  }

  const decodedKey = base32Decode(key);
  const hs = hmacSha1(decodedKey, counterBuf);
  const binary = dynamicTruncate(hs);
  const token = binary % Math.pow(10, TOTP_DIGITS);
  return String(token).padStart(TOTP_DIGITS, "0");
}

export function verifyTOTPToken(secret: string, token: string): boolean {
  if (!/^\d{6}$/.test(token)) return false;
  const now = Date.now();
  for (let drift = -1; drift <= 1; drift++) {
    const expected = getTOTPToken(secret, now + drift * TOTP_STEP * 1000);
    if (expected === token) return true;
  }
  return false;
}

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    const code = randomBytes(4).toString("hex").toUpperCase();
    codes.push(code);
  }
  return codes;
}

export function getTOTPURI(secret: string, email: string, issuer: string = "FitSync"): string {
  return `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}&algorithm=${TOTP_ALGORITHM.toUpperCase()}&digits=${TOTP_DIGITS}&period=${TOTP_STEP}`;
}

export function getQRDataURL(uri: string): string {
  const qrContent = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(uri)}`;
  return qrContent;
}
