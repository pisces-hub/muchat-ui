import Vue from "vue";
import {CONNECTOR_STATE} from "../api/enums.js"

export default {
	
	state: {
		node:{
			url:null,
			connectorTime:null,
			closeTime:null,
			state:-1,
			errorMsg:null,
			signal:0,
			historyHeart:[],
			heartCount:0,
			reConnectCount:0
		}
	},

	mutations: {
		connectorSuccess(state,url) {
			state.node.url = url;
			state.node.connectorTime = Date.now();
			state.node.signal = 80;
			state.node.state = CONNECTOR_STATE.CONNECTING;
			state.node.reConnectCount = 0;
		},
		onReConnect(state){
			state.node.reConnectCount++;
		},
		connectorClose(state,errMsg) {
			state.node.status = CONNECTOR_STATE.CLOSE;
			state.node.closeTime = Date.now();
			state.node.errorMsg = errMsg;
			state.node.signal = 0;
			state.node.state = CONNECTOR_STATE.CLOSE;
		},
		heart(state,data) {
			let currentTime = Date.now();
			state.node.heartCount++;
			if(state.node.historyHeart.length>10){
				state.node.historyHeart = state.node.historyHeart.slice(0,10);
			}else{
				state.node.historyHeart.unshift(currentTime);
			}
			//计算平均心跳间隔
			let beforeTime = null;
			let diff = 0;
			for (var i in state.node.historyHeart) {
				let time = state.node.historyHeart[i];
				if(beforeTime==null){
					beforeTime = time;
					continue;
				}
				diff += (beforeTime-time);
				beforeTime = time;
			}
			let svgSecond = 0;
			if(state.node.historyHeart.length>1){
				svgSecond = Math.abs(diff)/(state.node.historyHeart.length-1)/1000;
			}
			if(svgSecond>=0 && svgSecond<10){
				state.node.signal = 100;
			}else if(svgSecond<15){
				state.node.signal = 85;
			}else if(svgSecond<20){
				state.node.signal = 60;
			}else if(svgSecond<25){
				state.node.signal = 30;
			}else{
				state.node.signal = 5;
			}
		},
		resetStore(state) {
			state.node.url=null;
			state.node.connectorTime=null;
			state.node.closeTime = null;
			state.node.signal = 0;
			state.node.historyHeart=[];
		},

	}
	
}