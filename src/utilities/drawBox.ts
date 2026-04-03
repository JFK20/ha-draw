import { Editor, TLParentId, TLUnknownShape, toRichText } from "tldraw";
import { GroupConfig } from "../types/Entity.ts";
import { DefaultColorStyle, TLShapeId } from "tldraw";

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
		const update: TLUnknownShape = {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			id: id,
			props: {},
			meta: {},
		};

		const params = group.tldraw.parameter.split(".");
		console.log(params);
		try {
			if (params[1]) {
				if (params[1] === "richText") {
					console.log(`converting ${templateResult} to rich text`);
					templateResult = toRichText(templateResult);
				}
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
		} catch (e) {
			update.props = {
				richText: toRichText(`error ${e.toString().substring(0, 50)}`),
				...update.props,
			};
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
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
