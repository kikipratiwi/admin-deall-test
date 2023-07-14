import React, { useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { FilterOutline, PieChart } from 'react-ionicons';
import { useAtom } from 'jotai';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
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
	Badge,
	Select,
} from 'antd';

import { Datatable, MainLayout } from '@/components';
import { DatatableProvider } from '@/context';
import { Product } from '@/interfaces';
import { productFilterAtom, productSearchAtom } from '@/stores';
import {
	useDatatable,
	useDebounce,
	useGetProductCategories,
	useGetProducts,
	useUpdateEffect,
} from '@/hooks';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const ProductPage = () => {
	const { data: categories } = useGetProductCategories();
	const { refetch } = useGetProducts({
		params: { limit: 100, skip: 0 },
		options: { enabled: false },
	});

	const { data, search, setSearch, setTotal, setData } = useDatatable();
	const [form] = Form.useForm<{
		brand?: string;
		category?: string;
		range?: number[];
	}>();

	const [filter, setFilter] = useAtom(productFilterAtom);
	const [priceRange, setPriceRange] = useState<number[]>([1, 2000]);
	const [clientSideFiltering, setClientSideFilter] = useState(true);
	const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
	const [chartModalOpen, setChartModalOpen] = useState<boolean>(false);

	const [keyword, setKeyword] = useAtom(productSearchAtom);
	const debouncedKeyword = useDebounce<string>(keyword, 500);

	const isSearching = search !== '';
	const filterLength = Object.values(filter).filter(
		(val) => typeof val !== 'undefined'
	).length;
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
		setClientSideFilter(true);

		const { data, isError, error } = await refetch();

		if (isError) {
			message.error(error.message);
			return;
		}

		const filteredData = data!.products.filter((product: any) => {
			return (
				Object.entries({ ...filter, title: debouncedKeyword })
					// eslint-disable-next-line no-unused-vars
					.filter(([_, value]) => {
						return typeof value !== 'undefined';
					})
					.every(([key, value]) => {
						let pass = false;

						if (
							key === 'brand' ||
							key === 'category' ||
							key === 'title'
						) {
							pass = product[key]
								.toLowerCase()
								.includes((value as string)?.toLowerCase());
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

	useUpdateEffect(() => {
		if (filterLength > 0) {
			applyFilter();
		} else {
			setClientSideFilter(false);
		}
	}, [filter]);

	useUpdateEffect(() => {
		setSearch(debouncedKeyword);

		if (clientSideFiltering) {
			applyFilter();
		}
	}, [debouncedKeyword]);

	return (
		<MainLayout title="Products">
			<Space direction="vertical" style={{ width: '100%' }} size="middle">
				<Row justify="end">
					<Col>
						<Space size="large">
							<PieChart
								style={{ cursor: 'pointer' }}
								onClick={() => setChartModalOpen(true)}
							/>

							<Badge count={filterLength}>
								<FilterOutline
									style={{ cursor: 'pointer' }}
									onClick={() => setFilterModalOpen(true)}
								/>
							</Badge>

							<Input.Search
								onChange={(e) => setKeyword(e.target.value)}
								placeholder="Search Products..."
								size="large"
								style={{ width: 250 }}
								value={keyword ?? keyword}
							/>
						</Space>
					</Col>
				</Row>

				<Datatable<Product[]>
					columns={columns}
					dataKey="products"
					// When there is a filter, data fetching will be done outside the Datatable component
					// in order to be able to get all data, and filtering based on value we choose. Since it is
					// not possible to send the params to the API. The workaround is get all data first, and then filter it.
					// Hence, will be send undefined on dataSourceUrl when filtering is on
					dataSourceUrl={
						clientSideFiltering
							? undefined
							: '/products' + (isSearching ? '/search' : '')
					}
				/>
			</Space>

			<Modal
				open={chartModalOpen}
				title="Product Chart"
				width="80%"
				onCancel={() => setChartModalOpen(false)}
				footer={[
					<Button
						key="back"
						type="text"
						onClick={() => setChartModalOpen(false)}
					>
						Close
					</Button>,
				]}
			>
				<Line
					data={{
						labels: data.map((product) => product.title),
						datasets: [
							{
								label: 'Number of Items',
								data: data.map((product) => product.stock),
								backgroundColor: 'rgba(75, 192, 192, 0.6)',
								borderColor: 'rgba(75, 192, 192, 1)',
								borderWidth: 1,
							},
						],
					}}
					options={{
						responsive: true,
						plugins: {
							legend: {
								position: 'top' as const,
							},
							title: {
								display: true,
								text: 'No of Items per Product',
							},
						},
					}}
				/>
			</Modal>

			<Modal
				open={filterModalOpen}
				title="Filter Products"
				width="80%"
				onCancel={() => setFilterModalOpen(false)}
				footer={[
					<Button
						key="back"
						type="text"
						onClick={() => setFilterModalOpen(false)}
					>
						Close
					</Button>,
					<Button
						key="reset"
						onClick={() => {
							form.resetFields();
							setFilter({});
							setFilterModalOpen(false);
						}}
					>
						Reset
					</Button>,
					<Button
						key="link"
						style={{ background: 'black' }}
						type="primary"
						onClick={() => {
							const values = form.getFieldsValue();
							setFilter(values);
							setFilterModalOpen(false);
						}}
					>
						Filter
					</Button>,
				]}
			>
				<Form initialValues={filter} form={form}>
					<Row gutter={[12, 12]}>
						<Col xs={24} lg={12}>
							<Form.Item name="brand">
								<Input placeholder="Filter Brand..." />
							</Form.Item>
						</Col>

						<Col xs={24} lg={12}>
							<Form.Item name="category">
								<Select
									placeholder="Filter Category..."
									allowClear
									showSearch
								>
									{categories?.map((cat) => (
										<Select.Option value={cat} key={cat}>
											{cat}
										</Select.Option>
									))}
								</Select>
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
