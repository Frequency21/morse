import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

type BrowserState = {
  isBrowser: true;
  audioContext: AudioContext;
  gainNode: GainNode;
};

type ServerState = {
  isBrowser: false;
};

type State = BrowserState | ServerState;

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private state: State;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const setupAudio = (isBrowser: boolean): State => {
      if (!isBrowser) {
        return { isBrowser };
      }

      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0;
      oscillator.frequency.value = 750;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();

      return { isBrowser, audioContext, gainNode };
    };

    this.state = setupAudio(isPlatformBrowser(this.platformId));
  }

  start() {
    if (!this.state.isBrowser) return;
    if (this.state.audioContext.state !== 'running') {
      this.state.audioContext.resume();
    }
    this.state.gainNode.gain.value = 0.05;
  }

  stop() {
    if (!this.state.isBrowser) return;
    if (this.state.gainNode) {
      this.state.gainNode.gain.value = 0;
    }
  }
}
