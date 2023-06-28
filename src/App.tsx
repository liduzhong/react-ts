import 'antd/dist/reset.css'
import { useEffect } from 'react'
import { login } from '@/api/login'
import { setToken, TokenKey } from '@/utils/auth'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import CrossSellerRefund from '@/views/crossSellerRefund'
dayjs.locale('zh-cn')

function App() {
	const handleLogin = (): Promise<any> => {
		const username = 'admin'
		const password = 'chy2022'
		return new Promise((resolve, reject) => {
			login(username, password)
				.then((res) => {
					console.log('用户登录成功', res)
					setToken(res.data.access_token)
					// resolve()
				})
				.catch((error) => {
					reject(error)
				})
		})
	}
	const isLogin = (): boolean => {
		return !!localStorage.getItem(TokenKey)
	}
	useEffect(() => {
		!isLogin() && handleLogin()
	})
	return (
		<ConfigProvider locale={zhCN}>
			<div className="App">
				<CrossSellerRefund />
			</div>
		</ConfigProvider>
	)
}

export default App
