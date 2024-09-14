import { useStore, ModulationSettings } from './store';
import { Slider } from './components/ui/slider';
import { HuePicker } from 'react-color';
import { controllerInfo, ControllerId } from './Modulation'

interface ControllerProps {
    oscId: number;
    controllerId: number
}

const ControllerView = ({ oscId, controllerId }: ControllerProps) => {
    const { setControllerValue } = useStore();
    const controller = controllerInfo[controllerId];

    const handleValueChange = (values: number[]) => {
        let value = values[0];
        console.log(`handleValueChange: osc ${oscId} controller ${controllerId} value: ${values[0]} -> @{value}`);
        if (controller.curve === 'squared') {
            value = value * value;
        }
        setControllerValue(oscId, controllerId, value);
    }

    return (
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">
                {controller.name}
            </div>
                <Slider
                    className="flex my-4"
                    defaultValue={[controller.defaultValue]}
                    max={controller.max}
                    min={controller.min}
                    step={0.01}
                    onValueChange={handleValueChange}
                />
        </div>
    );
}

interface OscillatorSettingsProps {
    oscId: number;
}

const OscillatorSettings = ({ oscId }: OscillatorSettingsProps) => {
    const {
        controllerValues,
        setColor,
    } = useStore();

    return (
        <>
        <div className='flex justify-center w-full my-2 mt-4'>OSC 1</div>
        <div className="flex items-center row">
            <HuePicker color={controllerValues.oscillators[oscId].color} onChange={(color) => { setColor(oscId, color.hex); }} />
        </div>
        {Array.from({ length: ControllerId.NumControllers }, (_, id) => (
            <ControllerView key={id} oscId={oscId} controllerId={id} />
        ))}
        </>
    );
}

interface ModulationSettingsProps {
    oscId: number;
    modulationSettings: ModulationSettings;
    onLfoIdChange: (lfoId: number) => void;
    onAmountChange: (amount: number) => void;
}

const ModulationSettingsPanel = ({ modulationSettings, onLfoIdChange, onAmountChange }: ModulationSettingsProps) => {
    const handleAmountChange = (value: number[]) => {
        onAmountChange(value[0]);
    }

    const handleLfoIdChange = (lfoId: number) => {
        onLfoIdChange(lfoId);
    };

    return (
        <div className="p-2 m-1 bg-white bg-opacity-75 rounded shadow">
            <div className="flex flex-row justify-center">
                {`LFO ${modulationSettings.lfoId}`}
            </div>
            <div className="flex flex-row">
                <Slider
                    className="flex my-4"
                    defaultValue={[modulationSettings.amount]}
                    max={3.0}
                    min={0.0}
                    step={0.01}
                    onValueChange={handleAmountChange}
                />
            </div>
        </div>
    );
};


export const ControlPanel = () => {
    const {
        controllerValues,
        setBalance, 
    } = useStore();

    return (
    <div className="absolute top-0 left-0 p-2 m-4 bg-white bg-opacity-75 rounded shadow">
        <div className='flex justify-center w-full mt-4 mb-2'>Balance</div>
        <div className="flex items-center row">
            <Slider defaultValue={[controllerValues.balance]} max={1.0} min={0.0} step={0.01} onValueChange={(value) => { setBalance(value[0]); }} />
        </div>
        <OscillatorSettings oscId={0} />
        <OscillatorSettings oscId={1} />
    </div>
    )
}
