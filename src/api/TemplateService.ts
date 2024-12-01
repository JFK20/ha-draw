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
			throw new Error("Template resolution failed"); // Fallback to original template
		}

		return await response.text();
	}
}