/* eslint-disable @typescript-eslint/no-namespace */
import React, { useLayoutEffect, useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
//import StateViewer from "./components/StateViewer";
//import ConfigViewer from "./components/ConfigViewer";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

import UpdateStates from "./utilities/updateStates.tsx";
import { MetaUiHelper } from "./components/metaUiHelper.tsx";
import { getSnapShotFromServer, saveSnapshotToServer } from "./utilities/canvasStore.ts";

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
				href="/local/ha-draw.css"
			/>
			<p>{cardName}</p>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "85vh",
				}}
			>
				<div style={{ flex: "1 1 auto", overflow: "hidden" }}>
					<Tldraw persistenceKey="persitenc-im-universum"
						onMount={(editor) => {
							getSnapShotFromServer(editor, cardName);
							saveSnapshotToServer(editor, cardName);
						}
						}>
						<UpdateStates cardName={cardName} />
						<MetaUiHelper />
					</Tldraw>
				</div>
			</div>
		</ha-card>
	);
}

export default App;
