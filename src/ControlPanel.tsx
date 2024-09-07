import { useStore } from './store';

export const ControlPanel = () => {
    const { increaseCount, decreaseCount } = useStore();

    return (
    <div className="absolute top-0 left-0 m-4 p-2 bg-white bg-opacity-75 rounded shadow">
        <button className="m-2 p-2 bg-blue-500 text-white rounded" onClick={decreaseCount}>up</button>
        <button className="m-2 p-2 bg-blue-500 text-white rounded" onClick={increaseCount}>dn</button>
    </div>
    )
}
