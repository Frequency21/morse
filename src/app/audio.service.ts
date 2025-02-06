import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

type State =
  | {
      isBrowser: boolean;
      audioContext?: AudioContext;
      gainNode?: GainNode;
    }
  | {
      isBrowser: true;
      audioContext: AudioContext;
      gainNode: GainNode;
    };

function isBrowserState(state: State): state is {
  isBrowser: true;
  audioContext: AudioContext;
  gainNode: GainNode;
} {
  return state.isBrowser;
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private state: State;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.state = {
      isBrowser: isPlatformBrowser(this.platformId),
    };
    if (!this.state.isBrowser) {
      return;
    }
    this.state.audioContext = new AudioContext();
    const oscillator = this.state.audioContext.createOscillator();
    this.state.gainNode = this.state.audioContext.createGain();
    this.state.gainNode.gain.value = 0;
    oscillator.frequency.value = 750;
    oscillator.connect(this.state.gainNode);
    this.state.gainNode.connect(this.state.audioContext.destination);
    oscillator.start();
  }

  start() {
    if (!isBrowserState(this.state)) return;
    if (this.state.audioContext.state !== 'running') {
      this.state.audioContext.resume();
    }
    this.state.gainNode.gain.value = 0.05;
  }

  stop() {
    if (this.state.gainNode) {
      this.state.gainNode.gain.value = 0;
    }
  }
}
