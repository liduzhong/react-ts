import request from '../utils/request'

export function getList(params?: any) {
	return request.get('/user/get_list', params)
}
