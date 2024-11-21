/* eslint-disable @typescript-eslint/no-namespace */
import React, { useLayoutEffect, useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
//import StateViewer from "./components/StateViewer";
//import ConfigViewer from "./components/ConfigViewer";
import { Tldraw, track, useEditor } from "tldraw";
import "tldraw/tldraw.css";

import UpdateStates from "./utilities/updateStates.ts";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"ha-card": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
		}
	}
}

function InsideOfContext({ cardName }: { cardName: string }): null {
	UpdateStates({ cardName });
	return null;
}

export const MetaUiHelper = track(function MetaUiHelper() {
	const editor = useEditor()
	const onlySelectedShape = editor.getOnlySelectedShape() as any | null

	return (
		<pre style={{ position: 'absolute', zIndex: 300, top: 64, left: 12, margin: 0 }}>
			{onlySelectedShape
				? `id: ${onlySelectedShape.id}\n x: ${onlySelectedShape.x}\n y: ${onlySelectedShape.y}\n`
				: 'Select one shape to see its meta data.'}
		</pre>
	)
})

function App({ cardName }: ReactCardProps) {
	const renderRef = useRef(0);
	renderRef.current++;

	useLayoutEffect(() => {
		const script = document.createElement("style");
		if (!script) return;
		script.innerHTML = `.tl-shapes { display: none; }`;

		document.body.appendChild(script);
		return () => {
			script.remove();
		};
	});

	return (
		<ha-card style={{ padding: "1rem" }}>
			<link
				rel="stylesheet"
				type="text/css"
				href="/hacsfiles/tldraw-react-ha/tldraw-react-ha.css"
			/>
			<p>{cardName}</p>
			<p>Rendered: {renderRef.current}</p>
			<div style={{ position: "fixed", inset: 0 }}>
				<Tldraw persistenceKey="persitenc-im-universum">
					<InsideOfContext cardName={cardName} />
					<MetaUiHelper />
				</Tldraw>
			</div>
		</ha-card>
	);
}

export default App;
