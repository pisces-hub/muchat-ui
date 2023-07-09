<template>
	<div class="chat-group-side">
    <div label="群公告" style="height: 15vh;text-align: left;font-size: 15px;">
      <p><b>群公告</b></p>
      <p v-html="group.notice" style="font-size: 12px;padding: 5px;"></p>
      <p style="font-size: 12px;padding: 5px;" v-if="group.notice==null || group.notice==undefined || group.notice==''">
        群主未设置
      </p>
    </div>
    <p style="text-align: left;font-size: 15px;"><b>群成员</b></p>
		<div class="group-side-search">
      <el-input
          size="small"
          placeholder="搜索群成员"
          prefix-icon="el-icon-search"
          v-model="searchText">
      </el-input>
		</div>
		<el-scrollbar class="group-side-scrollbar">
      <div class="infinite-list-wrapper" style="overflow:auto">
        <ul
            class="memberList"
            :infinite-scroll-disabled="disabled"
            v-infinite-scroll="loadGroupMembers"
            >
          <li v-for="(member) in groupMembers" class="list-item infinite-list-item" :key="member.id">
            <group-member-new class="group-side-member" v-show="!member.quit && member.aliasName.startsWith(searchText)" :member="member"
                          :showDel="false"></group-member-new>
          </li>
        </ul>
        <p v-if="loading">加载中...</p>
        <p v-if="!hasMore">没有更多了</p>
      </div>
		</el-scrollbar>

	</div>
</template>

<script>
	import GroupMemberNew from '../group/GroupMemberNew.vue';

	export default {
		name: "chatGroupSideNew",
		components: {
      GroupMemberNew
		},
		data() {
			return {
				searchText: "",
        loading: false,
        disabled:true,
        hasMore:true,
        pageNo:0,
        pageSize:10,
			}
		},
		props: {
			group: {
				type: Object
			},
      groupMembers: {
        type: Array
      }
		},
    mounted() {
      this.loadGroupMembers();
    },
    methods: {
      arrayUnique(arr){
        let arry = Array.from(new Set(arr));
        arry = arry.sort(function(a,b){
          let x = a["onlineState"];
          let y = b["onlineState"];
          if(x && y){
            return 0;
          }else if(x){
            return -1;
          }else if(y){
            return 1;
          }else{
            return 0;
          }
        });
        return arry;
      },
			handleClose() {
				this.$emit('close');
			},
			loadGroupMembers() {

			},
		},
		computed: {


		}
	}
</script>

<style lang="scss">
.memberList {
  list-style-type:none;
  padding: 0px;
  li{
    text-align: left;
  }
}
	.chat-group-side {
		position: relative;

		.group-side-member-list {
			padding: 10px;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			font-size: 16px;
			text-align: center;

			.group-side-member {
				margin-left: 15px;
			}

			.group-side-invite {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 50px;
				margin-left: 15px;

				.invite-member-btn {
					width: 100%;
					height: 50px;
					line-height: 50px;
					border: #cccccc solid 1px;
					font-size: 25px;
					cursor: pointer;
					box-sizing: border-box;

					&:hover {
						border: #aaaaaa solid 1px;
					}
				}

				.invite-member-text {
					font-size: 16px;
					text-align: center;
					width: 100%;
					height: 30px;
					line-height: 30px;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden
				}
			}
		}

		.group-side-form {
			text-align: left;
			padding: 10px;
			height: 30%;

			.el-form-item {
				margin-bottom: 12px;

				.el-form-item__label {
					padding: 0;
					line-height: 30px;
				}

				.el-textarea__inner {
					min-height: 100px !important;
				}
			}

			.btn-group {
				text-align: center;
			}
		}

	}
</style>
