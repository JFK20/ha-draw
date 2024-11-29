import React, { useEffect } from 'react';
import cardStates from "../cardStates";
import DrawBox from "./drawBox.ts";
import Entity from "../types/Entity.ts";
import { TLTextShapeProps, useEditor } from "tldraw";
import { CardState, HomeAssistantState } from "../types/hass.ts";
import TemplateService from "../api/TemplateService";

interface UseUpdateStatesProps {
	cardName: string;
}

const UseUpdateStates: React.FC<UseUpdateStatesProps> = ({ cardName }) => {
	const editor = useEditor();
	useEffect(() => {
		async function processStates() {
			const cardState = cardStates.value[cardName] as CardState;
			if (!cardState?.hass?.value || !cardState?.config?.value) {
				console.error("Missing hass or config for card:", cardName);
				return;
			}
			const { hass, config } = cardState;
			console.log(hass.value.auth.data.hassUrl)
			console.log(hass.value.auth.data.access_token)

			// Get the list of entities from the card config
			const entities = config.value.entities;
			if (!Array.isArray(entities)) {
				console.error("Entities configuration is not a valid array:", entities);
				return;
			}

			// Process each entity in the array
			const processedEntities = await Promise.all(
				entities.map(async (entityConfig: any): Promise<Entity | null> => {
					// Validate entity configuration
					if (typeof entityConfig !== "object" || Array.isArray(entityConfig)) {
						console.error("Invalid entity configuration item:", entityConfig);
						return null;
					}

					// Extract the entity key and parameters
					const [entity, params] = Object.entries(entityConfig)[0] as [string, any];
					if (!entity || !params) {
						console.error("Entity configuration is missing entity or parameters:", entityConfig);
						return null;
					}

					// Extract the Home Assistant state object for the entity
					const stateObj = (hass.value as HomeAssistantState).states[entity];

					// Determine render attribute
					const render_attribute = (params.render_attribute as string) || "state";
					let render = stateObj[render_attribute] as string;
					if (!render) {
						console.error(`Render attribute "${render_attribute}" for "${entity}" is not valid`);
						render = stateObj?.state;
					}

					// Resolve template if present
					const template: string = params.template as string ?? "";
					if (template !== "") {
						const templateService = new TemplateService(hass.value.auth.data.hassUrl, hass.value.auth.data.access_token)
						const tmp = await templateService.resolveTemplate(template);
						console.log(tmp);
						render = tmp;
					}

					// Prepare props with sensible defaults
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

					// Construct and return entity object
					return {
						entity,
						params,
						attributes: stateObj?.attributes ?? {},
						template: template,
						state: render,
						threshold: (params.threshold as number) ?? 10,
						limit_color: (params.limit_color as string) ?? "red",
						unit: (params.unit as string) ?? null,
						pos_x: (params.x as number) ?? null,
						pos_y: (params.y as number) ?? null,
						rotation: (params.rotation as number) ?? 0,
						opacity: (params.opacity as number) ?? 1,
						isLocked: (params.isLocked as boolean) ?? false,
						props: props
					};
				})
			);

			// Draw boxes for valid entities
			processedEntities
				.forEach((entityState: Entity, index: number) => {
					DrawBox(editor, entityState, `box${index + 1}`);
				});
		}

		processStates();
	}, [cardName]); // Dependency array to re-run when cardName changes

	// Render nothing as this is a side-effect component
	return null;
};

export default UseUpdateStates;