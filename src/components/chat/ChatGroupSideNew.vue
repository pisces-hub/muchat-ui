<template>
	<div class="chat-group-side">
		<div class="group-side-search">
			<el-input placeholder="搜索群成员" v-model="searchText">
				<el-button slot="append" icon="el-icon-search"></el-button>
			</el-input>
		</div>
		<el-scrollbar class="group-side-scrollbar">
      <div class="infinite-list-wrapper" style="overflow:auto">
        <ul
            class="memberList"
            v-infinite-scroll="loadGroupMembers"
            infinite-scroll-disabled="disabled">
          <li v-for="(member) in groupMembers" class="list-item" :key="member.id">
            <group-member-new class="group-side-member" v-show="!member.quit && member.aliasName.startsWith(searchText)" :member="member"
                          :showDel="false"></group-member-new>
          </li>
        </ul>
        <p v-if="loading">加载中...</p>
        <p v-if="!hasMore">没有更多了</p>
      </div>
<!--			<div class="group-side-member-list">-->
<!--				<div v-for="(member) in groupMembers" :key="member.id">-->
<!--					<group-member class="group-side-member" v-show="!member.quit && member.aliasName.startsWith(searchText)" :member="member"-->
<!--					 :showDel="false"></group-member>-->
<!--				</div>-->
<!--			</div>-->
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
        hasMore:true,
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
		methods: {
			handleClose() {
				this.$emit('close');
			},
			loadGroupMembers() {
        if(!this.hasMore){
          return;
        }
        this.loading = true
				this.$http({
					url: `/group/members/${this.group.id}`,
					method: "get"
				}).then((members) => {
          this.hasMore = false;
					this.groupMembers = members;
				})
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
