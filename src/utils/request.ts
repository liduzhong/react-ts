import axios from 'axios'
import { getToken } from './auth'
import { Modal } from 'antd'
const service = axios.create({
	baseURL: process.env.BASE_API,
	timeout: 5000,
})
service.interceptors.request.use((config: any) => {
	if (getToken()) {
		config.headers['Authorization'] = `Bearer ${getToken()}`
	}
	return config
})

service.interceptors.response.use((response) => {
	const [modal, contextHolder] = Modal.useModal()
	const res = response.data
	if (res.code === 401) {
		// 未登录，或者token过期
		modal.confirm({
			title: 'Confirm',
			content: 'You have been logged out, you can cancel to stay on this page, or log in again',
			okText: 'Re-Login',
			cancelText: 'Cancel',
			type: 'warning',
		})
	}

	return response.data
})

export default service
