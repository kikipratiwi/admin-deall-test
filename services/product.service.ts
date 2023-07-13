import HTTPAdapterService from './adapter.service';

import { Product } from '@/interfaces';

export default class ProductService extends HTTPAdapterService {
	public async getProductById(id: string): Promise<Product> {
		try {
			const { data } = await this.sendGetRequest(`/products/${id}`);

			return data;
		} catch (error: any) {
			throw new Error(error);
		}
	}
}
