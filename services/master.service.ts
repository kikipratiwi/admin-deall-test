import HTTPAdapterService from './adapter.service';

const DEFAULT_LIMIT_VALUE = 8;

export default class MasterService extends HTTPAdapterService {
	public async getMasterData<TData = any>(
		sourceUrl: string,
		params?: Record<string, any>
	): Promise<TData & { total: number; skip: number; limit: number }> {
		try {
			const { data } = await this.sendGetRequest(sourceUrl, {
				limit: DEFAULT_LIMIT_VALUE,
				...params,
			});

			return data;
		} catch (error: any) {
			throw new Error(error);
		}
	}
}
