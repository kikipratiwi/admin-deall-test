import { QueryOpts } from '@/interfaces';

const time = 6 * 60 * 60 * 1000;

export const generateQueryOptions = <TQueryFnData>(
	options?: QueryOpts<TQueryFnData>
) => ({
	cacheTime: time,
	refetchOnWindowFocus: false,
	...options,
});
