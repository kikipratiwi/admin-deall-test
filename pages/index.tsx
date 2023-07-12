import React from 'react';
import { Row, Space, Spin, Typography } from 'antd';
import { useRouter } from 'next/router';

import { useEffectOnce } from '@/hooks';
import { neutral } from '@/utils';

const Homepage = () => {
	const { replace } = useRouter();

	useEffectOnce(() => {
		replace('/products');
	});

	return (
		<Row
			align="middle"
			justify="center"
			style={{ height: '100vh', width: '100vw' }}
		>
			<Space direction="vertical" align="center" size="middle">
				<Spin size="large" />

				<Typography.Text style={{ fontSize: 18, color: neutral[500] }}>
					Redirecting you to products page...
				</Typography.Text>
			</Space>
		</Row>
	);
};

export default Homepage;
