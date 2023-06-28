import request from '@/utils/request'

// 跨商家消返列表
export function crossSellerConsumeRatioList(data: any) {
	return request({
		url: '/crossSellerConsumeRatio/list',
		method: 'post',
		data: { data: data },
	})
}

// 跨商家消返详情
export function crossSellerConsumeRatioInfo(data: any) {
	return request({
		url: '/crossSellerConsumeRatio/getOneInfo',
		method: 'post',
		data: { data: data },
	})
}

// 跨商家消返添加
export function addCrossSellerConsumeRatio(data: any) {
	return request({
		url: '/crossSellerConsumeRatio/add',
		method: 'post',
		data: { data: data },
	})
}

// 跨商家消返编辑
export function editCrossSellerConsumeRatio(data: any) {
	return request({
		url: '/crossSellerConsumeRatio/edit',
		method: 'put',
		data: { data: data },
	})
}

// 查询商家列表
export function getInfoSellerList(query: { sellerName: string }) {
	return request({
		url: '/crmSellerRechargeAmountRegularConfig/getInfoSellerList',
		method: 'post',
		data: { data: query },
	})
}
