/**
 * 通过crypto-js实现 加解密工具
 * AES、HASH(MD5、SHA256)、base64
 * @author: allon
 */
import CryptoJS from 'crypto-js'
const KP = {
	key: '1234567812345678', // 秘钥 16*n:
	iv: '1234567812345678', // 偏移量
}
function getAesString(data, key, iv) {
	// 加密
	key = CryptoJS.enc.Utf8.parse(key)
	// alert(key）;
	iv = CryptoJS.enc.Utf8.parse(iv)
	const encrypted = CryptoJS.AES.encrypt(data, key, {
		iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	})
	return encrypted.toString() // 返回的是base64格式的密文
}
function getDAesString(encrypted, key, iv) {
	// 解密
	key = CryptoJS.enc.Utf8.parse(key)
	iv = CryptoJS.enc.Utf8.parse(iv)
	const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
		iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	})
	return decrypted.toString(CryptoJS.enc.Utf8) //
}
// AES 对称秘钥加密
const aes = {
	en: (data) => getAesString(data, KP.key, KP.iv),
	de: (data) => getDAesString(data, KP.key, KP.iv),
}
// BASE64
const base64 = {
	en: (data) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)),
	de: (data) => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8),
}
// SHA256
const sha256 = (data) => {
	return CryptoJS.SHA256(data).toString()
}
// MD5
const md5 = (data) => {
	return CryptoJS.MD5(data).toString()
}

/**
 * 签名
 * @param token 身份令牌
 * @param timestamp 签名时间戳
 * @param data 签名数据
 * @param key 签名key
 * @param nonce 随机字符串
 */
const sign = (token, timestamp, data, key, nonce) => {
	// 签名格式 data(字典升序) + token + key(随机生成的秘钥) + ts(当前时间戳timestamp) + nonce(随机数)
	const ret = []
	for (const it in data) {
		let val = data[it]
		if (
			typeof val === 'object' && //
			(!(val instanceof Array) || (val.length > 0 && typeof val[0] === 'object'))
		) {
			val = JSON.stringify(val)
		}
		ret.push(it + val)
	}
	// 字典升序
	ret.sort()
	const signsrc = ret.join('') + token + key + timestamp + nonce
	return md5(signsrc).toUpperCase()
}

/**
 * 判断数据类型
 * @param {*} tgt
 * @param {*} type
 * @returns
 * DataType("young"); // "string"
 *DataType(202175); // "number"
 *DataType(true); // "boolean"
 *DataType([], "array"); // true
 *DataType({}, "array"); // false
 */
const dataType = (tgt, type) => {
	const dataType = Object.prototype.toString
		.call(tgt)
		.replace(/\[object (\w+)\]/, '$1')
		.toLowerCase()
	return type ? dataType === type : dataType
}

/**
 * 删除对象属性
 * @param {obj 处理数据} obj
 * @param {keys 移除Keys} keys
 * @returns
 */
const delDataKey = (obj, keys) => {
	keys.map(function (key) {
		if (obj.hasOwnProperty(key)) {
			delete obj[key]
		}
	})
	return obj
}

/**
 *
 * @param {data 签名数据}} data
 * @param {timestamp 时间戳} timestamp
 * @param {version 版本号} version
 * @param {key 签名key} key
 * @returns 构建数据签名
 */
const createSign = (data, timestamp, version, key) => {
	// debugger;
	// 接收传递参数
	const tempObject = data.data

	// 原对象
	const objectData = data.data

	// 类型object /编辑新增场景
	const isObject = dataType(objectData, 'object')

	// 删除编辑/多主键 场景
	const isArray = dataType(objectData, 'array')

	// 删除编辑/单个主键 场景
	const isString = dataType(objectData, 'string')

	// 存在需移除
	const delKeyArry = ['size', 'current', 'createTime', 'creatorId', 'updateId', 'updateTime']

	let newObject = {}
	newObject['timestamp'] = timestamp
	newObject['version'] = version

	const newArry = []
	// 如果是对象、那么判断是否存在
	if (isObject) {
		// 将处理以后的对象进行赋值
		newObject = { ...newObject, ...delDataKey(tempObject, delKeyArry) }
	}
	// debugger;
	if (isArray) {
		// 处理数组格式、删除、对象查询
		if (objectData != null && objectData != undefined && objectData != '') {
			var arr = []
			for (var i in objectData) {
				if (objectData[i] != null && objectData[i] != 'undefined' && objectData[i] != '') {
					// 校验value值是否为空、空则不添加签名
					arr.push(objectData[i])
				}
			}
			newObject['data'] = arr.join(',')
		}
	}
	if (isString) {
		if (objectData != null && objectData != undefined && objectData != '') {
			newObject['data'] = objectData
		}
	}
	const newData = {}
	Object.keys(newObject)
		.sort()
		.map((key) => {
			// 排序
			if (
				newObject[key] != null &&
				newObject[key] != undefined &&
				`${newObject[key]}` != '' &&
				newObject[key] != 'null'
			) {
				newData[key] = newObject[key]
			}
		})
	let strsign = ''
	Reflect.ownKeys(newData).forEach(function (key) {
		const tempkey = key
		let tempvalue = newData[key]
		const isArrayTow = dataType(tempvalue, 'array') // 判断是否是数组
		if (isArrayTow) {
			tempvalue = JSON.stringify(tempvalue)
		}
		if (tempvalue != null && tempvalue != undefined && `${tempvalue}` != '' && tempvalue != 'null' && !isArrayTow) {
			strsign = strsign + tempkey + '=' + tempvalue.toString() + '&'
		}
	})
	strsign = strsign + `key=${key}`
	// console.log('生成签名拼接字符串',strsign)
	return md5(strsign).toUpperCase() // md5(signStr).toUpperCase();
}

export { aes, md5, sha256, base64, sign, createSign, dataType }
