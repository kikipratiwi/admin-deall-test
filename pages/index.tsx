import React from 'react';
import { Row, Space, Spin, Typography } from 'antd';

const Homepage = () => {
	return (
		<Row
			align="middle"
			justify="center"
			style={{ height: '100vh', width: '100vw' }}
		>
			<Space direction="vertical" align="center" size="middle">
				<Spin size="large" />

				<Typography.Text style={{ fontSize: 18, color: 'gray' }}>
					Redirecting you to products page...
				</Typography.Text>
			</Space>
		</Row>
	);
};

export default Homepage;
