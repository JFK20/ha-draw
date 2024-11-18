/* eslint-disable @typescript-eslint/no-namespace */
import React, { useLayoutEffect, useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
//import StateViewer from "./components/StateViewer";
//import ConfigViewer from "./components/ConfigViewer";
import {Tldraw, useEditor} from "tldraw";
import 'tldraw/tldraw.css'

import InitStates from "./utilities/initStates.ts";

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

function InsideOfContext({ cardName }: { cardName: string }): null{
	const editor = useEditor()
	//console.log("editor: " + editor)
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	editor.createShapes([{ id: 'shape:box1', type: 'text', x:10, y:10, props: { text: "uninitialized" } },
	])

	InitStates({ cardName })
	return null
}



function App({ cardName }: ReactCardProps) {
	const renderRef = useRef(0);
	renderRef.current++;

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
			<link rel="stylesheet" type="text/css" href="/hacsfiles/tldraw-react-ha/tldraw-react-ha.css" />
			<p>{cardName}</p>
			<p>Rendered: {renderRef.current}</p>
			<div style={{ position: 'fixed', inset: 0 }}>
				<Tldraw persistenceKey="persitenc-im-universum">
					<InsideOfContext cardName={cardName} />
				</Tldraw>
			</div>
		</ha-card>
	);
}

export default App;
