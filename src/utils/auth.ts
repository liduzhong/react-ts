export const TokenKey: string = 'Admin-Token'

export function getToken() {
	return `eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImRjZjg3NjQ5LTU5N2MtNGM4NS1iMTg2LWZkM2ZmYzhiODVmZSJ9.g6Quc2A6kuzlGtoEoDGtF0-AxVOhYqOEDdhEIgEUkELWp0s3E2RDCc6p3q7KRwuDFocEb2fyRLBKfkNHfG6Ewg`
	// return localStorage.getItem(TokenKey)
}

export function setToken(token: string) {
	return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
	return localStorage.removeItem(TokenKey)
}
