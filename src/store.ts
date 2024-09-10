import { create } from 'zustand';
import { produce, immerable } from 'immer';

export class OscillatorSettings {
    [immerable] = true;
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
    [immerable] = true;
    oscillator1: OscillatorSettings;
    oscillator2: OscillatorSettings;
    balance: number = 0.5;
    constructor(oscillator1: OscillatorSettings, oscillator2: OscillatorSettings) {
        this.oscillator1 = oscillator1;
        this.oscillator2 = oscillator2;
    }
}

// Define the LfoType enum
export enum LfoType {
    SINE = 'sine',
    SQUARE = 'square',
    TRIANGLE = 'triangle',
    SAWTOOTH = 'sawtooth'
}

// Update the LfoSettings class to use the LfoType enum
export class LfoSettings {
    [immerable] = true;
    id: number;
    frequency: number;
    type: LfoType;

    constructor(id: number, frequency: number=0.1, type: LfoType= LfoType.SINE) {
        this.id = id;
        this.frequency = frequency;
        this.type = type;
    }
}

interface AppState {
    count: number;
    showControls: boolean;
    controlSettings: ControlSettings;
    lfoSettings: LfoSettings[];
    setControlSettings: (settings: ControlSettings) => void;
    setLfoType: (lfoNum: number, type: LfoType) => void;
    setLfoFrequency: (lfoNum: number, frequency: number) => void;
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
    lfoSettings: [
        new LfoSettings(0, 0.33, LfoType.SINE),
        new LfoSettings(1, 0.33, LfoType.SINE),
        new LfoSettings(2, 0.33, LfoType.SAWTOOTH),
        new LfoSettings(3, 0.33, LfoType.SAWTOOTH),
        new LfoSettings(4, 0.33, LfoType.TRIANGLE),
        new LfoSettings(5, 0.33, LfoType.TRIANGLE),
        new LfoSettings(6, 0.33, LfoType.SQUARE),
        new LfoSettings(7, 0.33, LfoType.SQUARE)
    ],
    setLfoFrequency: (lfoNum, frequency) => set(produce((state: AppState) => {
        console.log(`store-setLfoFrequency: ${lfoNum} ${frequency}`);
        state.lfoSettings[lfoNum].frequency = frequency;
    })),
    setLfoType: (lfoNum, type) => set(produce((state: AppState) => {
        console.log(`store-setLfoType: ${lfoNum} ${type}`);
        state.lfoSettings[lfoNum].type = type;
    })),
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
