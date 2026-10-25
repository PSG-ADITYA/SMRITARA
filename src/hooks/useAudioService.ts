import { useState, useEffect } from 'react';
import { audioService, type AudioServiceState, type PlaybackOptions } from '../engine/audioService';

export function useAudioService() {
  const [state, setState] = useState<AudioServiceState>(() => audioService.getState());

  useEffect(() => {
    const unsubscribe = audioService.subscribe(newState => {
      setState(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    ...state,
    speak: (text: string, options?: PlaybackOptions) => audioService.speak(text, options),
    pause: () => audioService.pause(),
    resume: () => audioService.resume(),
    stop: () => audioService.stop(),
    setRate: (rate: number) => audioService.setRate(rate),
    playTempleBell: (pitchMultiplier?: number, volume?: number) => audioService.playTempleBell(pitchMultiplier, volume),
    playCue: (freq?: number, dur?: number) => audioService.playCue(freq, dur),
    setSoundEffectsEnabled: (enabled: boolean) => audioService.setSoundEffectsEnabled(enabled),
    isSoundEffectsEnabled: audioService.isSoundEffectsEnabled(),
  };
}
