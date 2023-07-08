import httpRequest from '../api/httpRequest.js'
import {USER_STATE} from "@/api/enums";
import Vue from "vue";

export default {

    state: {
        groups: {
            "-999": {}
        }
    },
    mutations: {
        resetStore(state) {
            state.groups = {
                "-999": {}
            };
        },
        updateMember(state,data){
            let array = data.list;
            let groupId = data.groupId;
            if(array==undefined || array==null || array.length<1){
                return;
            }
            let group = state.groups[groupId];
            if(group===null || group===undefined){
                group = {};
            }

            for(const element of array){
                group[element.userId] = element;
            }
            Vue.set(state.groups,groupId,group);
        }
    }
}