import { useComputed } from "@preact/signals-react";
import cardStates from "../cardStates";
import { useRef } from "react";
import { useEditor } from "tldraw";

export default function UpdateStates({ cardName }: { cardName: string }) {
	const renderRef = useRef(0);
	renderRef.current++;

	const entityStates = useComputed(() => {
		const { hass, config } = cardStates.value[cardName];
		if (!hass || !config) {
			console.warn("Missing hass or config for card:", cardName);
			return [];
		}

		// Get the list of entities from the card config
		const entitiesFromConfig = (config.value as any)?.entities || [];
		if (!Array.isArray(entitiesFromConfig)) {
			console.error(
				"Entities configuration is not a valid array:",
				entitiesFromConfig,
			);
			return [];
		}
		// Process each entity in the array
		return entitiesFromConfig.flatMap((entityConfig: any) => {
			// Ensure the entityConfig is an object
			if (
				typeof entityConfig !== "object" ||
				Array.isArray(entityConfig)
			) {
				console.error(
					"Invalid entity configuration item:",
					entityConfig,
				);
				return [];
			}

			// Extract the entity key and parameters
			const [entity, params] = Object.entries(entityConfig)[0] as [
				string,
				any[],
			]; // Get the first key-value pair
			if (!entity || !params) {
				console.error(
					"Entity configuration is missing entity or parameters:",
					entityConfig,
				);
				return [];
			}

			// Extract the Home Assistant state object for the entity
			const stateObj = (hass.value as any).states[entity];

			return {
				entity, // The entity ID (e.g., "sensor.plug_pcsetup_leistung")
				state: stateObj?.state || "unavailable", // State of the entity
				attributes: stateObj?.attributes || {}, // Attributes of the entity
				params, // Parameters from the configuration
				threshold:
					(params[params.indexOf("threshold")] as number) || 10, // Threshold value from the parameters
				color: (params[params.indexOf("color")] as string) || "red", // Color value tp what to switch when threshold is reached
			};
		});
	});

	entityStates.value.forEach((entityState: any, index: number) => {
		console.log(
			`Entity: ${entityState.entity}, State: ${entityState.state}, Attributes: ${JSON.stringify(entityState.attributes)}, Params: ${entityState.params}, Threshold: ${entityState.threshold}, Color: ${entityState.color}`,
		);
		ChangeBox(entityState.state.toString(), `box${index + 1}`);
	});
}

function ChangeBox(state: string, boxId: string): null {
	const editor = useEditor();

	// Check if the shape already exists
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const existingShape = editor.getShape(`shape:${boxId}`);

	if (!existingShape) {
		// Create a new shape if it doesn't exist

		editor.createShapes([
			{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				id: `shape:${boxId}`,
				type: "text",
				x: 100,
				y: 100,
				props: { text: "uninitialized" },
			},
		]);
	}

	// Update the shape's text

	editor.updateShapes([
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		{ id: `shape:${boxId}`, type: "text", props: { text: state } },
	]);

	return null;
}
