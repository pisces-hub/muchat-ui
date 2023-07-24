import Vue from "vue";

var websock = null;
let rec; //断线重连后，延迟5秒重新创建WebSocket连接  rec用来存储延迟请求的代码
let isConnect = false; //连接标识 避免重复连接
let wsurl = "";
let userToken = null;
let messageCallBack = null;
let openCallBack = null;
let closeCallBack = null;
let heartCallBack = null;
let reConnectCallBack = null;
let hasLogin = false;

let createWebSocket = (token) => {
	userToken = token;
	initWebSocket();
};

let initWebSocket = async () => {
	try {

		wsurl = await findWsUrl();

		hasLogin = false;
		websock = new WebSocket(wsurl);
		websock.onmessage = function(e) {
			let sendInfo = JSON.parse(e.data)
			if (sendInfo.cmd == 0) {
				hasLogin = true;
				heartCheck.start()
				// 登录成功才算连接完成
				openCallBack && openCallBack(wsurl);
			}
			else if(sendInfo.cmd==1){
				heartCallBack && heartCallBack(sendInfo);
				// 重新开启心跳定时
				heartCheck.reset();
			} else {
				// 其他消息转发出去
				messageCallBack && messageCallBack(sendInfo.cmd,sendInfo.data)
			}
		}
		websock.onclose = function(e) {
			isConnect = false; //断开后修改标识

			closeCallBack && closeCallBack(e);
			reConnect();
		}
		websock.onopen = function() {
			isConnect = true;
			// 发送登录命令
			let loginInfo = {
				cmd: 0,
				data: {token: userToken}
			};
			websock.send(JSON.stringify(loginInfo));
		}

		// 连接发生错误的回调方法
		websock.onerror = function() {
			isConnect = false; //连接断开修改标识
			reConnect();
		}
	} catch (e) {
		// this.commit("connectorClose",e);
		reConnect(); //如果无法连接上webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
	}
};

let findWsUrl = () =>{
	let url = null;
	return Vue.prototype.$http({
		url: `/connector/node?protocol=WS`,
		method: 'get'
	}).then((data) => {
		url ="ws://"+data.ip+":"+data.port+"/im";
		return Promise.resolve(url);
	})
}

//定义重连函数
let reConnect = () => {
	if (isConnect) return; //如果已经连上就不在重连了
	rec && clearTimeout(rec);
	rec = setTimeout(function() { // 延迟1秒重连  避免过多次过频繁请求重连
		initWebSocket(wsurl);
		reConnectCallBack && reConnectCallBack();
	}, 1000);
};
//设置关闭连接
let closeWebSocket = () => {
	websock.close();
};


//心跳设置
var heartCheck = {
	timeout: 5000, //每段时间发送一次心跳包 这里设置为20s
	timeoutObj: null, //延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）
	start: function() {
		if(isConnect){
			let heartBeat = {
				cmd: 1,
				data: {
					token: userToken
				}
			};
			websock.send(JSON.stringify(heartBeat))
		}
	},

	reset: function(){
		clearTimeout(this.timeoutObj);
		this.timeoutObj = setTimeout(function() {
			heartCheck.start();
		}, this.timeout);
		
	}
};



// 实际调用的方法
function sendMessage(agentData) {
	if (websock.readyState === websock.OPEN) {
		// 若是ws开启状态
		websock.send(JSON.stringify(agentData))
	} else if (websock.readyState === websock.CONNECTING) {
		// 若是 正在开启状态，则等待1s后重新调用
		setTimeout(function() {
			sendMessage(agentData)
		}, 1000)
	} else {
		// 若未开启 ，则等待1s后重新调用
		setTimeout(function() {
			sendMessage(agentData)
		}, 1000)
	}
}


function onmessage(callback) {
	messageCallBack = callback;
}


function onopen(callback) {
	openCallBack = callback;
	if (hasLogin) {
		openCallBack();
	}
}

function onclose(callback) {
	closeCallBack = callback;
}
function onheart(callback) {
	heartCallBack = callback;
}

function onReConnect(callback) {
	reConnectCallBack = callback;
}


// 将方法暴露出去
export {
	createWebSocket,
	closeWebSocket,
	sendMessage,
	onmessage,
	onopen,
	onheart,
	onclose,
	onReConnect
}
