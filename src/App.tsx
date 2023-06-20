import 'antd/dist/reset.css'
import request from '@/utils/request'
import { useEffect } from 'react'

function App() {
	useEffect(() => {
		request.get('/api').then(console.log)
	}, [])
	return <div className="App"></div>
}

export default App
