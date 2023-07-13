import React, { useEffect, useState } from 'react';
import { Space, Table, message } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';

import { MasterService } from '@/services';
import { useDatatable, useEffectOnce } from '@/hooks';

type DataProps = {
	baseUrl?: string;
	dataKey?: string;
	dataSourceUrl?: string;
};

type DatatableProps = {
	columns: (ColumnGroupType<any> | ColumnType<any>)[];
} & DataProps;

const Datatable = <TData,>({
	baseUrl,
	columns,
	dataSourceUrl,
	dataKey,
}: DatatableProps) => {
	const {
		limit,
		skip,
		isError,
		total,
		search,
		data,
		setData,
		setTotal,
		setLimit,
		setSkip,
	} = useDatatable();

	const [loading, setLoading] = useState<boolean>(true);

	// TODO: Can be enhanced using react-query
	const getData = async () => {
		try {
			const service = new MasterService(baseUrl);

			const response = await service.getMasterData<Record<any, TData[]>>(
				dataSourceUrl!,
				{
					q: search,
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
			setLoading(false);
		}
	}, [dataSourceUrl, limit, skip, search]);

	return (
		<Space direction="vertical" style={{ width: '100%' }} size="middle">
			<Table
				columns={columns}
				dataSource={data}
				loading={loading}
				scroll={{ x: 768 }}
				pagination={{
					pageSize: limit,
					total,
					pageSizeOptions: [5, 10, 15, 20, 30, 50, 100],
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
