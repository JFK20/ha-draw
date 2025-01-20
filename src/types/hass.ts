import { GroupConfig } from "./Entity.ts";

interface CardConfig {
	name: string;
	groups?: GroupConfig[];
}

export interface HomeAssistantState {
	states: {
		[key: string]: {
			state: string;
			attributes: Record<string, any>;
			[key: string]: any;
		};
	};
	config: any;
	bus: any;
	services: any;
	auth: {
		data: {
			access_token: string;
			hassUrl: string;
		};
	};
	user: {
		id: string;
		name: string;
		is_owner: boolean;
		is_admin: boolean;
		credentials: {
			auth_provider_type: string;
			auth_provider_id: string;
		}
	}
}

export interface CardState {
	hass: { value: HomeAssistantState };
	config: { value: CardConfig };
}
