import React from "react";
import cardStates from "../cardStates";
import { GroupConfig, TlDrawParams } from "../types/Entity.ts";
import { useEditor } from "tldraw";
import { CardState, HomeAssistantState } from "../types/hass.ts";
import TemplateService from "../api/TemplateService";
import { useSignalEffect } from "@preact/signals-react";
import DrawBox from "./drawBox.ts";

interface UseUpdateStatesProps {
	cardName: string;
}

const UseUpdateStates: React.FC<UseUpdateStatesProps> = ({ cardName }) => {
	//The editor we need to manipulate the Canvas
	const editor = useEditor();
	let entityList: any[] = []

	useSignalEffect(() => {
		async function processStates() {
			const cardState = cardStates.value[cardName] as CardState;
			if (!cardState?.hass?.value || !cardState?.config?.value) {
				console.error("Missing hass or config for card:", cardName);
				return;
			}
			//get the has object itself and the config
			const { hass, config } = cardState;

			// Get the list of groups from the card config
			const groups = config.value.groups;
			//and check if the config is vavlid
			if (!Array.isArray(groups)) {
				console.error(
					"Groups configuration is not a valid array:",
					groups,
				);
				return;
			}

			//for every group get the given list of entities
			for (const group of groups) {
				//and check if they are valid
				if (!Array.isArray(group.entities)) {
					console.error(
						"Entities configuration is not a valid array:",
						groups,
					);
					return;
				}
				entityList = []
				for(const entity of group.entities) {
					const newEntity = (hass.value as any).states[entity];
					entityList.push(newEntity);
				}
				
			}

			for (const group of groups) {
				await processGroup(group, hass.value, editor);
			}
		}
		processStates();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
	}, [entityList]); // Just Update when something in a given entity changes
	return null;
};

async function processGroup(
	group: GroupConfig,
	hass: HomeAssistantState,
	editor: any,
) {
	const templateService = new TemplateService(
		hass.auth.data.hassUrl,
		hass.auth.data.access_token,
	);
	//console.log(group)

	let groupTemplateResult = null;
	if (group.template) {
		try {
			groupTemplateResult = await templateService.resolveTemplate(
				group.template,
			);
		} catch (error) {
			console.error("Error processing group template:", error);
			groupTemplateResult = group.tldraw?.on_error ?? null;
		}
	}
	
	const id = "shape:" + group.tldraw.id;
	const existingShape = editor.getShape(id);

	let tldrawParams: TlDrawParams = null;
	if (group.tldraw && groupTemplateResult !== null) {
		
		tldrawParams = {
			id: id,
			pos_x: group.tldraw.pos_x,
			pos_y: group.tldraw.pos_y,
			parameter: group.tldraw.parameter,
			valuetype: group.tldraw.valuetype,
			lastvalue: existingShape?.meta?.lastvalue ?? "",
			on_error: group.tldraw.on_error,
			rotation: group.tldraw.rotation,
			opacity: group.tldraw.opacity,
			isLocked: group.tldraw.isLocked,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			props: { },
		};
	}

	const groupconfig: GroupConfig = {
		template: groupTemplateResult,
		tldraw: tldrawParams,
		entities: group.entities,
	};

	DrawBox(editor, groupconfig);
}

export default UseUpdateStates;
