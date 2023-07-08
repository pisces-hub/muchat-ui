<template>
	<div class="group-member" @click="click" :style="{left: tranLeft, top: tranTop}">
    <div style="display: inline-block">
      <head-image :url="member.headImage" :size="30" :id="member.userId">
      </head-image>
    </div>
		<span class="member-name" :class="member.onlineState?'onlineClass':''">
      <span>{{member.aliasName}}</span>
    </span>
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
  .onlineClass{
    color: #ef7b06;
    font-weight: bold;
  }
	.group-member{
		display: flex;
		flex-direction: row;
		align-items: center;
    text-align: left;
    margin-top: 5px;
    cursor: pointer;
		width: 100%;
    padding: 5px;
		.member-name {
			font-size: 12px;
			text-align: left;
			width: 100%;
			height: 30px;
      margin-left: 8px;
			line-height: 30px;
			white-space: nowrap;
			text-overflow:ellipsis;
			overflow:hidden
		}
		

		&:hover{
			//display: block;
			background-color: rgba(86, 153, 194, 0.99);
      color: yellow;
		}
	}
</style>
