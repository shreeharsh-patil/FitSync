"use server";

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

export class MockPeerConnection {
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private state: PeerConnectionState = "idle";
  private onStateChange: ((state: PeerConnectionState) => void) | null = null;
  private onRemoteStream: ((stream: MediaStream) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  setLocalStream(stream: MediaStream | null) {
    this.localStream = stream;
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }

  getState() {
    return this.state;
  }

  onStateChange(callback: (state: PeerConnectionState) => void) {
    this.onStateChange = callback;
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStream = callback;
  }

  async connect() {
    this.setState("connecting");
    await this.simulateDelay(1500);
    this.remoteStream = new MediaStream();
    this.setState("connected");
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
    this.setState("connecting");
    await this.simulateDelay(2000);
    this.remoteStream = new MediaStream();
    this.setState("connected");
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

  getStats(): SessionQuality {
    return {
      bitrate: Math.floor(Math.random() * 3000) + 500,
      packetLoss: Math.random() * 2,
      latency: Math.random() * 100 + 10,
    };
  }

  private setState(state: PeerConnectionState) {
    this.state = state;
    this.onStateChange?.(state);
  }

  private simulateDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private cleanup() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((t) => t.stop());
      this.remoteStream = null;
    }
  }
}
