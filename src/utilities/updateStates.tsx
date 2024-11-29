import React from 'react';
import cardStates from "../cardStates";
import DrawBox from "./drawBox.ts";
import Entity from "../types/Entity.ts";
import { TLTextShapeProps, useEditor } from "tldraw";
import { CardState, HomeAssistantState } from "../types/hass.ts";
import TemplateService from "../api/TemplateService";
import { useSignalEffect } from "@preact/signals-react";

interface UseUpdateStatesProps {
	cardName: string;
}

const UseUpdateStates: React.FC<UseUpdateStatesProps> = ({ cardName }) => {
	const editor = useEditor();

	// Run the effect whenever card state or entities change
	
	useSignalEffect(() => {
		async function processStates() {
			const cardState = cardStates.value[cardName] as CardState;
			if (!cardState?.hass?.value || !cardState?.config?.value) {
				console.error("Missing hass or config for card:", cardName);
				return;
			}
			const { hass, config } = cardState;

			// Get the list of entities from the card config
			const entities = config.value.entities;
			if (!Array.isArray(entities)) {
				console.error("Entities configuration is not a valid array:", entities);
				return;
			}

			// Process each entity in the array
			const processedEntities = await Promise.all(
				entities.map(async (entityConfig: any): Promise<Entity | null> => {
					if (typeof entityConfig !== "object" || Array.isArray(entityConfig)) {
						console.error("Invalid entity configuration item:", entityConfig);
						return null;
					}

					const [entity, params] = Object.entries(entityConfig)[0] as [string, any];
					if (!entity || !params) {
						console.error("Entity configuration is missing entity or parameters:", entityConfig);
						return null;
					}

					const stateObj = (hass.value as HomeAssistantState).states[entity];
					const render_attribute = params.render_attribute || "state";
					let render = stateObj[render_attribute] || stateObj?.state;

					const template = params.template || "";
					if (template) {
						const templateService = new TemplateService(
							hass.value.auth.data.hassUrl,
							hass.value.auth.data.access_token
						);
						render = await templateService.resolveTemplate(template);
					}

					const props: TLTextShapeProps = {
						autoSize: params.props?.autoSize ?? true,
						color: params.props?.color ?? "black",
						font: params.props?.font ?? "draw",
						scale: params.props?.scale ?? 1,
						size: params.props?.size ?? "m",
						textAlign: params.props?.textAlign ?? "middle",
						text: "not in use",
						w: params.props?.w ?? 200,
					};

					return {
						entity,
						params,
						attributes: stateObj?.attributes ?? {},
						template,
						state: render,
						threshold: params.threshold ?? 10,
						limit_color: params.limit_color ?? "red",
						unit: params.unit ?? null,
						pos_x: params.x ?? null,
						pos_y: params.y ?? null,
						rotation: params.rotation ?? 0,
						opacity: params.opacity ?? 1,
						isLocked: params.isLocked ?? false,
						props,
					};
				})
			);

			// Draw boxes for valid entities
			processedEntities
				.filter((entityState): entityState is Entity => entityState !== null)
				.forEach((entityState, index) => {
					DrawBox(editor, entityState, `box${index + 1}`);
				});
		}

		processStates();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
	}, [cardStates.value[cardName]?.hass?.value]); // Depend on changes in card states
	return null;
};

export default UseUpdateStates;
