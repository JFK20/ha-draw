import { useComputed } from "@preact/signals-react";
import cardStates from "../cardStates";
import { useRef } from "react";
import { useEditor } from "tldraw";

export default function InitStates({ cardName }: { cardName: string }) {
	const renderRef = useRef(0);
	renderRef.current++;
	const state = useComputed(() => {
		const { hass, config } = cardStates.value[cardName];
		return (hass.value as any).states[(config.value as any)?.entity]?.state;
	});

	ChangeBox(state.toString())
}

function ChangeBox(state: string  ): null{
	const editor = useEditor()
	console.log("editor: " + editor + "State: " + state)
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	editor.updateShapes([{ id: 'shape:box1', type: 'text', props: { text: state } },
	])

	return null
}
