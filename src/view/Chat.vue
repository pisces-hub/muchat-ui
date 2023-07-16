<template>
	<el-container>
		<el-aside width="14vw" class="l-chat-box">
			<div class="l-chat-header">
				<el-input width="200px" placeholder="搜索聊记录" v-model="searchText">
					<el-button slot="append" @click="searchChatSessionList()" icon="el-icon-search"></el-button>
				</el-input>
			</div>
			<el-scrollbar class="l-chat-list" v-if="chatStore.chats.length>0">
				<div v-for="(chat,index) in chatStore.chats" :key="index">
					<chat-item :chat="chat" :index="index" @click.native="handleActiveItem(index)" @del="handleDelItem(chat,index)"
					 :active="index === chatStore.activeIndex"></chat-item>
				</div>
			</el-scrollbar>
      <div v-if="chatStore.chats.length<1" class="blank_list">
        空空如也～
      </div>
		</el-aside>
		<el-container class="r-chat-box">
			<chat-box v-show="activeChat.targetId!=null" :chat="activeChat"></chat-box>
		</el-container>
	</el-container>
</template>

<script>
	import ChatItem from "../components/chat/ChatItem.vue";
	import ChatBox from "../components/chat/ChatBox.vue";
  import httpRequest from "@/api/httpRequest";
	
	export default {
		name: "chat",
		components: {
			ChatItem,
			ChatBox
		},
		data() {
			return {
				searchText: "",
				messageContent: "",
				group: {},
				groupMembers: [] 
			}
		},
		methods: {
      searchChatSessionList(){
        this.pullSessionList();
      },
      pullSessionList() {
        httpRequest({
          url: '/chatSession/list',
          method: 'get',
        }).then((data) => {
          if(data===undefined || data.length<1){
            return;
          }
          let tmp = [];
          for (const element of data) {
            let item = element;
            let chart = {
              targetId:item.targetId,
              type: item.chatType,
              showName:item.name,
              headImage: item.headImage,
              lastContent:item.lastContent,
              lastSendTime: item.lastSendTime,
              unreadCount: item.unreadCount,
              messages: item.messages.toReversed()
            };
            tmp.push(chart);
          }
          if(tmp===undefined || tmp.length<1){
            return;
          }
          this.$store.commit("resetMessageList",tmp)
        }).catch((err) => {
        });
      },
			handleActiveItem(index) {
				this.$store.commit("activeChat", index);
			},
			handleDelItem(chat, index) {
        httpRequest({
          url: '/chatSession/del',
          method: 'delete',
          data:{
            "targetId":chat.targetId,
            "chatType":chat.type
          }
        }).then((data) => {
          this.$store.commit("removeChat", index);
        });

			}
		},
    mounted() {
      let query = this.$route.query;
      if(query.reload=='1'){
        this.pullSessionList();
      }

    },
    computed: {
			chatStore() {
				return this.$store.state.chatStore;
			},
			activeChat() {
				let index = this.chatStore.activeIndex;
				let chats = this.chatStore.chats
				if (index >= 0 && chats.length > 0) {
					return chats[index];
				}
				// 当没有激活任何会话时，创建一个空会话，不然控制台会有很多报错
				let emptyChat = {
					targetId: null,
					showName: "",
					headImage: "",
					messages: []
				}
				return emptyChat;
			}
		}
	}
</script>

<style lang="scss">
	.el-container {
		.l-chat-box {
			display: flex;
			flex-direction: column;
			border: #dddddd solid 1px;
			background: white;
			width: 3rem;

			.l-chat-header {
				padding: 5px;
				background-color: white;
				line-height: 50px;
			}
			
			.l-friend-ist{
				flex: 1;
			}
		}
	}
  .blank_list{
    margin-top: 20px;
    color: rgb(1 2 2 / 55%);
  }
</style>
