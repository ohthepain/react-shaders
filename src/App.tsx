import { useEffect } from 'react';
import { useStore } from './store';
import { EffectsView } from './EffectsView';
import { ControlPanel } from './ControlPanel';
import { LfoPanel } from './LfoPanel';

export const App = () => {
    const { showControls, toggleShowControls, controllerValues } = useStore();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) {
                return; // Ignore repeated keydown events in React STRICT MODE
            }
            if (event.key === ' ') {
                event.preventDefault();
                toggleShowControls();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    return (
        <div className="flex-col w-full h-full">
            <div className="relative flex items-center justify-center w-full h-full">
                <EffectsView controlSettingsParm={controllerValues}/>
                {showControls && (
                    <>
                        <ControlPanel />
                        <LfoPanel />
                    </>
                )}
            </div>
        </div>
    );
};
