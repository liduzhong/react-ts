import React, { useState, useEffect } from 'react'
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme, Form, Input, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
	crossSellerConsumeRatioList,
	// crossSellerConsumeRatioInfo,
	// addCrossSellerConsumeRatio,
	// editCrossSellerConsumeRatio,
} from '@/api/crossSellerRefund'

import styled from 'styled-components'
const { Header, Sider, Content } = Layout

const StyledLayout = styled(Layout)`
	height: 100vh;
`
const ListHeader = styled.div`
	width: 100%;
	height: 64px;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
	border-radius: 4px;
	padding: 16px;
	margin-bottom: 20px;
`

const handleUpdate = (record: Record<string, any>): void => {
	console.log(record)
}

const handleAdd = (): void => {}

const columns: ColumnsType<any> = [
	{
		title: '商家名称',
		dataIndex: 'sellerName',
		key: 'sellerName',
	},
	{
		title: '会员主补贴的商家及比例',
		dataIndex: 'pagePath',
		key: 'pagePath',
		render: (_, record) => (
			<div>
				{record.memberMasterSellerName}；{record.memberMasterRatio + '%'}
			</div>
		),
	},
	{
		title: '机器主获得返佣比例',
		dataIndex: 'machineMasterRatio',
		key: 'machineMasterRatio',
		render: (_, record) => <div>{record.machineMasterRatio + '%'}</div>,
	},
	{
		title: '更新时间',
		dataIndex: 'updateTime',
		key: 'updateTime',
	},
	{
		title: '更新人',
		dataIndex: 'updateName',
		key: 'updateName',
	},
	{
		title: '操作',
		key: 'action',
		render: (_, record) => (
			<Button type="link" onClick={() => handleUpdate(record)}>
				修改
			</Button>
		),
	},
]

const App: React.FC = () => {
	const [form] = Form.useForm()
	const [list, setList] = useState<any[]>([])
	const [collapsed, setCollapsed] = useState<boolean>(false)
	const {
		token: { colorBgContainer },
	} = theme.useToken()

	const onReset = () => {
		form.resetFields()
		fetchList()
	}

	const fetchList = async () => {
		const fieldsValue = form.getFieldsValue()
		const res = await crossSellerConsumeRatioList({ ...fieldsValue })
		setList(res.rows)
	}

	useEffect(() => {
		fetchList()
	}, [])

	return (
		<StyledLayout>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<div className="demo-logo-vertical" />
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={['1']}
					items={[
						{
							key: '1',
							icon: <UserOutlined />,
							label: 'nav 1',
						},
						{
							key: '2',
							icon: <VideoCameraOutlined />,
							label: 'nav 2',
						},
						{
							key: '3',
							icon: <UploadOutlined />,
							label: 'nav 3',
						},
					]}
				/>
			</Sider>
			<Layout>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: '16px',
							width: 64,
							height: 64,
						}}
					/>
				</Header>
				<Content
					style={{
						margin: '24px 16px',
						padding: 10,
						minHeight: 280,
						background: colorBgContainer,
					}}
				>
					<ListHeader>
						<Form form={form} name="basic" layout="inline" onFinish={fetchList} autoComplete="off">
							<Form.Item style={{ marginBottom: 0 }} label="商家名称" name="sellerName">
								<Input placeholder="请输入商家名称" />
							</Form.Item>

							<Form.Item>
								<Space>
									<Button type="primary" htmlType="submit">
										搜索
									</Button>
									<Button htmlType="button" onClick={onReset}>
										重置
									</Button>
								</Space>
							</Form.Item>
						</Form>
					</ListHeader>

					<Button type="primary" onClick={handleAdd}>
						新增
					</Button>

					<Table bordered columns={columns} dataSource={list} rowKey="sellerId" />
				</Content>
			</Layout>
		</StyledLayout>
	)
}

export default App
