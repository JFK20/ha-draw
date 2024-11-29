export default class TemplateService {
	private baseUrl: string;
	private token: string;

	constructor(
		baseUrl: string,
		token: string,
	) {
		this.baseUrl = baseUrl + "/api/template";
		this.token = token;
	}

	async resolveTemplate(
		template: string,
	): Promise<string> {
		try {
			const payload = {
				template: template
			};

			const response = await fetch(this.baseUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				console.error("Template resolution failed:", response.statusText);
				return template; // Fallback to original template
			}

			return await response.text();
		} catch (error) {
			console.error("Error resolving template:", error);
			return template; // Fallback to original template in case of error
		}
	}
}