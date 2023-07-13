import { QueryKey, UseQueryOptions } from 'react-query';

export type QueryOpts<TQueryFnData> = Omit<
	UseQueryOptions<any, Error, TQueryFnData, QueryKey>,
	'queryKey' | 'queryFn'
>;
