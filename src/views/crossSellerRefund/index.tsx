import React, { useState, useEffect } from 'react'
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme, Form, Input, Space, Table, Modal, message, Spin } from 'antd'

import SelectSeller from '@/components/SelectSeller'
import type { ColumnsType } from 'antd/es/table'
import {
	crossSellerConsumeRatioList,
	crossSellerConsumeRatioInfo,
	addCrossSellerConsumeRatio,
	editCrossSellerConsumeRatio,
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

const Box = styled.div`
	width: 100%;
	padding: 16px;
	background-color: #eee;
	border-radius: 4px;
`

const StyledForm = styled(Form)`
	.ant-form-item {
		margin-bottom: 10px;
	}
`
interface Pagination {
	current: number
	size: number
	total: number
}
interface FormState {
	sellerName: string
	sellerId: string
}

interface Loading {
	table: boolean
	submit: boolean
	modal: boolean
}

const App: React.FC = () => {
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
			render: (_, { crossSellerConsumeRatioId }) => (
				<Button type="link" onClick={() => handleUpdate(crossSellerConsumeRatioId)}>
					修改
				</Button>
			),
		},
	]
	const [queryForm] = Form.useForm()
	const [form] = Form.useForm()
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [showModal, setShowModal] = useState<boolean>(false)
	const [list, setList] = useState<any[]>([])
	const [pagination, setPagination] = useState<Pagination>({ current: 1, size: 10, total: 0 })
	const [collapsed, setCollapsed] = useState<boolean>(false)
	const [loading, setLoading] = useState<Loading>({ table: false, submit: false, modal: false })

	const {
		token: { colorBgContainer },
	} = theme.useToken()

	const onResetQueryForm = () => {
		queryForm.resetFields()
		fetchList()
	}

	const fetchList = async () => {
		try {
			setLoading({ ...loading, table: true })
			const params = queryForm.getFieldsValue()
			const res = await crossSellerConsumeRatioList({
				...params,
				current: pagination.current,
				size: pagination.size,
			})
			setList(res.rows)
			setPagination({ ...pagination, total: res.total })
		} finally {
			setLoading({ ...loading, table: false })
		}
	}

	const getInfo = async (id: string) => {
		try {
			setLoading({ ...loading, modal: true })
			const res = await crossSellerConsumeRatioInfo(id)
			const formState = form.getFieldsValue()
			Object.keys(formState).forEach((key) => {
				form.setFieldValue(key, res.data[key])
			})
		} finally {
			setLoading({ ...loading, modal: false })
		}
	}

	const handleUpdate = (id: string): void => {
		setIsEdit(true)
		setShowModal(true)
		onResetModalForm()
		getInfo(id)
	}

	const handleAdd = (): void => {
		setIsEdit(false)
		onResetModalForm()
		setShowModal(true)
	}

	const pageChange = (page: number) => {
		setPagination((prevState) => ({ ...prevState, current: page }))
	}

	const onResetModalForm = () => {
		form.resetFields()
		fetchList()
	}

	const onSubmit = async () => {
		form.validateFields().then(
			async (params) => {
				try {
					setLoading({ ...loading, submit: true })
					const res = isEdit
						? await editCrossSellerConsumeRatio(params)
						: await addCrossSellerConsumeRatio(params)
					if (res.resultStateVo.code === 200) {
						message.success('操作成功')
						setShowModal(false)
						onResetModalForm()
						fetchList()
					}
				} finally {
					setLoading({ ...loading, submit: false })
				}
			},
			() => {
				message.error('请完善必填项再提交！')
			}
		)
	}

	useEffect(() => {
		fetchList()
	}, [pagination.current])

	return (
		<>
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
							overflow: 'auto',
						}}
					>
						<ListHeader>
							<Form form={queryForm} layout="inline" onFinish={fetchList} autoComplete="off">
								<Form.Item style={{ marginBottom: 0 }} label="商家名称" name="sellerName">
									<Input placeholder="请输入商家名称" />
								</Form.Item>

								<Form.Item>
									<Space>
										<Button type="primary" htmlType="submit">
											搜索
										</Button>
										<Button htmlType="button" onClick={onResetQueryForm}>
											重置
										</Button>
									</Space>
								</Form.Item>
							</Form>
						</ListHeader>

						<Button type="primary" onClick={handleAdd} style={{ marginBottom: 20 }}>
							新增
						</Button>

						<Table
							size="small"
							bordered
							loading={loading.table}
							columns={columns}
							dataSource={list}
							rowKey="sellerId"
							pagination={{ total: pagination.total, onChange: pageChange }}
						/>
					</Content>
				</Layout>
			</StyledLayout>

			<Modal
				title={isEdit ? '编辑洗车豆' : '添加洗车豆'}
				centered
				open={showModal}
				onOk={() => onSubmit()}
				onCancel={() => setShowModal(false)}
				okText="确定"
				cancelText="取消"
				width={800}
				confirmLoading={loading.submit}
			>
				<Spin spinning={loading.modal}>
					<StyledForm form={form} autoComplete="off" layout="vertical" scrollToFirstError>
						<Form.Item name="crossSellerConsumeRatioId" hidden noStyle></Form.Item>
						<Form.Item name="sellerId">
							<Form.Item
								label="商家名称"
								name="sellerName"
								rules={[{ required: true, message: '请选择商家' }]}
							>
								<SelectSeller onSelect={(params) => form.setFieldsValue({ ...params })}></SelectSeller>
							</Form.Item>
						</Form.Item>

						<Form.Item label="跨商家消费返款详情">
							<Box>
								<Form.Item label="会员补贴比例" required>
									<Space.Compact>
										<Form.Item name="memberMasterSellerId">
											<Form.Item
												name="memberMasterSellerName"
												rules={[{ required: true, message: '请选择商家' }]}
											>
												<SelectSeller
													onSelect={({ sellerId, sellerName }) =>
														form.setFieldsValue({
															memberMasterSellerId: sellerId,
															memberMasterSellerName: sellerName,
														})
													}
												></SelectSeller>
											</Form.Item>
										</Form.Item>
										<Form.Item
											name="memberMasterRatio"
											rules={[{ required: true, message: '请完善会员补贴比例' }]}
										>
											<Input placeholder="请输入补贴比例" suffix="%" />
										</Form.Item>
									</Space.Compact>
								</Form.Item>

								<Form.Item
									name="machineMasterRatio"
									label="机器主获得返佣比例"
									rules={[{ required: true, message: '请完善机器主获得返佣比例' }]}
								>
									<Input placeholder="请输入补贴比例" suffix="%" style={{ width: 200 }} />
								</Form.Item>
							</Box>
						</Form.Item>
					</StyledForm>
				</Spin>
			</Modal>
		</>
	)
}

export default App
