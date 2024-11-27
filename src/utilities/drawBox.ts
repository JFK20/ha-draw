import { useEditor } from "tldraw";
import Entity from "./Entity.ts";

export default function DrawBox(entity: Entity, boxId: string): null {
	const editor = useEditor();

	// Check if the shape already exists
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const existingShape = editor.getShape(`shape:${boxId}`);

	if (!existingShape) {
		// Create a new shape if it doesn't exist

		editor.createShapes([
			{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				id: `shape:${boxId}`,
				type: "text",
				x: 100,
				y: 100,
				props: { text: "uninitialized" },
			},
		]);
	}

	const state: any = entity.state;
	let newColor: string = entity.props.color;
	if (state > entity.threshold) {
		newColor = entity.limit_color;
	}

	const current_x = existingShape?.x;
	const current_y = existingShape?.y;
	// Update the shape's position
	if (
		entity.pos_x !== null &&
		entity.pos_y !== null &&
		current_x !== entity.pos_x &&
		current_y !== entity.pos_y &&
		current_x &&
		current_y
	) {
		editor.updateShapes([
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			{ id: `shape:${boxId}`, x: entity.pos_x, y: entity.pos_y },
		]);
	}

	let text = state;
	if (entity.unit) {
		text += " " + entity.unit;
	}

	// Update the shape's text
	editor.updateShapes([
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			id: `shape:${boxId}`,
			type: "text",
			rotation: entity.rotation,
			opacity: entity.opacity,
			isLocked: entity.isLocked,
			props: {
				autoSize: entity.props.autoSize,
				color: newColor,
				font: entity.props.font,
				scale: entity.props.scale,
				size: entity.props.size,
				text: text,
				textAlign: entity.props.textAlign,
				w: entity.props.w,
			},
		},
	]);

	return null;
}
