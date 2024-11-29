import Entity from "./Entity.ts";

interface CardConfig {
	entities?: Entity[];
}

export interface HomeAssistantState {
	states: {
		[key: string]: {
			state: string;
			attributes: Record<string, any>;
			[key: string]: any;
		};
	};
	config: any,
	bus: any,
	services: any,
}

export interface CardState {
	hass: { value: HomeAssistantState };
	config: { value: CardConfig };
}