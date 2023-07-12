import { useUpdateEffect } from '@/hooks';
import React, { ReactNode, createContext, useMemo, useState } from 'react';

const DEFAULT_LIMIT_VALUE = 8;

export type DatatableContextProps = {
	filter: Record<string, any>;
	limit: number;
	data: any[];
	search: string;
	skip: number;
	total: number;
	// eslint-disable-next-line no-unused-vars
	setData: (data: any[]) => void;
	// eslint-disable-next-line no-unused-vars
	setFilter: (filter: Record<string, any>) => void;
	// eslint-disable-next-line no-unused-vars
	setSearch: (search: string) => void;
	// eslint-disable-next-line no-unused-vars
	setSkip: (skip: number) => void;
	// eslint-disable-next-line no-unused-vars
	setLimit: (limit: number) => void;
	// eslint-disable-next-line no-unused-vars
	setTotal: (total: number) => void;
};

export const DatatableContext = createContext({} as DatatableContextProps);

const DatatableProvider = ({ children }: { children: ReactNode }) => {
	const [data, setData] = useState<any[]>([]);
	const [filter, setFilter] = useState<Record<string, any>>({});
	const [limit, setLimit] = useState<number>(DEFAULT_LIMIT_VALUE);
	const [search, setSearch] = useState<string>('');
	const [skip, setSkip] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);

	const values: DatatableContextProps = useMemo(() => {
		return {
			data,
			filter,
			limit,
			search,
			skip,
			total,
			setData,
			setFilter,
			setLimit,
			setSkip,
			setSearch,
			setTotal,
		};
	}, [data, limit, skip, filter, total, search]);

	useUpdateEffect(() => {
		// TODO: Should save values to localStorage using jotai
	}, [limit, skip, filter, total, search]);

	return (
		<DatatableContext.Provider value={values}>
			{children}
		</DatatableContext.Provider>
	);
};

export default DatatableProvider;
