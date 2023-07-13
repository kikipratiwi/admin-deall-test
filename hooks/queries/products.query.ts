import { Product, QueryOpts } from '@/interfaces';
import { MasterService, ProductService } from '@/services';
import { generateQueryOptions } from '@/utils';
import { useQuery } from 'react-query';

const PRODUCT_QUERY_KEYS = 'products';

export const useGetProducts = ({
	params,
	options,
}: {
	params: Record<string, any>;
	options?: QueryOpts<{
		products: Product[];
		total: number;
		skip: number;
		limit: number;
	}>;
}) => {
	return useQuery<
		{
			products: Product[];
			total: number;
			skip: number;
			limit: number;
		},
		Error
	>(
		[PRODUCT_QUERY_KEYS, { ...params }],
		async () => {
			const svc = new MasterService();
			const response = await svc.getMasterData('/products');

			return response;
		},
		generateQueryOptions(options)
	);
};

export const useGetProductCategories = (options?: QueryOpts<string[]>) => {
	return useQuery<string[], Error>(
		[PRODUCT_QUERY_KEYS, 'categories'],
		async () => {
			const svc = new ProductService();
			const response = await svc.getProductCategories();

			return response;
		},
		generateQueryOptions(options)
	);
};
