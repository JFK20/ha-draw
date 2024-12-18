import { Editor, TLUnknownShape } from "tldraw";
import { GroupConfig } from "../types/Entity.ts";
import { Colors } from "./Colors.ts";

export default function DrawBox(editor: Editor, group: GroupConfig): null {
	// Check if the shape already exists

	const id = group.tldraw.id;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const existingShape = editor.getShape(id);

	if (!existingShape) {
		// Create a new shape if it doesn't exist
		createErrorBox(editor, id, `ID: ${id} does not exist`);
		return;
	}

	let templateResult: any = group.template;
	if (
		Colors.indexOf(templateResult) < 0 &&
		group.tldraw.parameter == "color"
	) {
		templateResult = "red";
	}

	//Boxes now have to be created manually

	const current_x = existingShape?.x;
	const current_y = existingShape?.y;
	// Update the shape's position
	if (
		group.tldraw.pos_x !== null &&
		group.tldraw.pos_y !== null &&
		current_x !== group.tldraw.pos_x &&
		current_y !== group.tldraw.pos_y &&
		current_x &&
		current_y
	) {
		editor.updateShapes([
			{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				id: group.tldraw.id,
				x: group.tldraw.pos_x,
				y: group.tldraw.pos_y,
			},
		]);
	}

	//check the castings
	//check for boolean
	if (templateResult === "true") {
		templateResult = true;
	} else if (templateResult === "false") {
		templateResult = false;
	}

	//check Number
	const current = Number(templateResult);
	if (!isNaN(current)) {
		templateResult = current;
	}
	if (group.tldraw.valuetype === "absolute" && !isNaN(templateResult)) {
		const num = Number(group.tldraw.lastvalue);
		if (!isNaN(num)) {
			templateResult = current + num;
		}
	}

	editor.updateShapes({
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		id: id,
		rotation: group.tldraw.rotation,
		opacity: group.tldraw.opacity,
		isLocked: group.tldraw.isLocked,
	});
	try {
		const update: TLUnknownShape = {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			id: id,
			props: {},
			meta: {},
		};

		const params = group.tldraw.parameter.split(".");
		if (params[1]) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			update.props[params[1]] = templateResult;
		} else {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			update[params[0]] = templateResult;
		}
		update["meta"] = {
			lastvalue: templateResult,
		};

		editor.updateShape(update);
		//https://tldraw.dev/reference/tlschema/TLGeoShapeProps
	} catch (e) {
		console.error(e);
		createErrorBox(editor, id, e.toString().substring(0, 50));
	}

	return null;
}

function createErrorBox(editor: Editor, id: string, error: string) {
	const errorID: string = id + "Error";

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const existingShape = editor.getShape(errorID);

	if (!existingShape) {
		editor.createShapes([
			{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				id: id + "Error",
				type: "text",
				x: 100,
				y: 100,
				props: {
					text: `error ${error}`,
					color: "red",
				},
			},
		]);
	}
}
