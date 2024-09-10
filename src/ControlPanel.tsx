import { useEffect } from 'react';
import { useStore } from './store';
import { Slider } from './components/ui/slider';
import { HuePicker } from 'react-color';

export const ControlPanel = () => {
    const {
        controlSettings,
        setBalance, 
        setColor1,
        setColor2,
        setFrequency1,
        setFrequency2,
        setSpeed1,
        setSpeed2,
        setSharpen1,
        setSharpen2,
        setCenterX1,
        setCenterY1,
        setCenterX2,
        setCenterY2
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
        <div className='flex justify-center w-full my-2 mt-4'>OSC 1</div>
        <div className="flex items-center row">
            <HuePicker color={controlSettings.oscillator1.color} onChange={(color) => { setColor1(color.hex); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Freq</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.frequency]} max={10.0} min={0.0} step={0.01} onValueChange={(value) => { setFrequency1(value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Speed</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.speed]} max={30.0} min={0.0} step={0.01} onValueChange={(value) => { setSpeed1(value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Sharp</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.sharpen]} max={4.0} min={1.0} step={0.01} onValueChange={(value) => { setSharpen1(value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">X</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.center[0]]} max={100.0} min={-100.0} step={0.01} onValueChange={(value) => { setCenterX1(value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Y</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.center[1]]} max={100.0} min={-100.0} step={0.01} onValueChange={(value) => { setCenterY1(value[0]); }} />
        </div>
        <div className='flex justify-center w-full my-2 mt-4'>OSC 2</div>
        <div className="flex items-center row">
            <HuePicker color={controlSettings.oscillator2.color} onChange={(color) => { setColor2(color.hex); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Freq</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.frequency]} max={10.0} min={0.0} step={0.01} onValueChange={(value) => { setFrequency2(value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Speed</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.speed]} max={30.0} min={0.0} step={0.01} onValueChange={(value) => { setSpeed2(value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Sharp</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.sharpen]} max={4.0} min={1.0} step={0.01} onValueChange={(value) => { setSharpen2(value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">X</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.center[0]]} max={100.0} min={-100.0} step={0.01} onValueChange={(value) => { setCenterX2(value[0]); }} />
        </div>
        <div className="flex items-center row">
            <div className="flex w-16 mx-2">Y</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.center[1]]} max={100.0} min={-100.0} step={0.01} onValueChange={(value) => { setCenterY2(value[0]); }} />
        </div>
    </div>
    )
}
