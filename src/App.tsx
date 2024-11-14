/* eslint-disable @typescript-eslint/no-namespace */
import React, { useLayoutEffect, useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
//import StateViewer from "./components/StateViewer";
//import ConfigViewer from "./components/ConfigViewer";
import {Tldraw, useEditor} from "tldraw";
import 'tldraw/tldraw.css'

import SensorCard from "./components/SensorCard";


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
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	editor.createShapes([{ id: 'shape:box1', type: 'text', x:10, y:10, props: { text: "ok" } },
	])
	return null
}



function App({ cardName }: ReactCardProps) {
	const renderRef = useRef(0);
	renderRef.current++;

	//const sensorRef = useRef(SensorCard());

	useLayoutEffect(() => {
		const script = document.createElement('style')
		if (!script) return
		script.innerHTML = `.tl-shapes { display: none; }`
		document.body.appendChild(script)
		return () => {
			script.remove()
		}
	});

	return (
		<ha-card style={{ padding: "1rem" }}>
			<p>{cardName}</p>
			<p>Rendered: {renderRef.current}</p>
			<SensorCard entityId={"sun.sun"}></SensorCard>
			<div style={{ position: 'fixed', inset: 0 }}>
				<Tldraw>
					<InsideOfContext />
				</Tldraw>
			</div>
		</ha-card>
	);
}

export default App;
