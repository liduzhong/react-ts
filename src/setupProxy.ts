const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app: any) {
	app.use(
		createProxyMiddleware(process.env.REACT_APP_BASE_API, {
			target: process.env.REACT_APP_BASE_URL,
			changeOrigin: true,
			ws: true,
			pathRewrite: {
				[`^${process.env.REACT_APP_BASE_API}`]: '',
			},
		})
	)
}
