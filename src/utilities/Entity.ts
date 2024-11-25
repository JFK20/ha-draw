export default interface Entity {
	entity: string;
	params: any;
	attributes: Record<string, any>;
	state: string;
	threshold: number;
	color: string;
	limit_color: string;
	unit: string | null;
	pos_x: number | null;
	pos_y: number | null;
}
