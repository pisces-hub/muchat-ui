import {USER_STATE} from "../api/enums.js"

export default {
	
	state: {
		userInfo: {
			
		},
		state: USER_STATE.FREE 
	},

	mutations: {
		setUserInfo(state, userInfo) {
			// 切换用户后，清理缓存
			if(userInfo.id != state.userInfo.id){
				// this.commit("resetChatStore");
			}
			state.userInfo = userInfo;
		},
		resetStore(state) {
			state.userInfo={};
			state.state=USER_STATE.FREE;
		},
		setUserState(state, userState) {
			state.state = userState;
		},
	}
	
}