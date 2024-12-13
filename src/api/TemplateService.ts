export default class TemplateService {
	private baseUrl: string;
	private token: string;

	constructor(baseUrl: string, token: string) {
		this.baseUrl = baseUrl + "/api/template"; //the URL of the HA Server
		this.token = token; // The auth bearer Token from HA
	}

	async resolveTemplate(template: string): Promise<string> {
		//the object we sent to HA
		const payload = {
			template: template,
		};

		const response = await fetch(this.baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
			},
			body: JSON.stringify(payload),
		});

		//if the Api Request didn't complete successfully throw error
		if (!response.ok) {
			console.error("Template resolution failed:", response.statusText);
			throw new Error("Template resolution failed");
		}
		// else return the answer
		return await response.text();
	}
}
