import { TLTextShapeProps} from "tldraw";

export interface GroupConfig {
	entities: string[];
	template?: string;
	tldraw?: TldrawParams;
}

export interface TldrawParams{
	id: string;
	pos_x: number | null;
	pos_y: number | null;
	parameter: string;
	valuetype: string;
	on_error: string;
	rotation: number;
	opacity: number;
	isLocked: boolean;
	lastvalue: string
	//https://tldraw.dev/reference/tlschema/TLTextShapeProps
	props: TLTextShapeProps
}
