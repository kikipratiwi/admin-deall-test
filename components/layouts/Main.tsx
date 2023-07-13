import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { Col, Divider, Drawer, Row, Space, Typography } from 'antd';
import { CloseCircle, MenuOutline } from 'react-ionicons';

import { SIDEBAR_MENUS, black, white } from '@/utils';

type MainLayoutProps = {
	children: ReactNode;
	title: string;
};

const MainLayout = ({ children, title }: MainLayoutProps) => {
	const { pathname } = useRouter();
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

	return (
		<Row
			gutter={12}
			style={{ width: '99vw', height: '100vh', overflowX: 'hidden' }}
		>
			<Col
				xs={0}
				md={8}
				lg={5}
				style={{
					background: black,
					height: '100%',
				}}
			>
				<Space
					direction="vertical"
					size="small"
					style={{ width: '100%', padding: '2rem 0' }}
				>
					{SIDEBAR_MENUS.map((menu) => {
						const isMenuActive = menu.url.includes(pathname);

						return (
							<a
								href={menu.url}
								key={menu.label}
								style={{
									color: isMenuActive ? black : white,
									display: 'block',
									fontSize: '18px',
									fontWeight: isMenuActive ? 600 : 400,
									marginLeft: '5px',
									padding: '1rem 2rem',
									width: '100%',
									background: isMenuActive
										? 'white'
										: 'initial',
								}}
							>
								{menu.label}
							</a>
						);
					})}
				</Space>
			</Col>

			<Col
				xs={24}
				md={16}
				lg={19}
				style={{
					background: white,
					height: '100%',
					overflow: 'auto',
					overflowX: 'hidden',
					padding: '2rem 3rem',
				}}
			>
				<Space
					direction="vertical"
					size="large"
					style={{ width: '100%' }}
				>
					<Row align="middle" gutter={12}>
						<Col xs={3} md={0}>
							<MenuOutline
								color={black}
								height="2rem"
								onClick={() => setDrawerOpen(true)}
								style={{ fontWeight: 900, cursor: 'pointer' }}
								width="2rem"
							/>
						</Col>

						<Col>
							<Typography.Title level={1} style={{ margin: 0 }}>
								{title}
							</Typography.Title>
						</Col>
					</Row>

					<Divider style={{ margin: 0 }} />

					{children}
				</Space>
			</Col>

			<Drawer
				placement="left"
				onClose={() => setDrawerOpen(false)}
				open={drawerOpen}
				style={{ background: black, padding: 0 }}
				closeIcon={<CloseCircle color={white} />}
				bodyStyle={{ padding: 0, overflow: 'hidden' }}
			>
				<Space
					direction="vertical"
					size="small"
					style={{ width: '100%' }}
				>
					{SIDEBAR_MENUS.map((menu) => {
						const isMenuActive = menu.url.includes(pathname);

						return (
							<a
								href={menu.url}
								key={menu.label}
								style={{
									color: isMenuActive ? black : white,
									display: 'block',
									fontSize: '18px',
									fontWeight: isMenuActive ? 600 : 400,
									marginLeft: '5px',
									padding: '1rem 2rem',
									width: '100%',
									background: isMenuActive
										? 'white'
										: 'initial',
								}}
							>
								{menu.label}
							</a>
						);
					})}
				</Space>
			</Drawer>
		</Row>
	);
};

export default MainLayout;
