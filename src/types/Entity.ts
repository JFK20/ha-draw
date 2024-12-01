import { TLTextShapeProps} from "tldraw";

export default interface Entity {
	entity: string;
	params: any;
	attributes: Record<string, any>;
	template: string;
	state: string;
	threshold: number;
	limit_color: string;
	unit: string | null;
	pos_x: number | null;
	pos_y: number | null;
	rotation: number;
	opacity: number;
	isLocked: boolean;
	props: TLTextShapeProps;
}

export interface GroupConfig {
	entities: string[];
	template?: string;
	tldraw?: TldrawParams;
}

export interface TldrawParams{
	id: string;
	parameter: string;
	valuetype: string;
	on_error: string;
	rotation: number;
	opacity: number;
	isLocked: boolean;
	//https://tldraw.dev/reference/tlschema/TLTextShapeProps
	props: TLTextShapeProps
}
