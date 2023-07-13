import HTTPAdapterService from './adapter.service';

import { Cart } from '@/interfaces';

export default class CartService extends HTTPAdapterService {
	public async getCartById(id: string): Promise<Cart> {
		try {
			const { data } = await this.sendGetRequest(`/carts/${id}`);

			return data;
		} catch (error: any) {
			throw new Error(error);
		}
	}
}
