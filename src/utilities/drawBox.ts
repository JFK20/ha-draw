import {
	Editor,
	TLParentId, TLShapePartial,
	toRichText,
} from "tldraw";
import { GroupConfig } from "../types/Entity.ts";
import { DefaultColorStyle, TLShapeId } from "tldraw";

export default function DrawBox(editor: Editor, group: GroupConfig): null {
	// Check if the shape already exists

	const id = group.tldraw.id as TLShapeId;
	const existingShape = editor.getShape(id);

	if (!existingShape) {
		// Create a new shape if it doesn't exist
		createErrorBox(editor, id, `ID: ${id} does not exist`);
		return;
	}

	let templateResult: any = group.template;
	if (
		//https://tldraw.dev/reference/tlschema/DefaultColorStyle
		DefaultColorStyle.values.indexOf(templateResult) < 0 &&
		group.tldraw.parameter.toLowerCase() === "props.color"
	) {
		templateResult = "red";
	}

	//Boxes now have to be created manually

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

	try {
		const update: TLShapePartial = {
			id: id,
			type: existingShape.type,
			props: {},
			meta: {},
		};


		const params = group.tldraw.parameter.split(".");

		try {
			if (params[1]) {
				if (params[1] === "richText") {
					templateResult = toRichText(templateResult);
				}
				// Type assertion for props
				(update.props as Record<string, any>)[params[1]] = templateResult;
			} else {
				(update as any)[params[0]] = templateResult;
			}
			update["meta"] = {
				lastvalue: templateResult,
			};
		} catch (e) {
			update.props = {
				richText: toRichText(`error ${e.toString().substring(0, 50)}`),
				...update.props,
			};
		}

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

	const existingShape = editor.getShape(errorID as TLParentId);

	if (!existingShape) {
		editor.createShape({
			id: (id + "Error") as TLShapeId,
			type: "text",
			x: 100,
			y: 100,
			props: {
				richText: toRichText(`error ${error}`),
				color: "red",
			},
		});
	}
}
