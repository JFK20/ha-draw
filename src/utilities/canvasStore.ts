import { Editor, getSnapshot, loadSnapshot } from "tldraw";
import FileService from "../api/FileService.ts";
import cardStates from "../cardStates.ts";
import { CardState } from "../types/hass.ts";

export async function saveSnapshotToServer(editor: Editor, cardName: string): Promise<void> {
	const cardState = cardStates.value[cardName] as CardState;
	if (!cardState?.hass?.value) {
		console.error("Missing hass or config for card:", cardName);
		return;
	}
	const { hass } = cardState;
	
	const { document } = getSnapshot(editor.store)
	const fileService = new FileService(hass.value.auth.data.hassUrl, hass.value.auth.data.access_token);
	try{
		fileService.sendSnapShot(document)
	} catch(err) {
		console.error(err);
	}
}

export async function getSnapShotFromServer(editor: Editor, cardName: string): Promise<void> {
	const cardState = cardStates.value[cardName] as CardState;
	if (!cardState?.hass?.value) {
		console.error("Missing hass or config for card:", cardName);
		return;
	}
	const { hass } = cardState;

	const fileService = new FileService(hass.value.auth.data.hassUrl, hass.value.auth.data.access_token);
	try {
		const jsonData: string = await fileService.getSnapShot()
		const document = JSON.parse(jsonData)
		editor.setCurrentTool('select')
		loadSnapshot(editor.store, { document })
	} catch (err) {
		console.error(err);
		return
	}

}