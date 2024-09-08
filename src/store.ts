import { create } from 'zustand';
import { produce } from 'immer';

export class OscillatorSettings {
    frequency: number;
    speed: number;
    volume: number;
    type: OscillatorType;
    color: string;
    sharpen: number = 1;
    center: [number, number];

    constructor(frequency: number, speed: number, volume: number, type: OscillatorType, color: string, center: [number, number]) {
        this.frequency = frequency;
        this.speed = speed;
        this.volume = volume;
        this.type = type;
        this.color = color;
        this.center = center;
    }
}

export class ControlSettings {
    oscillator1: OscillatorSettings;
    oscillator2: OscillatorSettings;
    balance: number = 0.5;
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
    setSpeed1: (speed: number) => void;
    setSpeed2: (speed: number) => void;
    setSharpen1: (sharpen: number) => void;
    setSharpen2: (sharpen: number) => void;
    setCenterX1: (centerX: number) => void;
    setCenterY1: (centerY: number) => void;
    setCenterX2: (centerX: number) => void;
    setCenterY2: (centerY: number) => void;
    toggleShowControls: () => void;
}

export const useStore = create<AppState>((set) => ({
    count: 0,
    showControls: true,
    controlSettings: new ControlSettings(
        new OscillatorSettings(1, 1, 1, 'sine', "#ff0000", [0, 0]),
        new OscillatorSettings(1, 1, 1, 'sine', "#00ff00", [0, 0])
    ),
    setBalance: (balance: number) => set(produce((state: AppState) => {
        state.controlSettings.balance = balance;
    })),
    setColor1: (color: string) => set(produce((state: AppState) => {
        state.controlSettings.oscillator1.color = color;
    })),
    setColor2: (color: string) => set(produce((state: AppState) => {
        state.controlSettings.oscillator2.color = color;
    })),
    setFrequency1: (frequency: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator1.frequency = frequency;
    })),
    setFrequency2: (frequency: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator2.frequency = frequency;
    })),
    setSpeed1: (speed: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator1.speed = speed;
    })),
    setSpeed2: (speed: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator2.speed = speed;
    })),
    setSharpen1: (sharpen: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator1.sharpen = sharpen;
    })),
    setSharpen2: (sharpen: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator2.sharpen = sharpen;
    })),
    setControlSettings: (settings: ControlSettings) => set(produce((state: AppState) => {
        state.controlSettings = settings;
    })),
    toggleShowControls: () => set(produce((state: AppState) => {
        state.showControls = !state.showControls;
    })),
    setCenterX1: (centerX: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator1.center[0] = centerX;
    })),
    setCenterY1: (centerY: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator1.center[1] = centerY;
    })),
    setCenterX2: (centerX: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator2.center[0] = centerX;
    })),
    setCenterY2: (centerY: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillator2.center[1] = centerY;
    }))
}));
