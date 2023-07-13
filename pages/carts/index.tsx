import React from 'react';
import { Datatable, MainLayout } from '@/components';
import { DatatableProvider } from '@/context';
import { Cart, Product } from '@/interfaces';
import { ColumnsType } from 'antd/es/table';

const CartsPage = () => {
	const columns: ColumnsType<Product> = [
		{
			title: 'Cart id',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Price',
			dataIndex: 'total',
			key: 'total',
			render: (total) => '$' + total,
		},
		{
			title: 'Total Discount',
			dataIndex: 'discountedTotal',
			key: 'discountedTotal',
			render: (total) => '$' + total,
		},
		{
			title: 'Total Product',
			dataIndex: 'totalProducts',
			key: 'totalProducts',
		},
		{
			title: 'Total Category',
			dataIndex: 'totalQuantity',
			key: 'totalQuantity',
		},
		{
			title: '',
			dataIndex: 'id',
			key: 'id',
			render: (id) => {
				return <a href={`/carts/${id}`}>See Detail</a>;
			},
		},
	];

	return (
		<MainLayout title="Carts">
			<Datatable<Cart[]>
				columns={columns}
				dataKey="carts"
				dataSourceUrl="/carts"
			/>
		</MainLayout>
	);
};

const WrappedWithDatatable = () => {
	return (
		<DatatableProvider>
			<CartsPage />
		</DatatableProvider>
	);
};

export default WrappedWithDatatable;
