<template>
  <div class="friend-item" :class="active ? 'active' : ''">
    <div class="avatar">
      <head-image :url="member.headImage" :id="member.userId"> </head-image>
    </div>
    <div class="text" style="font-size: 11px;">
      <div>{{ member.aliasName}}</div>
      <div :class="member.onlineState ? 'online-status  online':'online-status'">{{ member.onlineState?"[在线]":"[离线]"}}</div>
    </div>
  </div>
</template>

<script>
	import HeadImage from "../common/HeadImage.vue";
	export default{
		name: "groupMember",
		components:{HeadImage},
		data(){
			return {
        tranLeft: 0,
        tranTop: 0
      };
		},
		props:{
			member:{
				type: Object,
				required: true
			},
			showDel:{
				type: Boolean,
				default: false
			}
		},
    computed: {
      online() {

        return true;
      }
    },
		methods:{
      click(e){
        // 根据事件处理参数e下的pageX，PageY来定位div的位置
        this.tranLeft = e.pageX + 'px'
        this.tranTop = e.pageY  + 'px'
      },
			handleDelete(){
				this.$emit("del",this.member);
			}
		}
	}
</script>

<style lang="scss">
.friend-item {

  height: 65px;
  display: flex;
  margin-bottom: 1px;
  position: relative;
  //padding-left: 15px;
  align-items: center;
  padding-right: 5px;
  background-color: #fafafa;
  white-space: nowrap;
  &:hover {
    background-color: #eeeeee;
  }

  &.active {
    background-color: #dddddd;
  }


  .close {
    width: 1.5rem;
    height: 1.5rem;
    right: 10px;
    top: 1.825rem;
    cursor: pointer;
    display: none;
  }

  &:hover {
    .close {
      display: block;
    }
  }

  .avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
  }

  .text {
    margin-left: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;

    &>div {
      display: flex;
      justify-content: flex-start;
    }

    .online-status {


      &.online {
        color: #5fb878;
      }
    }
  }
}
</style>
