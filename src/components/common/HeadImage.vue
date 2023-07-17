<template>
	<div class="head-image" @click="showUserInfo($event)">
    <el-avatar :src="url">
      <img src="../../assets/default_head_man.png"/>
    </el-avatar>
		<slot></slot>
	</div>
</template>

<script>

	export default {
		name: "headImage",
		data() {
			return {}
		},
		props: {
			id:{
				type: Number
			},
			size: {
				type: Number,
				default: 50
			},
			url: {
				type: String
			}
		},
		methods:{
			showUserInfo(e){
				if(this.id && this.id>0){
					this.$http({
						url: `/user/find/${this.id}`,
						method: 'get'
					}).then((user) => {
						this.$store.commit("setUserInfoBoxPos",e);
						this.$store.commit("showUserInfoBox",user);
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.head-image {
		position: relative;
		img {
			position: relative;
			overflow: hidden;
			border-radius: 10%;
      overflow-clip-margin: content-box;
      overflow: clip;
		}

		img:before {
			content: '';
			display: block;
			width: 100%;
			height: 100%;
			background: url('../../assets/default_head_man.png') no-repeat 0 0;
			background-size: 100%;
		}
	}
</style>
