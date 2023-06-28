import request from '@/utils/request'

export function login(username: string, password: string) {
	const data = {
		username: username,
		password: password,
	}
	return request({
		url: '/login',
		method: 'post',
		data: { data: data },
	})
}
