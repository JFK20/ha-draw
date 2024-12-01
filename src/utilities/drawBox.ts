import { Editor } from "tldraw";
import { GroupConfig } from "../types/Entity.ts";

export default function DrawBox(editor: Editor,group: GroupConfig): null {
	// Check if the shape already exists

	const id = group.tldraw.id
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const existingShape = editor.getShape(id);

	if (!existingShape) {
		// Create a new shape if it doesn't exist

		editor.createShapes([
			{
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				id: id,
				type: "text",
				x: 100,
				y: 100,
				props: { text: "uninitialized" },
			},
		]);
	}

	/*const current_x = existingShape?.x;
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
	}*/

	const text = group.template

	// Update the shape's text
	editor.updateShapes([
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			id: id,
			type: "text",
			rotation: group.tldraw.rotation,
			opacity: group.tldraw.opacity,
			isLocked: group.tldraw.isLocked,
			props: {
				autoSize: group.tldraw.props.autoSize,
				font: group.tldraw.props.font,
				scale: group.tldraw.props.scale,
				size: group.tldraw.props.size,
				text: text,
				textAlign: group.tldraw.props.textAlign,
				w: group.tldraw.props.w,
			},
		},
	]);

	return null;
}
