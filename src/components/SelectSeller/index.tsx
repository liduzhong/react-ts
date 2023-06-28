import { AutoComplete } from 'antd'
import { useState, useEffect, memo } from 'react'
import { getInfoSellerList } from '@/api/crossSellerRefund'
interface SelectParams {
	sellerId: string
	sellerName: string
}
interface Props {
	disabled?: boolean
	placeholder?: string
	value?: string
	onSelect?: (params: SelectParams) => void
}
const SelectSeller = memo(({ disabled = false, placeholder = '请选择商家', value = '', onSelect }: Props) => {
	const [acValue, setAcValue] = useState('')
	const [options, setOptions] = useState<{ value: string }[]>([])

	const handleSelect = (_: string, option: Record<string, any>) => {
		onSelect && onSelect({ sellerId: option.sellerId, sellerName: option.sellerName })
	}

	const onSearch = async (value: string) => {
		const { data = [] } = await getInfoSellerList({ sellerName: value })
		data.forEach((item: Record<string, any>) => (item.value = item.label = item.sellerName))
		setOptions(data)
	}

	const onChange = (data: string) => {
		setAcValue(data)
	}

	useEffect(() => {
		setAcValue(value)
	}, [value])

	return (
		<AutoComplete
			value={acValue}
			options={options}
			disabled={disabled}
			style={{ width: 200 }}
			allowClear
			onSelect={handleSelect}
			onSearch={(text) => onSearch(text)}
			onChange={onChange}
			placeholder={placeholder}
		/>
	)
})

export default SelectSeller
