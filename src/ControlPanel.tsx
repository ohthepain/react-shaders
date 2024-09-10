import { useEffect } from 'react';
import { useStore } from './store';
import { Slider } from './components/ui/slider';
import { HuePicker } from 'react-color';

interface OscillatorSettingsProps {
    oscId: number;
}

const OscillatorSettings = ({ oscId }: OscillatorSettingsProps) => {
    const {
        controlSettings,
        setColor,
        setFrequency,
        setSpeed,
        setSharpen,
        setCenterX,
        setCenterY,
    } = useStore();

    return (
        <>
        <div className='flex justify-center w-full my-2 mt-4'>OSC 1</div>
        <div className="flex items-center row">
            <HuePicker color={controlSettings.oscillators[oscId].color} onChange={(color) => { setColor(0, color.hex); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Freq</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillators[oscId].frequency]} max={10.0} min={0.0} step={0.01} onValueChange={(value) => { setFrequency(oscId, value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Speed</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillators[oscId].speed]} max={30.0} min={0.0} step={0.01} onValueChange={(value) => { setSpeed(oscId, value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Sharp</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillators[oscId].sharpen]} max={4.0} min={1.0} step={0.01} onValueChange={(value) => { setSharpen(oscId, value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">X</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillators[oscId].center[oscId]]} max={100.0} min={-100.0} step={0.01} onValueChange={(value) => { setCenterX(oscId, value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Y</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillators[oscId].center[1]]} max={100.0} min={-100.0} step={0.01} onValueChange={(value) => { setCenterY(oscId, value[0]); }} />
        </div>
        </>
    );
}

export const ControlPanel = () => {
    const {
        controlSettings,
        setBalance, 
    } = useStore();

    useEffect(() => {
        console.log(`controlSettings: ${JSON.stringify(controlSettings)}`);
    }, [controlSettings]);

    return (
    <div className="absolute top-0 left-0 p-2 m-4 bg-white bg-opacity-75 rounded shadow">
        <div className='flex justify-center w-full mt-4 mb-2'>Balance</div>
        <div className="flex items-center row">
            <Slider defaultValue={[controlSettings.balance]} max={1.0} min={0.0} step={0.01} onValueChange={(value) => { setBalance(value[0]); }} />
        </div>
        <OscillatorSettings oscId={0} />
        <OscillatorSettings oscId={1} />
    </div>
    )
}
