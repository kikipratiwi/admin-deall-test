import React, { ReactNode, createContext, useMemo, useState } from 'react';

const DEFAULT_LIMIT_VALUE = 8;

export type DatatableContextProps = {
	filter: Record<string, any>;
	skip: number;
	limit: number;
	total: number;
	// eslint-disable-next-line no-unused-vars
	setFilter: (filter: Record<string, any>) => void;
	// eslint-disable-next-line no-unused-vars
	setSkip: (skip: number) => void;
	// eslint-disable-next-line no-unused-vars
	setLimit: (limit: number) => void;
	// eslint-disable-next-line no-unused-vars
	setTotal: (total: number) => void;
};

export const DatatableContext = createContext({} as DatatableContextProps);

const DatatableProvider = ({ children }: { children: ReactNode }) => {
	const [filter, setFilter] = useState<Record<string, any>>({});
	const [skip, setSkip] = useState<number>(0);
	const [total, setTotal] = useState<number>(0);
	const [limit, setLimit] = useState<number>(DEFAULT_LIMIT_VALUE);

	const values: DatatableContextProps = useMemo(() => {
		return {
			limit,
			skip,
			filter,
			total,
			setSkip,
			setFilter,
			setLimit,
			setTotal,
		};
	}, [limit, skip, filter, total]);

	return (
		<DatatableContext.Provider value={values}>
			{children}
		</DatatableContext.Provider>
	);
};

export default DatatableProvider;
