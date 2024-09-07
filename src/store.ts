import { create } from 'zustand';

export class Hsv {
    h: number;
    s: number;
    v: number;
    constructor(h: number, s: number, v: number) {
        this.h = h;
        this.s = s;
        this.v = v;
    }
}

export class OscillatorSettings {
    frequency: number;
    volume: number;
    type: OscillatorType;
    hsv: Hsv;
    constructor(frequency: number, volume: number, type: OscillatorType) {
        this.frequency = frequency;
        this.volume = volume;
        this.type = type;
        this.hsv = new Hsv(1, 1, 1);
    }
}

export class ControlSettings {
    oscillator1: OscillatorSettings;
    oscillator2: OscillatorSettings;
    constructor(oscillator1: OscillatorSettings, oscillator2: OscillatorSettings) {
        this.oscillator1 = oscillator1;
        this.oscillator2 = oscillator2;
    }
}

interface AppState {
    count: number;
    showControls: boolean;
    controlSettings: ControlSettings;
    setControlSettings: (settings: ControlSettings) => void;
    toggleShowControls: () => void;
    increaseCount: () => void;
    decreaseCount: () => void;
}

export const useStore = create<AppState>((set) => ({
    count: 0,
    showControls: true,
    controlSettings: new ControlSettings(new OscillatorSettings(440, 0.5, 'sine'), new OscillatorSettings(440, 0.5, 'sine')),
    setControlSettings: (settings: ControlSettings) => set({ controlSettings: settings }),
    toggleShowControls: () => set((state) => ({ showControls: !state.showControls })),
    increaseCount: () => set((state) => ({ count: state.count + 1 })),
    decreaseCount: () => set((state) => ({ count: state.count - 1 })),
}));
