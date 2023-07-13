import { useQuery } from 'react-query';

import { Cart, QueryOpts, User } from '@/interfaces';
import { CartService, ProductService, UserService } from '@/services';
import { generateQueryOptions } from '@/utils';

const CART_QUERY_KEYS = 'carts';

export const useGetCartById = ({
	id,
	options,
}: {
	id: string;
	options?: QueryOpts<
		Cart & {
			user: User;
		}
	>;
}) => {
	return useQuery<
		Cart & {
			user: User;
		},
		Error
	>(
		[CART_QUERY_KEYS, id],
		async () => {
			const cartSvc = new CartService();
			const productSvc = new ProductService();
			const userSvc = new UserService();

			const cart = await cartSvc.getCartById(id);
			const user = await userSvc.getUserById(cart.userId.toString());
			const products = await Promise.all(
				cart.products.map((product) =>
					productSvc.getProductById(product.id.toString())
				)
			);

			return { ...cart, products, user };
		},
		generateQueryOptions(options)
	);
};
