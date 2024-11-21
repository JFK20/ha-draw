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
			console.error("Entities configuration is not an array:", entitiesFromConfig);
			return [];
		}

		return entitiesFromConfig.map((entity: any) => {
			// Safely access the state
			const stateObj = (hass.value as any).states[entity];
			return {
				entity,
				state: stateObj?.state || "unavailable", // Fallback to "unavailable" if state doesn't exist
				attributes: stateObj?.attributes || {}, // Include attributes for additional info
			};
		});
	});


	entityStates.value.forEach((entityState: any, index: number) => {
		console.log(`Entity: ${entityState.entity}, State: ${entityState.state}, Attributes: ${JSON.stringify(entityState.attributes)}`);
		ChangeBox(entityState.state.toString(), `box${index + 1}`);
	});
}

function ChangeBox(state: string, boxId: string): null {
	const editor = useEditor();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const existingShape = editor.getShape(`shape:${boxId}`);

	if(!existingShape) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		editor.createShapes([{ id: `shape:${boxId}`, type: 'text', x:100, y:100, props: { text: "uninitialized" } },
		])
	}
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	editor.updateShapes([{ id: `shape:${boxId}`, type: 'text', props: { text: state } }]);
	return null;
}
