import { useComputed } from "@preact/signals-react";
import cardStates from "../cardStates";
import { useRef } from "react";
import DrawBox from "./drawBox.ts";
import Entity  from "./Entity.ts";
import { TLTextShapeProps} from "tldraw";

interface CardConfig {
	entities?: Entity[];
}

interface HomeAssistantState {
	states: {
		[key: string]: {
			state: string;
			attributes: Record<string, any>;
			[key: string]: any;
		};
	};
}

interface CardState {
	hass: { value: HomeAssistantState };
	config: { value: CardConfig };
}

export default function UpdateStates({ cardName }: { cardName: string }): null {
	const renderRef = useRef(0);
	renderRef.current++;

	const entityStates = useComputed(() => {
		const cardState = cardStates.value[cardName] as CardState;
		if (!cardState?.hass?.value || !cardState?.config?.value) {
			console.error("Missing hass or config for card:", cardName);
			return [];
		}
		const { hass, config } = cardState;

		// Get the list of entities from the card config
		const entities = config.value.entities;
		if (!Array.isArray(entities)) {
			console.error(
				"Entities configuration is not a valid array:",
				entities,
			);
			return [];
		}
		// Process each entity in the array
		return entities.flatMap((entityConfig: any): Entity => {
			// Ensure the entityConfig is an object
			if (
				typeof entityConfig !== "object" ||
				Array.isArray(entityConfig)
			) {
				console.error(
					"Invalid entity configuration item:",
					entityConfig,
				);
				return null;
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
				return null;
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

			//resolving the template
			const template: string = params.template as string ?? "";
			if(template !== ""){

			}

			//reading the props
			const props: TLTextShapeProps = params.props ? {
				autoSize: params.props.autoSize ?? true,
				color: params.props.color ?? "black",
				font: params.props.font ?? "draw",
				scale: params.props.scale ?? 1,
				size: params.props.size ?? "m",
				textAlign: params.props.textAlign ?? "middle",
				text: "not in use",
				w: params.props.w ?? 200,
			} : {
				autoSize: true,
				color: "black",
				font: "draw",
				scale: 1,
				size: "m",
				textAlign: "middle",
				text: "not in use",
				w: 200,
			};

			return {
				entity, // The entity ID
				params, // Parameters from the configuration
				attributes: stateObj?.attributes ?? {},
				//state: stateObj?.state || "unavailable", // State of the entity// Attributes of the entity
				template: (params.template as string) ?? "",
				state: render, //what to render
				threshold: (params.threshold as number) ?? 10, // Threshold value from the parameters
				limit_color: (params.limit_color as string) ?? "red", // Color value tp what to switch when threshold is reached
				unit: (params.unit as string) ?? null,
				pos_x: (params.x as number) ?? null, // X position of the entity
				pos_y: (params.y as number) ?? null, // Y position of the entity
				rotation: (params.rotation as number) ?? 0, // Rotation of the entity
				opacity: (params.opacity as number) ?? 1, // Opacity of the entity
				isLocked: (params.isLocked as boolean) ?? false, // Lock the entity in place
				props: props
			};
		});
	});

	entityStates.value.forEach((entityState: Entity, index: number) => {
		/*console.log(
			`Entity: ${entityState.entity}, State: ${entityState.state}, Attributes: ${JSON.stringify(entityState.attributes)}, Params: ${entityState.params}, Threshold: ${entityState.threshold}, Color: ${entityState.color}`,
		);*/
		DrawBox(entityState, `box${index + 1}`);
	});
	return null;
}
