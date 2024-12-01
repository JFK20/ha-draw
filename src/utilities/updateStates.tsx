import React from 'react';
import cardStates from "../cardStates";
import { GroupConfig, TldrawParams } from "../types/Entity.ts";
import { TLTextShapeProps, useEditor } from "tldraw";
import { CardState, HomeAssistantState } from "../types/hass.ts";
import TemplateService from "../api/TemplateService";
import { useSignalEffect } from "@preact/signals-react";
import DrawBox from "./drawBox.ts";

interface UseUpdateStatesProps {
	cardName: string;
}

const UseUpdateStates: React.FC<UseUpdateStatesProps> = ({ cardName }) => {
	const editor = useEditor();


	useSignalEffect(() => {
		async function processStates() {
			const cardState = cardStates.value[cardName] as CardState;
			if (!cardState?.hass?.value || !cardState?.config?.value) {
				console.error("Missing hass or config for card:", cardName);
				return;
			}
			const { hass, config } = cardState;

			// Get the list of entities from the card config
			const groups = config.value.groups
			if (!Array.isArray(groups)) {
				console.error("Groups configuration is not a valid array:", groups);
				return;
			}

			for (const group of groups) {
				await processGroup(group, hass.value, editor);
			}
		}
		processStates();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
	}, [cardStates.value[cardName]?.hass?.value]); // Depend on changes in card states
	return null;
};

async function processGroup(
	group: GroupConfig,
	hass: HomeAssistantState,
	editor: any
) {
	const templateService = new TemplateService(
		hass.auth.data.hassUrl,
		hass.auth.data.access_token
	);
	console.log(group)

	let groupTemplateResult = null;
	if (group.template) {
		try {
			groupTemplateResult = await templateService.resolveTemplate(group.template);
		} catch (error) {
			console.error("Error processing group template:", error);
			groupTemplateResult = group.tldraw?.on_error ?? null;
		}
	}
	console.log(`grouptemplateresult ${groupTemplateResult}`);

	const props: TLTextShapeProps = group.tldraw.props ? {
		autoSize: group.tldraw.props.autoSize ?? true,
		color: group.tldraw.props.color ?? "black",
		font: group.tldraw.props.font ?? "draw",
		scale: group.tldraw.props.scale ?? 1,
		size: group.tldraw.props.size ?? "m",
		textAlign: group.tldraw.props.textAlign ?? "middle",
		text: "not in use",
		w: group.tldraw.props.w ?? 200,
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

	console.log(`props ${props.color}`);

	let tldrawParams: TldrawParams = null
	if (group.tldraw && groupTemplateResult !== null) {
		tldrawParams = {
			id: "shape:" + group.tldraw.id,
			parameter: group.tldraw.parameter,
			valuetype: group.tldraw.valuetype,
			on_error: group.tldraw.on_error,
			rotation: group.tldraw.rotation,
			opacity: group.tldraw.opacity,
			isLocked: group.tldraw.isLocked,
			props: props,
		}
	}

	console.log(`tldrawparams ${tldrawParams?.id}`);

	const groupconfig: GroupConfig = {
		template: groupTemplateResult,
		tldraw: tldrawParams,
		entities: group.entities,
	}
	console.log(groupconfig);
	DrawBox(editor, groupconfig);
}

export default UseUpdateStates;
