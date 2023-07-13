import { Product } from './product';

export type Cart = {
	id: number;
	products: Product[];
	total: number;
	discountedTotal: number;
	userId: number;
	totalProducts: number;
	totalQuantity: number;
};
