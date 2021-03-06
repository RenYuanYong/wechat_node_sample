'use strict'

var config = require('./config')
var Wechat = require('./wechat/wechat')
var menu = require('./config/menu')

var wechatApi = new Wechat(config.wechat)
console.log('ryy-test1')

wechatApi.getMenu().then(function() {
	return wechatApi.createMenu(menu)
})
.then(function(msg) {
	console.log('当前菜单结构：' + JSON.stringify(msg))
})

//负责接收、回复消息
exports.reply = function* (next) {
	var message = this.weixin;

	//判断是事件还是消息
	if (message.MsgType === 'event') {
		console.log('走到这啦111')
		if (message.Event === 'subscribe') {
			if (message.EventKey) {
				//essage.ticket 可转换二维码图片
				console.log('通过扫描二维码：' + message.EventKey + ' ' + message.ticket)
			}
			console.log('走到这啦2')
			this.body = '幸运女神在微笑，欢迎订阅'
			return
		}
		else if (message.Event === 'unsubscribe') {
			console.log('取关了，怪我喽')
			this.body = '';
		}
		else if (message.Event === 'LOCATION') {
			console.log('报告位置')
			this.body ='报告出的位置是：' + message.Latitude + '/' +
					message.Longitude + '-' + message.Precision
		}
		else if (message.Event ==='CLICK') {
			this.body = '点击了菜单咯：' + message.EventKey
		}
		else if (message.Event ==='SCAN') { //扫描
			console.log('关注后扫描二维码' + message.EventKey + '' +message.TIcket)

			this.body = '不小心看到你扫了一下'
		}
		else if (message.Event ==='VIEW') { //扫描
			this.body = '点击了菜单中的链接咯： ' + message.EventKey
		}
		else if (message.Event ==='scancode_push') { 
			console.log('扫码推送事件type:' + message.ScanCodeInfo.ScanType)
			console.log('扫码推送事件结果:' + message.ScanCodeInfo.ScanResult)
			this.body = '扫码推送事件 ' + message.EventKey
		}
		else if (message.Event ==='scancode_waitmsg') { 
			console.log('扫码推送中TYPE:' + message.ScanCodeInfo.ScanType)
			console.log('扫码推送中结果:' + message.ScanCodeInfo.ScanResult)
			this.body = '扫码推送中 ' + message.EventKey
		}
		else if (message.Event ==='pic_sysphoto') { 
			console.log('弹出系统拍照count:' + message.Count)
			console.log('弹出系统拍照List:' + message.PicList)
			this.body = '弹出系统拍照： ' + message.EventKey
		}
		else if (message.Event ==='pic_photo_or_album') { 
			console.log('弹出拍照或者相册count:' + message.Count)
			console.log('弹出拍照或者相册List:' + message.PicList)
			this.body = '弹出拍照或者相册 ' + message.EventKey
		}
		else if (message.Event ==='pic_weixin') { 
			console.log('弹出微信相册发图器count:' + message.Count)
			console.log('弹出微信相册发图器List:' + message.PicList)
			this.body = '弹出微信相册发图器 ' + message.EventKey
		}
		else if (message.Event ==='location_select') { 
			console.log('弹出微信相册发图器X:' + message.Location_X)
			console.log('弹出微信相册发图器y:' + message.Location_Y)
			console.log('弹出微信相册发图器Scale:' + message.Scale)
			console.log('弹出微信相册发图器Label:' + message.Label)
			console.log('弹出微信相册发图器Poiname:' + message.Poiname)
			this.body = '弹出地理位置选择器 ' + message.EventKey
		}
	}
	else if (message.MsgType ==='text') {
		var content = message.Content;
		var reply = '嗯、我觉得你说的 ' + content + ' 很有道理！';

		if (content ==='1') {
			reply = '这个数字很强啊';
		}
		else if (content === '2') {
			reply = '千年老二，你最二';
		}
		else if (content === '3') {
			reply = '333,我在的';
		}
		else if (content === '4') {
			reply = '一巴掌，拍了4个PDD';
		}
		else if (content === '福利') {
			reply = [{
				title: '福利点击就送',
				description: '发福利啦！',
				picUrl: 'http://fun.datang.net/uploadpic/95045a50af034852b430afe130e3da5a.jpg',
				url:'https://mp.weixin.qq.com'
			}]
		}
		else if (content === '小仙女图片') {
			//获取到刚刚上传临时素材（图片），用过primise的then方法 和 generator的yield配合
			var data = yield wechatApi.uploadMaterial('image', __dirname + '/test/test.jpg')
			
			reply = {
				type: 'image',
				mediaId: data.media_id,
			}
		}
		else if (content === '6') {
			
			var data = yield wechatApi.uploadMaterial('video', __dirname + '/test/test.mp4')

			reply = {
				type: 'video',
				title: '回复的视频内容',
				description: '悄悄测试一下',
				mediaId: data.media_id
			}
		}
		else if (content === '7') {
			var data = yield wechatApi.uploadMaterial('image', __dirname + '/test/test.jpg')

			reply = {
				type: 'music',
				title: '回复的音乐内容',
				description: '听听音乐',
				musicUrl: 'http://sc1.111ttt.com/2016/5/06/26/199261531004.mp3',
				thumbMediaId: data.media_id
			}
		}
		else if (content === '小仙女') {
			//获取到刚刚上传临时素材（图片），用过primise的then方法 和 generator的yield配合
			var data = yield wechatApi.uploadMaterial('image', __dirname + '/test/test.jpg', 
						{type: 'image'})
			console.log('仙女:'+JSON.stringify(data))
			reply = {
				type: 'image',
				mediaId: data.media_id,
			}
		}
		else if (content === '8') {
			//获取到刚刚上传临时素材（图片），用过primise的then方法 和 generator的yield配合
			var data = yield wechatApi.uploadMaterial('video', __dirname + '/test/test.mp4', 
						{type: 'video', description: '{"title": "nice place", "introduction": "Filco key"}'})

			reply = {
				type: 'video',
				title: '回复的视频内容',
				description: '悄悄测试一下,永久素材',
				mediaId: data.media_id
			}
		}
		else if (content === '10') {
			//先拿到上传的图文
			var picData = yield wechatApi.uploadMaterial('image', __dirname + '/test/test.jpg', {type: 'image'})
			console.log("10de-data000:" + JSON.stringify(picData))
			var media = {
				articles: [{
					title: '十三岁的小仙女',
					thumb_media_id: picData.media_id,
					author: 'renyy',
				  digest: "儿童节快乐",
	        show_cover_pic: 1,
	        content: "想看正文？等着吧",
	        content_source_url: "https://github.com"
				}]
			}
			// 新增永久图文消息
			var data = yield wechatApi.uploadMaterial("news", media, {})
			console.log("10de-data001:" + JSON.stringify(data))

			//获取到永久图文消息
			data = yield wechatApi.fetchMaterial(data.media_id, "news", {})

			console.log("10de-data002:" + JSON.stringify(data))

			var items = data.news_item 
			var news = []

			items.forEach(function(item) {
				news.push({
					title: item.title,
					description: item.digest,
					picUrl: picData.url,
					url: item.url
				})
			})

			reply = news;
		}
		else if (content === '条数') {
			var counts = yield wechatApi.countMaterial()

			console.log('count:' + JSON.stringify(counts))

			//yield 高级语法，实现并发执行
			var results = yield [
				wechatApi.batchMaterial({
					type: 'image',
					offset: 0,
					count: 10
				}),
				wechatApi.batchMaterial({
				type: 'video',
					offset: 0,
					count: 10
				}),
				wechatApi.batchMaterial({
					type: 'voice',
					offset: 0,
					count: 10
				}),
				wechatApi.batchMaterial({
					type: 'news',
					offset: 0,
					count: 10
				})
			]

			console.log('ryy-count:' + JSON.stringify(results))

			reply = '获取count成功'
			
		}

		this.body = reply;
	}
}