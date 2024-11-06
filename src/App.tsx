/* eslint-disable @typescript-eslint/no-namespace */
import React, { useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
import StateViewer from "./components/StateViewer";
import ConfigViewer from "./components/ConfigViewer";
import {Tldraw, useEditor} from "tldraw";
import 'tldraw/tldraw.css'

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

function InsideOfContext(): null{
	const editor = useEditor()
	// @ts-ignore
	editor.createShapes([{ id: 'shape:box1', type: 'text', x:100, y:100, props: { text: "ok" } },
	])
	return null
}

function App({ cardName }: ReactCardProps) {
	const renderRef = useRef(0);
	renderRef.current++;

	return (
		<ha-card style={{ padding: "1rem" }}>
			<p>{cardName}</p>
			<p>Rendered: {renderRef.current}</p>
			<div>
				<Tldraw>
					<InsideOfContext />
				</Tldraw>
			</div>
		</ha-card>
	);
}

export default App;
