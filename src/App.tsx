/* eslint-disable @typescript-eslint/no-namespace */
import React, { useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

import UpdateStates from "./utilities/updateStates.tsx";
import { MetaUiHelper } from "./components/metaUiHelper.tsx";
import CanvasStore from "./utilities/canvasStore.ts";

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
	// Create a ref to store the editor
	const editorRef = useRef(null);

	const store = new CanvasStore(editorRef.current, cardName);

	// Handler for save button
	const handleSave = () => {
		if (editorRef.current) {
			store.saveSnapshotToServer();
		}
	};

	// Handler for load button
	const handleLoad = () => {
		if (editorRef.current) {
			store.getSnapShotFromServer();
		}
	};

	return (
		<ha-card style={{ padding: "1rem" }}>
			<link
				rel="stylesheet"
				type="text/css"
				href="/hacsfiles/ha-draw/ha-draw.css"
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "10px",
				}}
			>
				<p style={{ margin: 0 }}>{cardName}</p>
				<div>
					<button
						onClick={handleLoad}
						style={{ marginRight: "10px" }}
					>
						Load
					</button>
					<button onClick={handleSave}>Save</button>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "85vh",
				}}
			>
				<div style={{ flex: "1 1 auto", overflow: "hidden" }}>
					<Tldraw
						persistenceKey="persitenc-im-universum"
						onMount={(editor) => {
							editorRef.current = editor;
						}}
					>
						<UpdateStates cardName={cardName} />
						<MetaUiHelper />
					</Tldraw>
				</div>
			</div>
		</ha-card>
	);
}

export default App;
