import { useContext } from 'react';
import { DatatableContext } from '@/context';

const useDatatable = () => {
	const values = useContext(DatatableContext);

	return { ...values, isError: typeof values === 'undefined' };
};

export default useDatatable;
