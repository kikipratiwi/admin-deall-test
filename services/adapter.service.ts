import axios, {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';

class HTTPAdapterService {
	private client: AxiosInstance;

	constructor(public baseURL = process.env.NEXT_PUBLIC_API_BASE_URL) {
		const headers: Record<string, any> = {
			'Content-Type': 'application/json',
		};

		this.client = axios.create({
			headers,
			baseURL,
		});

		// TODO: This token can be from localStorage or somewhere else
		const token = '';

		// This interceptor aims to automatically append auth to the headers
		this.client.interceptors.request.use(
			(config: InternalAxiosRequestConfig<any>) => {
				if (token) {
					if (config.headers) {
						config.headers['authorization'] = `Bearer ${token}`;
					}
				}

				return config;
			}
		);

		this.client.interceptors.response.use(
			(response: AxiosResponse<any, any>) => response,
			async (error: any) => {
				// Response interceptor, to automize process when the response is 401 or 403
				// Usually the use is not login, or the auth is expired
				if ([401, 403].includes(error.response.status)) {
					// TODO: Later, you can replace the routing to login or to error page
					// window.location.replace('/auth/signin');
				}

				throw error;
			}
		);
	}

	public overrideAuthorizationHeader(token: string) {
		this.client.defaults.headers.common[
			'Authorization'
		] = `Bearer ${token}`;
	}

	async sendGetRequest(
		URL: string,
		params?: Record<string, any>,
		headers = {}
	) {
		const response = await this.client.get(URL, { params, headers });

		return response;
	}

	async sendPostRequest(
		URL: string,
		requestBody: Record<string, any>,
		params?: Record<string, any>
	) {
		const qparams = params && { params };
		const response = await this.client.post(URL, requestBody, qparams);

		return response;
	}

	async sendPutRequest(URL: string, requestBody: Record<string, any>) {
		const response = await this.client.put(URL, requestBody);

		return response;
	}

	async sendDeleteRequest(URL: string, requestBody: Record<string, any>) {
		const response = await this.client.delete(URL, requestBody);

		return response;
	}
}

export default HTTPAdapterService;
