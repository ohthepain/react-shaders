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
        setSpeed2
    } = useStore();

    return (
    <div className="absolute top-0 left-0 m-4 p-2 bg-white bg-opacity-75 rounded shadow">
        <div className='flex mt-4 mb-2 w-full justify-center'>Balance</div>
        <Slider defaultValue={[controlSettings.balance]} max={1.0} min={0.0} step={0.01} onValueChange={(value) => { setBalance(value[0]); }} />
        <div className='flex mt-4 my-2 w-full justify-center'>OSC 1</div>
        <HuePicker color={controlSettings.oscillator1.color} onChange={(color) => { console.log(color); setColor1(color.hex); }} />
        <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.frequency]} max={100.0} min={0.0} step={0.01} onValueChange={(value) => { setFrequency1(value[0]); }} />
        <Slider className="flex my-4" defaultValue={[controlSettings.oscillator1.speed]} max={100.0} min={0.0} step={0.01} onValueChange={(value) => { setSpeed1(value[0]); }} />
        <div className='flex mt-4 my-2 w-full justify-center'>OSC 2</div>
        <HuePicker color={controlSettings.oscillator2.color} onChange={(color) => { setColor2(color.hex); }} />
        <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.frequency]} max={100.0} min={0.0} step={0.01} onValueChange={(value) => { setFrequency2(value[0]); }} />
        <Slider className="flex my-4" defaultValue={[controlSettings.oscillator2.speed]} max={100.0} min={0.0} step={0.01} onValueChange={(value) => { setSpeed2(value[0]); }} />
    </div>
    )
}
