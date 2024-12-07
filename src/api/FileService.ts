export default class FileService {
	private baseUrl: string;
	private token: string;

	constructor(baseUrl: string, token: string) {
		this.baseUrl = baseUrl + "/api/services";
		this.token = token;
	}

	async getServices(): Promise<string> {

		const response = await fetch(this.baseUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
			},
		});

		if (!response.ok) {
			console.error("Service resolution failed:", response.statusText);
			throw new Error("Service resolution failed"); // Fallback to original template
		}

		return await response.text();
	}
}
