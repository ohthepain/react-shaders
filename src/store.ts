import { create } from 'zustand';
import { produce, immerable } from 'immer';
import { controllerInfo, ControllerId } from './Modulation';

export class ModulationSettings {
    [immerable] = true;
    lfoId: number;
    amount: number;

    constructor(lfoId: number, amount: number) {
        this.lfoId = lfoId;
        this.amount = amount;
    }
}

export class OscillatorSettings {
    [immerable] = true;
    type: OscillatorType;
    color: string;
    center: [number, number];
    controllers: number[];

    constructor(type: OscillatorType, color: string, center: [number, number], controllers: number[]) {
        this.type = type;
        this.color = color;
        this.center = center;
        this.controllers = [...controllers];
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
    controllerValues: ControlSettings;
    lfoSettings: LfoSettings[];

    toggleShowControls: () => void;
    setControlSettings: (settings: ControlSettings) => void;
    setLfoType: (lfoNum: number, type: LfoType) => void;
    setLfoFrequency: (lfoNum: number, frequency: number) => void;
    setBalance: (balance: number) => void;
    setColor: (oscId: number, color: string) => void;
    setControllerValue: (oscId: number, controllerId: number, value: number) => void;
    // Each controller has lfo id and amount
}

var defaultControllerValues: number[] = new Array(ControllerId.NumControllers); 
for (var n = 0; n<ControllerId.NumControllers; n++) {
    defaultControllerValues[n] = controllerInfo[n].defaultValue;
}

export const useStore = create<AppState>((set) => ({
    count: 0,
    showControls: true,
    controllerValues: new ControlSettings([
        new OscillatorSettings('sine', "#ff0000", [0, 0], defaultControllerValues),
        new OscillatorSettings('sine', "#00ff00", [0, 0], defaultControllerValues)
    ]),
    lfoSettings: [
        new LfoSettings(0, 0.33, LfoType.SINE),
        new LfoSettings(1, 0.33, LfoType.SINE),
        new LfoSettings(2, 0.33, LfoType.SAWTOOTH),
        new LfoSettings(3, 0.33, LfoType.SINE),
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
        state.controllerValues.balance = balance;
    })),
    setColor: (oscId: number, color: string) => set(produce((state: AppState) => {
        state.controllerValues.oscillators[oscId].color = color;
    })),
    setControlSettings: (settings: ControlSettings) => set(produce((state: AppState) => {
        state.controllerValues = settings;
    })),
    setControllerValue: (oscId: number, controllerId: number, value: number) => set(produce((state: AppState) => {
        state.controllerValues.oscillators[oscId].controllers[controllerId] = value;
    })),
}));
