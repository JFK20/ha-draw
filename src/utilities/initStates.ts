import { useComputed } from "@preact/signals-react";
import cardStates from "../cardStates";
import { useRef } from "react";
import { useEditor } from "tldraw";

export default function InitStates({ cardName }: { cardName: string }) {
	const renderRef = useRef(0);
	renderRef.current++;
	const state = useComputed(() => {
		const { hass, config } = cardStates.value[cardName];
		const entities = (hass.value as any).states[(config.value as any)?.entities] || [];
		return entities.map((entity: any) => ({
			entity,
			state: entity?.state
		}));
	});
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	state.value.forEach((entityState, index) => {
		console.log(entityState + " : " + Object.getOwnPropertyNames(entityState) + " : " + index);
		//ChangeBox(entityState.state?.toString(), `box${index + 1}`);
	});
}

function ChangeBox(state: string, boxId: string): null {
	const editor = useEditor();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	if(!editor.getShape(boxId)){
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
