import React, { useEffect } from 'react';

import { Datatable, MainLayout } from '@/components';
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
	NextPage,
} from 'next';
import { useDatatable, useGetCartById } from '@/hooks';
import { Col, Divider, Row, Space, Spin, Typography, message } from 'antd';
import { neutral } from '@/utils';
import { DatatableProvider } from '@/context';
import { Cart, User } from '@/interfaces';
import { ColumnsType } from 'antd/es/table';

export const getServerSideProps: GetServerSideProps<{
	id: string;
}> = async (context: GetServerSidePropsContext) => {
	const { query } = context;

	return {
		props: {
			id: query.id as string,
		},
	};
};

const ProductDatatable = ({ data }: { data: Cart & { user: User } }) => {
	const { setData } = useDatatable();

	const columns: ColumnsType<Cart> = [
		{
			title: 'Product Name',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Brand',
			dataIndex: 'brand',
			key: 'brand',
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: (price) => '$' + price,
		},
		{
			title: 'Stock',
			dataIndex: 'stock',
			key: 'stock',
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
		},
	];

	useEffect(() => {
		setData(data.products);
	}, [data]);

	return <Datatable columns={columns} />;
};

const CartDetailPage: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
	const { isLoading, data, isError, error } = useGetCartById({ id });

	if (isError) {
		message.error(error.message);
	}

	return (
		<MainLayout title="Cart Detail">
			{isLoading ? (
				<Row justify="center" style={{ width: '100%' }}>
					<Space direction="vertical" align="center">
						<Spin />

						<Typography.Text
							style={{ fontSize: 18, color: neutral[500] }}
						>
							Loading cart detail data...
						</Typography.Text>
					</Space>
				</Row>
			) : (
				<Space direction="vertical" style={{ width: '100%' }}>
					<Space direction="vertical" style={{ width: '100%' }}>
						<Typography.Title level={4}>Details</Typography.Title>

						<Row
							gutter={[12, 12]}
							style={{
								background: neutral[300],
								padding: 20,
								border: `1px solid ${neutral[500]}`,
							}}
						>
							{[
								{
									label: 'User',
									value:
										data?.user.firstName! +
										data?.user.lastName!,
								},
								{
									label: '# of Items',
									value: data?.products.length,
								},
								{
									label: 'Added on',
									value: '-',
								},
								{
									label: 'Total Amount',
									value: '$' + `${data?.total}`,
								},
							].map((item) => {
								return (
									<Col xs={24} md={12} key={item.label}>
										<Typography.Text
											style={{ fontSize: 16 }}
										>
											{item.label}: {item.value}
										</Typography.Text>
									</Col>
								);
							})}
						</Row>
					</Space>

					<Divider />

					<Space direction="vertical" style={{ width: '100%' }}>
						<Typography.Title level={4}>Products</Typography.Title>

						<DatatableProvider>
							<ProductDatatable data={data!} />
						</DatatableProvider>
					</Space>
				</Space>
			)}
		</MainLayout>
	);
};

export default CartDetailPage;
