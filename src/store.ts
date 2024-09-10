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
    oscillators: OscillatorSettings[];
    balance: number = 0.5;
    constructor(oscillators: OscillatorSettings[]) {
        this.oscillators = oscillators;
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
    setColor: (oscId: number, color: string) => void;
    setFrequency: (oscId: number, frequency: number) => void;
    setSpeed: (oscId: number, speed: number) => void;
    setSharpen: (oscId: number, sharpen: number) => void;
    setCenterX: (oscId: number, centerX: number) => void;
    setCenterY: (oscId: number, centerY: number) => void;
    toggleShowControls: () => void;
}

export const useStore = create<AppState>((set) => ({
    count: 0,
    showControls: true,
    controlSettings: new ControlSettings([
        new OscillatorSettings(1, 1, 1, 'sine', "#ff0000", [0, 0]),
        new OscillatorSettings(1, 1, 1, 'sine', "#00ff00", [0, 0])
    ]),
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

    toggleShowControls: () => set(produce((state: AppState) => {
        state.showControls = !state.showControls;
    })),
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
    setColor: (oscId: number, color: string) => set(produce((state: AppState) => {
        state.controlSettings.oscillators[oscId].color = color;
    })),
    setFrequency: (oscId: number, frequency: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillators[oscId].frequency = frequency;
    })),
    setSpeed: (oscId: number, speed: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillators[oscId].speed = speed;
    })),
    setSharpen: (oscId: number, sharpen: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillators[oscId].sharpen = sharpen;
    })),
    setControlSettings: (settings: ControlSettings) => set(produce((state: AppState) => {
        state.controlSettings = settings;
    })),
    setCenterX: (oscId: number, centerX: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillators[oscId].center[0] = centerX;
    })),
    setCenterY: (oscId: number, centerY: number) => set(produce((state: AppState) => {
        state.controlSettings.oscillators[oscId].center[1] = centerY;
    })),
}));
