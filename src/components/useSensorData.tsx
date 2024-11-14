import { useState, useEffect } from 'react';

export const useSensorData = (entityId: string) => {
	const [sensorData, setSensorData] = useState(null);

	useEffect(() => {
		const fetchSensorData = async () => {
			const response = await fetch(`/api/states/${entityId}`);
			const data = await response.json();
			setSensorData(data.state);
		};

		fetchSensorData();
	}, [entityId]);

	return sensorData;
};