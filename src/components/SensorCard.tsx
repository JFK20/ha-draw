import { useSensorData } from './useSensorData';

// @ts-ignore
export default function SensorCard({ entityId }) {
	const sensorData = useSensorData(entityId);

	return (
		<div>
			<h3>Sensor Data</h3>
			<p>{sensorData}</p>
		</div>
	);
};
