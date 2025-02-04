import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext;
  private gainNode: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    const oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;
    oscillator.frequency.value = 750;
    oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    oscillator.start();
  }

  start() {
    if (this.audioContext.state !== 'running') {
      this.audioContext.resume();
    }
    this.gainNode.gain.value = 0.05;
  }

  stop() {
    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }
  }
}
