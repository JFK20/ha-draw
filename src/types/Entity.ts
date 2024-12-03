import { TLGeoShapeProps, TLTextShapeProps } from "tldraw";

export interface GroupConfig {
	entities: string[];
	template?: string;
	tldraw?: TlDrawParams;
}

export interface TlDrawParams {
	id: string;
	pos_x: number | null;
	pos_y: number | null;
	parameter: string;
	valuetype: string;
	isLocked: boolean;
	on_error: string;
	rotation: number;
	opacity: number;
	lastvalue: string;
	//https://tldraw.dev/reference/tlschema/TLTextShapeProps
	props: TLDrawProps;
}

export interface TLDrawProps extends TLGeoShapeProps, TLTextShapeProps {}
