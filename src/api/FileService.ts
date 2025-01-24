import { StoreSnapshot, TLRecord } from "tldraw";

export default class FileService {
	private baseUrl: string;
	private token: string;
	private userName: string;

	constructor(baseUrl: string, token: string, userName: string) {
		this.baseUrl = baseUrl + "/api/ha_draw_persistence";
		this.token = token;
		this.userName = userName;
	}

	async getSnapShot(fileName: string): Promise<string> {
		const params = new URLSearchParams({
			filename: fileName,
			user: this.userName,
		});
		const response = await fetch(this.baseUrl + "/upload" + `?${params}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		});

		if (!response.ok) {
			console.error("Service resolution failed:", response.statusText);
			throw new Error("Service resolution failed");
		}

		return await response.text();
	}

	async sendSnapShot(
		data: StoreSnapshot<TLRecord>,
		fileName: string,
	): Promise<void> {
		const form = new FormData();
		form.append("jsondata", JSON.stringify(data));
		form.append("filename", fileName);
		form.append("user", this.userName);

		const response = await fetch(this.baseUrl + "/upload", {
			method: "Post",
			headers: {
				Authorization: `Bearer ${this.token}`,
				ContentType: "multipart/form-data",
			},
			body: form,
		});

		if (!response.ok) {
			console.error("Service resolution failed:", response.statusText);
			throw new Error("Service resolution failed");
		}
	}

	async getFileNames(): Promise<string> {
		const params = new URLSearchParams({
			user: this.userName,
		});
		const response = await fetch(this.baseUrl + "/files" + `?${params}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		});

		if (!response.ok) {
			console.error("Service resolution failed:", response.statusText);
			throw new Error("Service resolution failed");
		}

		return await response.text();
	}
}
