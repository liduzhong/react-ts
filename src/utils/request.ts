import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Modal, message } from 'antd'
import { getToken } from './auth'
import { createSign } from './crypto'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
	baseURL: process.env.REACT_APP_BASE_API,
	timeout: 60000,
})

// request拦截器
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// 默认每次需携带的请求头
		const ts = timestamp()
		// 是否需要设置 token
		let size
		let current
		let signStr
		if (config.data && config.data.data) {
			const temp = config.data.data
			size = temp['size']
			current = temp['current']
			signStr = createSign(config.data, ts, '0', 'test')
		}
		const isToken = (config.headers || {}).isToken === false
		// console.log(config,"config.url")
		if (config?.url?.includes('listHistorySignFormData')) {
		} else {
			if (getToken() && !isToken) {
				config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
			}
		}
		const data = config.data
		config.data = JSON.stringify({
			version: '0', // 版本号
			sign: signStr, // 签名
			timestamp: ts, // 追加时间戳
			...data, // 拼接参数
			size: size,
			current: current,
		})
		// get请求映射params参数
		if (config.method === 'get' && config.params) {
			let url = config.url + '?'
			for (const propName of Object.keys(config.params)) {
				const value = config.params[propName]
				var part = encodeURIComponent(propName) + '='
				if (value !== null && typeof value !== 'undefined') {
					if (typeof value === 'object') {
						for (const key of Object.keys(value)) {
							const params = propName + '[' + key + ']'
							var subPart = encodeURIComponent(params) + '='
							url += subPart + encodeURIComponent(value[key]) + '&'
						}
					} else {
						url += part + encodeURIComponent(value) + '&'
					}
				}
			}
			url = url.slice(0, -1)
			// config.params = {};
			config.params = {}
			config.url = url
		}
		return config
	},
	(error: AxiosError) => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	(response: AxiosResponse) => {
		const {
			resultStateVo: { code, msg },
		} = response.data
		if (code === 401) {
			// 未登录，或者token过期
			Modal.confirm({
				title: '提示',
				content: '您已经登出，您可以取消留在该页面，或重新登录',
				okText: '重新登录',
				cancelText: '取消',
				type: 'warning',
			})
		} else if (code !== 200) {
			message.error(msg || 'Error')
		}
		return response.data
	},
	(error: AxiosError) => {
		let { message: msg } = error
		if (msg === 'Network Error') {
			msg = '系统接口连接异常'
		} else if (msg.includes('timeout')) {
			msg = '系统接口请求超时'
		} else if (msg.includes('Request failed with status code')) {
			msg = '系统接口' + msg.substr(msg.length - 3) + '异常'
		}
		message.error(msg)
		return Promise.reject(error)
	}
)

/**
 * 从1970年开始的毫秒数然后截取10位变成 从1970年开始的秒数
 * @return 返回10位时间戳
 */
const timestamp = (): string => {
	let tmp = Date.parse(String(new Date())).toString()
	tmp = tmp.substr(0, 13)
	return tmp
}

export default service
