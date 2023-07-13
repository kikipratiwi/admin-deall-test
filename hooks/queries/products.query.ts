import { Product, QueryOpts } from '@/interfaces';
import { MasterService } from '@/services';
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
			const service = new MasterService();
			const response = await service.getMasterData('/products');

			return response;
		},
		generateQueryOptions(options)
	);
};
