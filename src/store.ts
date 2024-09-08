import { create } from 'zustand';

export class OscillatorSettings {
    frequency: number;
    speed: number;
    volume: number;
    type: OscillatorType;
    color: string;
    sharpen: number = 1;

    constructor(frequency: number, speed: number, volume: number, type: OscillatorType, color: string) {
        this.frequency = frequency;
        this.speed = speed;
        this.volume = volume;
        this.type = type;
        this.color = color;
    }
}

export class ControlSettings {
    oscillator1: OscillatorSettings;
    oscillator2: OscillatorSettings;
    balance: number = 0.0;
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
    setBalance: (balance: number) => void;
    setColor1: (color: string) => void;
    setColor2: (color: string) => void;
    setFrequency1: (frequency: number) => void;
    setFrequency2: (frequency: number) => void;
    setSpeed1: (frequency: number) => void;
    setSpeed2: (frequency: number) => void;
    setSharpen1: (sharpen: number) => void;
    setSharpen2: (sharpen: number) => void;
    toggleShowControls: () => void;
}

export const useStore = create<AppState>((set) => ({
    count: 0,
    showControls: true,
    controlSettings: new ControlSettings(new OscillatorSettings(0.5, 1, 0.5, 'sine', "#ff0000"), new OscillatorSettings(0.5, 1, 0.5, 'sine', "#00ff00")),
    setBalance: (balance: number) => set((state) => ({ controlSettings: { ...state.controlSettings, balance: balance }})),
    setColor1: (color: string) => set((state) => ({ controlSettings: { ...state.controlSettings, oscillator1: { ...state.controlSettings.oscillator1, color: color }}})),
    setColor2: (color: string) => set((state) => ({ controlSettings: { ...state.controlSettings, oscillator2: { ...state.controlSettings.oscillator2, color: color }} })),
    setFrequency1: (frequency: number) => set((state) => ({ controlSettings: { ...state.controlSettings, oscillator1: { ...state.controlSettings.oscillator1, frequency: frequency }} })),
    setFrequency2: (frequency: number) => set((state) => ({ controlSettings: { ...state.controlSettings, oscillator2: { ...state.controlSettings.oscillator2, frequency: frequency }} })),
    setSpeed1: (speed: number) => set((state) => ({ controlSettings: { ...state.controlSettings, oscillator1: { ...state.controlSettings.oscillator1, speed: speed }} })),
    setSpeed2: (speed: number) => set((state) => ({ controlSettings: { ...state.controlSettings, oscillator2: { ...state.controlSettings.oscillator2, speed: speed }} })),
    setSharpen1: (sharpen: number) => set((state) => ({ controlSettings: { ...state.controlSettings, oscillator1: { ...state.controlSettings.oscillator1, sharpen: sharpen }} })),
    setSharpen2: (sharpen: number) => set((state) => ({ controlSettings: { ...state.controlSettings, oscillator2: { ...state.controlSettings.oscillator2, sharpen: sharpen }} })),
    setControlSettings: (settings: ControlSettings) => set({ controlSettings: settings }),
    toggleShowControls: () => set((state) => ({ showControls: !state.showControls })),
}));
