import HTTPAdapterService from './adapter.service';

import { User } from '@/interfaces';

export default class UserService extends HTTPAdapterService {
	public async getUserById(id: string): Promise<User> {
		try {
			const { data } = await this.sendGetRequest(`/users/${id}`);

			return data;
		} catch (error: any) {
			throw new Error(error);
		}
	}
}
