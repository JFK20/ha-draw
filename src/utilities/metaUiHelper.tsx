import { track, useEditor } from "tldraw";

export const MetaUiHelper = track(function MetaUiHelper() {
	const editor = useEditor();
	const onlySelectedShape = editor.getOnlySelectedShape() as any | null;

	return (
		<pre
			style={{
				position: "absolute",
				zIndex: 300,
				top: 64,
				left: 12,
				margin: 0,
				userSelect: 'text',
				pointerEvents: 'auto'
			}}
			onCopy={(e) => {
				// Optional: handle copying explicitly if needed
				const text = onlySelectedShape
					? onlySelectedShape.id
					: "Select one shape to see its meta data.";
				e.clipboardData.setData("text/plain", text);
			}}
		>
			{onlySelectedShape
				? `id: ${onlySelectedShape.id}\n x: ${onlySelectedShape.x}\n y: ${onlySelectedShape.y}\n`
				: "Select one shape to see its meta data."}
		</pre>
	);
});
