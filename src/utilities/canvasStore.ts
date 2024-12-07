import { Editor, getSnapshot } from "tldraw";
import FileService from "../api/FileService.ts";
import cardStates from "../cardStates.ts";
import { CardState } from "../types/hass.ts";

export default function saveSnapshot(editor: Editor, cardName: string) {
	const cardState = cardStates.value[cardName] as CardState;
	if (!cardState?.hass?.value) {
		console.error("Missing hass or config for card:", cardName);
		return;
	}
	const { hass } = cardState;
	
	const { document } = getSnapshot(editor.store)
	console.log(JSON.stringify(document));
	const fileService = new FileService(hass.value.auth.data.hassUrl, hass.value.auth.data.access_token);
	console.log(fileService.getServices())
	
}