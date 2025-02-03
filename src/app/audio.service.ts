import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private gain: GainNode;

  constructor() {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    this.gain = audioContext.createGain();
    this.gain.gain.value = 0;
    oscillator.frequency.value = 750;
    oscillator.connect(this.gain);
    this.gain.connect(audioContext.destination);
    document.addEventListener('keydown', () => oscillator.start(0), {
      once: true,
    });
  }

  start() {
    this.gain.gain.value = 0.05;
  }

  stop() {
    this.gain.gain.value = 0;
  }
}
