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
				any,
			]; // Get the first key-value pair
			//console.log(`Entity: ${JSON.stringify(entity)}, Params: ${JSON.stringify(params)}`);
			if (!entity || !params) {
				console.error(
					"Entity configuration is missing entity or parameters:",
					entityConfig,
				);
				return [];
			}

			// Extract the Home Assistant state object for the entity
			const stateObj = (hass.value as any).states[entity];

			const render_attribute =
				(params.render_attribute as string) || "state";
			let render = stateObj[render_attribute] as string;
			if (!render) {
				console.error(
					`the render attribute "${render_attribute} for "${entity}" is not valid`,
				);
				render = stateObj?.state;
			}

			return {
				entity, // The entity ID
				params, // Parameters from the configuration
				attributes: stateObj?.attributes || {},
				//state: stateObj?.state || "unavailable", // State of the entity// Attributes of the entity
				state: render, //what to render
				threshold: (params.threshold as number) || 10, // Threshold value from the parameters
				color: (params.color as string) || "black", // Color value tp what to switch when threshold is reached
				limit_color: (params.limit_color as string) || "red", // Color value tp what to switch when threshold is reached
				unit: (params.unit as string) || null,
				pos_x: (params.x as number) || null, // X position of the entity
				pos_y: (params.y as number) || null, // Y position of the entity
			};
		});
	});

	entityStates.value.forEach((entityState: any, index: number) => {
		/*console.log(
			`Entity: ${entityState.entity}, State: ${entityState.state}, Attributes: ${JSON.stringify(entityState.attributes)}, Params: ${entityState.params}, Threshold: ${entityState.threshold}, Color: ${entityState.color}`,
		);*/
		ChangeBox(entityState, `box${index + 1}`);
	});
}

function ChangeBox(entity: any, boxId: string): null {
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

	const state: any = entity.state;
	let newColor: string = entity.color;
	if (state > entity.threshold) {
		newColor = entity.limit_color;
	}

	const current_x = existingShape?.x;
	const current_y = existingShape?.y;
	// Update the shape's position
	if (
		entity.pos_x !== null &&
		entity.pos_y !== null &&
		current_x !== entity.pos_x &&
		current_y !== entity.pos_y &&
		current_x &&
		current_y
	) {
		editor.updateShapes([
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			{ id: `shape:${boxId}`, x: entity.pos_x, y: entity.pos_y },
		]);
	}

	let text = state;
	if (entity.unit) {
		text += " " + entity.unit;
	}

	// Update the shape's text
	editor.updateShapes([
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		{
			id: `shape:${boxId}`,
			type: "text",
			props: { text: text, color: newColor },
		},
	]);

	return null;
}
