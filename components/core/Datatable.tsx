import React, { useEffect, useState } from 'react';
import { Col, Row, Input, Space, Table, message } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';

import { MasterService } from '@/services';
import { useDatatable, useDebounce, useEffectOnce } from '@/hooks';

type DataProps<TData> = {
	baseUrl?: string;
	data?: TData[];
	dataKey?: string;
	dataSourceUrl?: string;
};

type SearchProps = {
	searchPlaceholder?: string;
	withSearch?: boolean;
};

type DatatableProps<TData> = {
	columns: (ColumnGroupType<any> | ColumnType<any>)[];
} & DataProps<TData> &
	SearchProps;

const Datatable = <TData,>({
	baseUrl,
	columns,
	dataSourceUrl,
	dataKey,
	data: defaultData = [],
	searchPlaceholder = 'Search...',
	withSearch,
}: DatatableProps<TData>) => {
	const { limit, skip, isError, total, setTotal, setLimit, setSkip } =
		useDatatable();

	const [data, setData] = useState<TData[]>([] as TData[]);
	const [loading, setLoading] = useState<boolean>(true);

	const [keyword, setKeyword] = useState('');
	const q = useDebounce<string>(keyword, 500);

	const getData = async () => {
		try {
			const service = new MasterService(baseUrl);

			const isSearching = q !== '';
			const response = await service.getMasterData<Record<any, TData[]>>(
				dataSourceUrl! + (isSearching ? '/search' : ''),
				{
					q,
					skip,
					limit,
				}
			);

			setLoading(false);
			setData(response[dataKey!]);
			setTotal(response.total);
		} catch (error: any) {
			message.error(error.message);
		}
	};

	useEffectOnce(() => {
		if (isError) {
			message.error(
				'You need to wrap datatable component with datatable provider'
			);
		}
	});

	useEffect(() => {
		setLoading(true);

		if (isError) return;
		if (dataSourceUrl) {
			getData();
		} else {
			setData(defaultData);
		}
	}, [limit, skip, q]);

	return (
		<Space direction="vertical" style={{ width: '100%' }} size="middle">
			{withSearch && (
				<Row justify="end">
					<Col>
						<Input.Search
							onChange={(e) => setKeyword(e.target.value)}
							placeholder={searchPlaceholder}
							size="large"
							style={{ width: 250 }}
						/>
					</Col>
				</Row>
			)}

			<Table
				columns={columns}
				dataSource={data}
				loading={loading}
				scroll={{ x: 768 }}
				pagination={{
					pageSize: limit,
					total,
					onChange: (page, pageSize) => {
						setSkip((page - 1) * page);
						setLimit(pageSize);
					},
				}}
			/>
		</Space>
	);
};

export default Datatable;
