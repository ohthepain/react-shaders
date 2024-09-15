import { useState } from "react";
import { useStore, ModulationSettings } from "./store";
import { Slider } from "./components/ui/slider";
import { HuePicker } from "react-color";
import { controllerInfo, ControllerId } from "./Modulation";

interface ControllerProps {
  oscId: number;
  controllerId: number;
}

const ControllerView = ({ oscId, controllerId }: ControllerProps) => {
  const { setControllerValue, setLfoId, setLfoAmount } = useStore();
  const controller = controllerInfo[controllerId];
  const oscillatorSettings = useStore((state) => state.controllerValues.oscillators[oscId]);
  const [showLfoPanel, setShowLfoPanel] = useState(false);

  const handleValueChange = (values: number[]) => {
    let value = values[0];
    console.log(
      `handleValueChange: osc ${oscId} controller ${controllerId} value: ${values[0]} -> @{value}`
    );
    if (controller.curve === "squared") {
      value = value * value;
    }
    setControllerValue(oscId, controllerId, value);
  };

  const handleLfoAmountChange = (amount: number) => {
    console.log(`handleLfoAmountChange: osc ${oscId} controller ${controllerId} amount: ${amount}`);
    setLfoAmount(oscId, controllerId, amount);
  };

  const handleLfoIdChange = (lfoId: number) => {
    console.log(`handleLfoIdChange: osc ${oscId} controller ${controllerId} lfoId: ${lfoId}`);
    setLfoId(oscId, controllerId, lfoId);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center row">
        <div
          className="flex w-16 mx-2"
          onClick={() => {
            setShowLfoPanel(!showLfoPanel);
          }}
        >
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
      <div className="flex flex-row w-full">
        {showLfoPanel && (
          <ModulationSettingsPanel
            modulationSettings={oscillatorSettings.modulationSettings[controllerId]}
            onLfoIdChange={handleLfoIdChange}
            onAmountChange={handleLfoAmountChange}
          />
        )}
      </div>
    </div>
  );
};

interface OscillatorSettingsProps {
  oscId: number;
}

const OscillatorSettings = ({ oscId }: OscillatorSettingsProps) => {
  const { controllerValues, setControllerValue } = useStore();

  const colorString = (): string => {
    const r = controllerValues.oscillators[oscId].controllers[ControllerId.R];
    const g = controllerValues.oscillators[oscId].controllers[ControllerId.G];
    const b = controllerValues.oscillators[oscId].controllers[ControllerId.B];
    const toHex = (value: number) =>
      Math.round(value * 255)
        .toString(16)
        .padStart(2, "0");
    const s = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return s;
  };

  return (
    <>
      <div className="flex justify-center w-full my-2 mt-4">OSC 1</div>
      <div className="flex items-center row">
        <HuePicker
          color={colorString()}
          onChange={(color) => {
            setControllerValue(oscId, ControllerId.R, color.rgb.r / 255);
            setControllerValue(oscId, ControllerId.G, color.rgb.g / 255);
            setControllerValue(oscId, ControllerId.B, color.rgb.b / 255);
          }}
        />
      </div>
      {Array.from({ length: ControllerId.NumControllers }, (_, id) => (
        <ControllerView key={id} oscId={oscId} controllerId={id} />
      ))}
    </>
  );
};

interface ModulationSettingsProps {
  modulationSettings: ModulationSettings;
  onLfoIdChange: (lfoId: number) => void;
  onAmountChange: (amount: number) => void;
}

const ModulationSettingsPanel = ({
  modulationSettings,
  onLfoIdChange,
  onAmountChange,
}: ModulationSettingsProps) => {

    const { lfoSettings } = useStore();

  const handleAmountChange = (value: number[]) => {
    onAmountChange(value[0]);
  };

  const handleLfoIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLfoIdChange(Number(event.target.value));
  };

  return (
    <div className="flex items-center w-full row">
      <div className="flex justify-center w-16">
        <select value={modulationSettings.lfoId} onChange={handleLfoIdChange} className="bg-transparent">
        <option value={-1}>LFO ?</option>
        {lfoSettings.map((lfoSetting) => (
          <option value={lfoSetting.id}>LFO {lfoSetting.id}</option>
        ))}
        </select>
      </div>
      <Slider
        className="flex w-full my-4"
        defaultValue={[modulationSettings.amount]}
        max={1.0}
        min={0.0}
        step={0.01}
        onValueChange={handleAmountChange}
      />
    </div>
  );
};

export const ControlPanel = () => {
  const { controllerValues, setBalance } = useStore();

  return (
    <div className="absolute top-0 left-0 p-2 m-4 bg-white bg-opacity-75 rounded shadow">
      <div className="flex justify-center w-full mt-4 mb-2">Balance</div>
      <div className="flex items-center row">
        <Slider
          defaultValue={[controllerValues.balance]}
          max={1.0}
          min={0.0}
          step={0.01}
          onValueChange={(value) => {
            setBalance(value[0]);
          }}
        />
      </div>
      <OscillatorSettings oscId={0} />
      <OscillatorSettings oscId={1} />
    </div>
  );
};
