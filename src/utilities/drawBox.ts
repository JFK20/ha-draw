import { Editor } from "tldraw";
import { GroupConfig } from "../types/Entity.ts";
import { Colors } from "./Colors.ts";

export default function DrawBox(editor: Editor, group: GroupConfig): null {
	// Check if the shape already exists

	const id = group.tldraw.id;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const existingShape = editor.getShape(id);

	let setColor = null;
	let boxType = "text";
	let fill: string = "none";
	if (group.tldraw.parameter === "value") {
		//"https://tldraw.dev/reference/tlschema/TLTextShape"
		boxType = "text";
	} else if (group.tldraw.parameter === "fill") {
		//"https://tldraw.dev/reference/tlschema/TLDrawShape"
		boxType = "geo";
		fill = "solid";
		//console.log(Colors.indexOf(group.template), group.template)
		if (Colors.indexOf(group.template) > -1) {
			//console.log("setColor")
			setColor = group.template;
		}
	}

	if (!existingShape) {
		// Create a new shape if it doesn't exist

		editor.createShapes([
			{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				id: id,
				type: boxType,
				x: 100,
				y: 100,
				//props: { text: "uninitialized" },
			},
		]);
	}

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

	let text: string = group.template;

	if (group.tldraw.valuetype === "absolute") {
		const num = Number(group.tldraw.lastvalue);
		const current = Number(text);
		if (!isNaN(num) && !isNaN(current)) {
			text = String(current + num);
		}
	}

	editor.updateShapes({
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		id: id,
		type: boxType,
		rotation: group.tldraw.rotation,
		opacity: group.tldraw.opacity,
		isLocked: group.tldraw.isLocked,
	});

	if (boxType === "text") {
		editor.updateShape({
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			id: id,
			props: {
				/*autoSize: group.tldraw.props.autoSize,
					color: group.tldraw.props.color,
					font: group.tldraw.props.font,
					scale: group.tldraw.props.scale,
					size: group.tldraw.props.size,*/
				text: text,
				/*textAlign: group.tldraw.props.textAlign,
					w: group.tldraw.props.w,*/
			},
		});
		//https://tldraw.dev/reference/tlschema/TLGeoShapeProps
	} else if (boxType === "geo") {
		editor.updateShape({
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			id: id,
			props: {
				//align: group.tldraw.props.align,
				color: setColor,
				//dash: group.tldraw.props.dash,
				fill: fill,
				/*font: group.tldraw.props.font,
					geo: group.tldraw.props.geo,
					growY: group.tldraw.props.growY,
					h: group.tldraw.props.h,
					labelColor: group.tldraw.props.labelColor,
					scale: group.tldraw.props.scale,
					size: group.tldraw.props.size,
					//text: group.tldraw.props.text,
					verticalAlign: group.tldraw.props.verticalAlign,
					w: group.tldraw.props.w,*/
			},
		});
	}

	return null;
}
