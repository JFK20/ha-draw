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
	if(Colors.indexOf(templateResult) < 0 && group.tldraw.parameter == "color") {
		templateResult = "red"
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

	

	if (group.tldraw.valuetype === "absolute") {
		const num = Number(group.tldraw.lastvalue);
		const current = Number(templateResult);
		if (!isNaN(num) && !isNaN(current)) {
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
		}
			
		const params = group.tldraw.parameter.split(".");
		if(params[1]){
			switch (params[1]){
			case "isClosed":
			case "isComplete":
			case "isPen":
				templateResult = parseOrDefault(templateResult, "boolean");
				break;
			case "size":
				templateResult = parseOrDefault(templateResult, "number");
				break;
			}
		} else {
			switch (params[0]){
			case "isLocked":
				templateResult = parseOrDefault(templateResult, "boolean");
				break;
			case "rotation":
				templateResult = parseOrDefault(templateResult, "number");
			}
		}
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
			lastvalue: templateResult
		};

		editor.updateShape(
			update,
		);
		//https://tldraw.dev/reference/tlschema/TLGeoShapeProps
		
	} catch (e) {
		console.error(e);
		createErrorBox(editor, id, e.toString().substring(0, 50));
	}


	return null;
}

function createErrorBox(editor: Editor, id: string, error: string) {
	const errorID: string = id + "Error"

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const existingShape = editor.getShape(errorID)
	
	if (!existingShape) {
		editor.createShapes([
			{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				id: id + "Error",
				type: "text",
				x: 100,
				y: 100,
				props: { text: `error ${error}`, color: "red" },
			},
		]);
	}
}

function parseOrDefault<T>(
	value: unknown,
	type: 'string' | 'number' | 'boolean',
): T {
	// Base default values
	const defaultValues = {
		'string': '' as unknown as T,
		'number': 0 as unknown as T,
		'boolean': false as unknown as T,
	};

	// Direct type match
	if (typeof value === type) return value as T;

	// Special handling for different types
	try {
		switch(type) {
		case 'string':
			return (value !== null && value !== undefined)
				? String(value) as T
				: defaultValues['string'];

		case 'number':
			return !isNaN( Number(value)) ?  Number(value) as T : defaultValues['number'];

		case 'boolean':
			if (typeof value === 'string') {
				const lowercaseValue = value.toLowerCase();
				return (lowercaseValue === 'true' ? true :
					lowercaseValue === 'false' ? false :
						defaultValues['boolean']) as T;
			}
			return Boolean(value) as T;

		default:
			throw new Error('Unsupported type');
		}
	} catch {
		return defaultValues[type as keyof typeof defaultValues];
	}
}