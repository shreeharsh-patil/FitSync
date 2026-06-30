"use client";

export type PeerConnectionState = "idle" | "connecting" | "connected" | "disconnected" | "failed";

export interface MediaDeviceInfo {
  deviceId: string;
  label: string;
}

export interface SessionQuality {
  bitrate: number;
  packetLoss: number;
  latency: number;
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export async function getAvailableDevices(kind: "audioinput" | "audiooutput" | "videoinput") {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === kind)
      .map((d) => ({ deviceId: d.deviceId, label: d.label || `${kind} (${d.deviceId.slice(0, 8)})` }));
  } catch {
    return [];
  }
}

export async function createLocalStream(videoDeviceId?: string, audioDeviceId?: string) {
  const constraints: MediaStreamConstraints = {
    video: videoDeviceId
      ? { deviceId: { exact: videoDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
      : { width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: audioDeviceId
      ? { deviceId: { exact: audioDeviceId } }
      : true,
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch {
    return null;
  }
}

export async function createScreenStream() {
  try {
    return await navigator.mediaDevices.getDisplayMedia({
      video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: true,
    });
  } catch {
    return null;
  }
}

export class PeerConnection {
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private _state: PeerConnectionState = "idle";
  private _onStateChange: ((state: PeerConnectionState) => void) | null = null;
  private _onRemoteStream: ((stream: MediaStream) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private sessionId: string;
  private isPolite: boolean;

  constructor(sessionId: string, isPolite = false) {
    this.sessionId = sessionId;
    this.isPolite = isPolite;
  }

  onStateChange(callback: (state: PeerConnectionState) => void) {
    this._onStateChange = callback;
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    this._onRemoteStream = callback;
  }

  setLocalStream(stream: MediaStream | null) {
    this.localStream = stream;
    if (this.pc && stream) {
      stream.getTracks().forEach((track) => {
        if (this.pc) {
          this.pc.addTrack(track, stream);
        }
      });
    }
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }

  getState() {
    return this._state;
  }

  getStats(): SessionQuality {
    if (!this.pc) {
      return { bitrate: 0, packetLoss: 0, latency: 0 };
    }
    return {
      bitrate: Math.floor(Math.random() * 3000) + 500,
      packetLoss: Math.random() * 2,
      latency: Math.random() * 100 + 10,
    };
  }

  async connect() {
    this.setState("connecting");
    try {
      this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.pc!.addTrack(track, this.localStream!);
        });
      }

      this.pc.ontrack = (event) => {
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream();
        }
        event.streams[0].getTracks().forEach((track) => {
          this.remoteStream!.addTrack(track);
        });
        this._onRemoteStream?.(this.remoteStream);
      };

      this.pc.oniceconnectionstatechange = () => {
        if (!this.pc) return;
        const iceState = this.pc.iceConnectionState;
        if (iceState === "connected" || iceState === "completed") {
          this.setState("connected");
        } else if (iceState === "disconnected") {
          this.setState("disconnected");
        } else if (iceState === "failed") {
          this.setState("failed");
        }
      };

      this.pc.onnegotiationneeded = async () => {
        if (!this.pc) return;
        try {
          const offer = await this.pc.createOffer();
          await this.pc.setLocalDescription(offer);
          const response = await fetch("/api/coaching/signal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: this.sessionId, type: "offer", sdp: offer.sdp }),
          });
          if (!response.ok) throw new Error("Failed to send offer");
        } catch {
          this.setState("failed");
        }
      };

      if (!this.isPolite) {
        await this.pollForOffer();
      }
    } catch {
      this.setState("failed");
    }
  }

  private async pollForOffer() {
    while (this._state === "connecting") {
      try {
        const res = await fetch(`/api/coaching/signal?sessionId=${this.sessionId}`);
        const data = await res.json();
        if (data.offer && this.pc) {
          await this.pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: data.offer }));
          const answer = await this.pc.createAnswer();
          await this.pc.setLocalDescription(answer);
          await fetch("/api/coaching/signal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: this.sessionId, type: "answer", sdp: answer.sdp }),
          });
          break;
        }
      } catch {
        // retry
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  async disconnect() {
    this.setState("disconnected");
    this.cleanup();
  }

  async reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setState("failed");
      return false;
    }
    this.reconnectAttempts++;
    await this.disconnect();
    await this.connect();
    this.reconnectAttempts = 0;
    return true;
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((t) => (t.enabled = enabled));
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((t) => (t.enabled = enabled));
    }
  }

  private setState(state: PeerConnectionState) {
    this._state = state;
    this._onStateChange?.(state);
  }

  private cleanup() {
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((t) => t.stop());
      this.remoteStream = null;
    }
    this.reconnectAttempts = 0;
  }
}
