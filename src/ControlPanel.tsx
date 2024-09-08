import { useStore } from './store';
import { Slider } from './components/ui/slider';
import { HuePicker } from 'react-color';

export const ControlPanel = () => {
    const {
        setBalance, 
        controlSettings,
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

    return (
    <div className="absolute top-0 left-0 m-4 p-2 bg-white bg-opacity-75 rounded shadow">
        <div className='flex mt-4 mb-2 w-full justify-center'>Balance</div>
        <div className="flex row items-center">
            <Slider defaultValue={[controlSettings.balance]} max={1.0} min={0.0} step={0.01} onValueChange={(value) => { setBalance(value[0]); }} />
        </div>
        <div className='flex mt-4 my-2 w-full justify-center'>OSC 1</div>
        <div className="flex row items-center">
            <HuePicker color={controlSettings.oscillator1.color} onChange={(color) => { console.log(color); setColor1(color.hex); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">Freq</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.frequency]} max={10.0} min={0.0} step={0.01} onValueChange={(value) => { setFrequency1(value[0]); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">Speed</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.speed]} max={30.0} min={0.0} step={0.01} onValueChange={(value) => { setSpeed1(value[0]); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">Sharp</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.sharpen]} max={4.0} min={1.0} step={0.01} onValueChange={(value) => { setSharpen1(value[0]); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">X</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.center[0]]} max={1280.0} min={0.0} step={0.01} onValueChange={(value) => { setCenterX1(value[0]); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">Y</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.center[1]]} max={1024.0} min={0.0} step={0.01} onValueChange={(value) => { setCenterY1(value[0]); }} />
        </div>
        <div className='flex mt-4 my-2 w-full justify-center'>OSC 2</div>
        <div className="flex row items-center">
            <HuePicker color={controlSettings.oscillator2.color} onChange={(color) => { setColor2(color.hex); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">Freq</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.frequency]} max={10.0} min={0.0} step={0.01} onValueChange={(value) => { setFrequency2(value[0]); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">Speed</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.speed]} max={30.0} min={0.0} step={0.01} onValueChange={(value) => { setSpeed2(value[0]); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">Sharp</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.sharpen]} max={4.0} min={1.0} step={0.01} onValueChange={(value) => { setSharpen2(value[0]); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">X</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.center[0]]} max={1280.0} min={0.0} step={0.01} onValueChange={(value) => { setCenterX2(value[0]); }} />
        </div>
        <div className="flex row items-center">
            <div className="flex mx-2 w-16">Y</div>
            <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.center[1]]} max={1024.0} min={0.0} step={0.01} onValueChange={(value) => { setCenterY2(value[0]); }} />
        </div>
    </div>
    )
}
