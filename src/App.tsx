import 'antd/dist/reset.css'
import { useEffect } from 'react'
import Menu from './components/Menu'
import { getList } from './api/test'
function App() {
	useEffect(() => {
		getList().then((res) => {
			console.log(res)
		})
	}, [])
	return (
		<div className="App">
			<Menu></Menu>
		</div>
	)
}

export default App
