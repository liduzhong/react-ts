import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { Modal } from 'antd'
import { getToken } from './auth'

const service = axios.create({
	baseURL: process.env.REACT_APP_BASE_API,
	timeout: 60000,
})

service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	if (getToken()) {
		config.headers['Authorization'] = `Bearer ${getToken()}`
	}
	return config
})

service.interceptors.response.use((response: AxiosResponse) => {
	const [modal] = Modal.useModal()
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
