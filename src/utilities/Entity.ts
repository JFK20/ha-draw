import { TLTextShapeProps} from "tldraw";

export default interface Entity {
	entity: string;
	params: any;
	attributes: Record<string, any>;
	state: string;
	threshold: number;
	limit_color: string;
	unit: string | null;
	pos_x: number | null;
	pos_y: number | null;
	rotation: number;
	opacity: number;
	isLocked: boolean;
	//https://tldraw.dev/reference/tlschema/TLTextShapeProps
	props: TLTextShapeProps;
}
