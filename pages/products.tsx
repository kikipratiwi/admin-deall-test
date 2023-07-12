import { MainLayout } from '@/components';
import { Table } from 'antd';
import React from 'react';

const ProductPage = () => {
	const dataSource = [
		{
			key: '1',
			name: 'Mike',
			age: 32,
			address: '10 Downing Street',
		},
		{
			key: '2',
			name: 'John',
			age: 42,
			address: '10 Downing Street',
		},
	];

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
		},
	];

	return (
		<MainLayout title="Products">
			<Table dataSource={dataSource} columns={columns} />
		</MainLayout>
	);
};

export default ProductPage;
