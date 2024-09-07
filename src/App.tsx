import { useEffect } from 'react';
import { useStore } from './store';
import { EffectsView } from './EffectsView';
import { ControlPanel } from './ControlPanel';

export const App = () => {
    const { showControls, toggleShowControls } = useStore();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) {
                return; // Ignore repeated keydown events in React STRICT MODE
            }
            if (event.key === ' ') {
                event.preventDefault();
                console.log(`showControls: ${showControls}`);
                toggleShowControls();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    return (
        <div className="flex-col h-full w-full">
            <div className="relative flex justify-center items-center h-full w-full">
                <EffectsView />
                {showControls && (
                    <ControlPanel />
                )}
            </div>
        </div>
    );
};
