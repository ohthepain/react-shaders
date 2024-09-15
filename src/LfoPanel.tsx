import { useStore, LfoType } from './store';
import { Slider } from './components/ui/slider';

interface LfoViewProps {
    id: number;
}

const LfoView = ({ id }: LfoViewProps) => {
    const { setLfoType, setLfoFrequency, lfoSettings } = useStore();
    const lfo = lfoSettings[id];

    const handleLfoFrequencyChange = (value: number[]) => {
        setLfoFrequency(id, value[0]);
    }

    const handleLfoTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLfoType(id, event.target.value as LfoType);
    };

    return (
        <div className="p-2 m-1 bg-white bg-opacity-75 rounded shadow">
            <div className="flex flex-row justify-center">
                {`LFO ${id}`}
            </div>
            <div className="flex flex-row">
                <Slider
                    className="flex my-4"
                    defaultValue={[lfo.frequency]}
                    max={2.0}
                    min={0.0}
                    step={0.01}
                    onValueChange={handleLfoFrequencyChange}
                />
            </div>
            <div className="flex flex-row justify-center">
                <select
                    id={`lfo-type-${id}`}
                    value={lfo.type}
                    onChange={handleLfoTypeChange}
                    className="flex"
                >
                    <option value={LfoType.SINE}>Sine</option>
                    <option value={LfoType.SQUARE}>Square</option>
                    <option value={LfoType.TRIANGLE}>Triangle</option>
                    <option value={LfoType.SAWTOOTH}>Sawtooth</option>
                </select>
            </div>
        </div>
    );
};

export const LfoPanel = () => {
    const lfoSettings = useStore((state) => state.lfoSettings);

    return (
        <div className="absolute top-0 right-0 flex flex-col p-4 ">
            {lfoSettings.map((lfoSetting) => (
                <LfoView key={lfoSetting.id} id={lfoSetting.id} />
            ))}
        </div>
    );    
}
