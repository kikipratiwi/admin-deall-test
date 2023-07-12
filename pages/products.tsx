import React, { useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { FilterOutline } from 'react-ionicons';
import {
	Space,
	Row,
	Col,
	Input,
	Modal,
	Button,
	Form,
	Typography,
	Slider,
	message,
} from 'antd';

import { Datatable, MainLayout } from '@/components';
import { DatatableProvider } from '@/context';
import { Product } from '@/interfaces';
import { useDatatable, useDebounce, useUpdateEffect } from '@/hooks';
import { MasterService } from '@/services';

const ProductPage = () => {
	const {
		search,
		setFilter,
		setSearch,
		setTotal,
		setLimit,
		setSkip,
		setData,
	} = useDatatable();
	const [form] = Form.useForm<{
		brand?: string;
		category?: string;
		range?: number[];
	}>();

	const [isFiltering, setIsFiltering] = useState(false);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);

	const [keyword, setKeyword] = useState('');
	const debouncedKeyword = useDebounce<string>(keyword, 500);

	const isSearching = search !== '';
	const columns: ColumnsType<Product> = [
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

	const applyFilter = async () => {
		const values = form.getFieldsValue();
		setIsFiltering(true);
		setFilter(values);

		const response = await getProducts();
		const filteredData = response!.products.filter((product: any) => {
			return (
				Object.entries(values)
					// eslint-disable-next-line no-unused-vars
					.filter(([_, value]) => typeof value !== 'undefined')
					.every(([key, value]) => {
						let pass = false;

						if (key === 'brand' || key === 'category') {
							pass = product[key]
								.toLowerCase()
								.includes((value as string).toLowerCase());
						}

						if (key === 'range') {
							pass =
								pass ||
								(product.price >= priceRange[0] &&
									product.price <= priceRange[1]);
						}

						return pass;
					})
			);
		});

		setData(filteredData);
		setTotal(filteredData.length);
	};

	const getProducts = async () => {
		try {
			const service = new MasterService();

			const response = await service.getMasterData<Record<string, any>>(
				'/products',
				{
					skip: 0,
					limit: 100,
				}
			);

			return response;
		} catch (error: any) {
			message.error(error.message);
		}
	};

	useUpdateEffect(() => {
		setSearch(debouncedKeyword);
	}, [debouncedKeyword]);

	return (
		<MainLayout title="Products">
			<Space direction="vertical" style={{ width: '100%' }} size="middle">
				<Row justify="end">
					<Col>
						<Space size="large">
							<FilterOutline
								style={{ cursor: 'pointer' }}
								onClick={() => setModalOpen(true)}
							/>

							<Input.Search
								onChange={(e) => setKeyword(e.target.value)}
								placeholder="Search Products..."
								size="large"
								style={{ width: 250 }}
							/>
						</Space>
					</Col>
				</Row>

				<Datatable<Product[]>
					columns={columns}
					dataKey="products"
					dataSourceUrl={
						isFiltering
							? undefined
							: '/products' + (isSearching ? '/search' : '')
					}
				/>
			</Space>

			<Modal
				open={modalOpen}
				title="Filter Products"
				width="80%"
				onCancel={() => setModalOpen(false)}
				footer={[
					<Button
						key="back"
						type="text"
						onClick={() => setModalOpen(false)}
					>
						Close
					</Button>,
					<Button
						key="reset"
						onClick={() => {
							form.resetFields();
							setIsFiltering(false);
							setFilter({});
							setLimit(8);
							setSkip(0);
							setModalOpen(false);
						}}
					>
						Reset
					</Button>,
					<Button
						key="link"
						style={{ background: 'black' }}
						type="primary"
						onClick={async () => {
							await applyFilter();
							setModalOpen(false);
						}}
					>
						Filter
					</Button>,
				]}
			>
				<Form initialValues={{ range: [0, 1000] }} form={form}>
					<Row gutter={[12, 12]}>
						<Col xs={24} lg={12}>
							<Form.Item name="brand">
								<Input placeholder="Filter Brand..." />
							</Form.Item>
						</Col>

						<Col xs={24} lg={12}>
							<Form.Item name="category">
								<Input placeholder="Filter Category..." />
							</Form.Item>
						</Col>

						<Col xs={24} lg={12}>
							<Space
								direction="vertical"
								style={{ width: '100%' }}
							>
								<Typography>Price:</Typography>

								<Space style={{ width: '100%' }} align="center">
									<Input
										value={priceRange[0]}
										style={{ maxWidth: 70 }}
									/>

									<Form.Item name="range" noStyle>
										<Slider
											style={{ width: 400 }}
											min={1}
											max={2000}
											range
											step={1}
											onChange={setPriceRange}
										/>
									</Form.Item>

									<Input
										value={priceRange[1]}
										style={{ maxWidth: 70 }}
									/>
								</Space>
							</Space>
						</Col>
					</Row>
				</Form>
			</Modal>
		</MainLayout>
	);
};

const WrappedWithDatatable = () => {
	return (
		<DatatableProvider>
			<ProductPage />
		</DatatableProvider>
	);
};

export default WrappedWithDatatable;
