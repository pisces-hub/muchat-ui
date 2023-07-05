import Vue from "vue";
import {CONNECTOR_STATE} from "../api/enums.js"

export default {
	
	state: {
		url:null,
		connectorTime:null,
		closeTime:null,
		state:-1,
		errorMsg:null,
		signal:0,
		historyHeart:[],
	},

	mutations: {
		connectorSuccess(state,url) {
			state.url = url;
			state.status = CONNECTOR_STATE.CONNECTING;
			state.connectorTime = Date.now();
			state.signal = 80;
		},
		connectorClose(state,errMsg) {
			state.status = CONNECTOR_STATE.CLOSE;
			state.closeTime = Date.now();
			state.errorMsg = errMsg;
			state.signal = 0;
		},
		heart(state,data) {
			let currentTime = Date.now();
			if(state.historyHeart.length>3){
				state.historyHeart = state.historyHeart.slice(0,3);
			}else{
				state.historyHeart.unshift(currentTime);
			}
			//计算三次心跳间隔
			let beforeTime = null;
			let diff = 0;
			for (var i in state.historyHeart) {
				let time = state.historyHeart[i];
				if(beforeTime==null){
					beforeTime = time;
					continue;
				}
				diff += (beforeTime-time);
				beforeTime = time;
			}
			let second = Math.abs(diff)/1000;
			if(second>=0 & second<30){
				state.signal = 100;
			}else if(second<50){
				state.signal = 85;
			}else if(second<60){
				state.signal = 60;
			}else if(second<80){
				state.signal = 30;
			}else{
				state.signal = 5;
			}
		},
		resetStore(state) {
			state.url=null;
			state.connectorTime=null;
			state.closeTime = null;
			state.signal = 0;
			historyHeart:[];
		},

	}
	
}