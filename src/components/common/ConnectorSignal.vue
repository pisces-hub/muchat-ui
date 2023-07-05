<template>
  <div class="box">
    <ul style="width: 60px;  height: 22px;" :title="title">
      <li><span v-if="num >= 10"></span></li>
      <li><span v-if="num >= 20"></span></li>
      <li><span v-if="num >= 30"></span></li>
      <li><span v-if="num >= 40"></span></li>
      <li><span v-if="num >= 50"></span></li>
      <li><span v-if="num >= 60"></span></li>
      <li><span v-if="num >= 70"></span></li>
      <li><span v-if="num >= 80"></span></li>
      <li><span v-if="num >= 90"></span></li>
      <li><span v-if="num >= 100"></span></li>
    </ul>
  </div>
</template>

<script>
	export default {
		name: "connectorSignal",
		props: {
      num: {
				type: Number,
        default:10,
			}
		},
		data() {
			return {}
		},
		methods: {

		},
    mounted() {

    },
    computed: {
      title() {
        if(this.num<=0){
          return "连接已断开";
        }
        return "当前信号值"+String(this.num);
      }
		}
	}
</script>
<style lang="scss" scoped>
.box{
  cursor:pointer;
}
ul {
  display: flex;
  position: absolute;
  list-style-type: none;
  justify-content: space-around;
  overflow: hidden;
  li {
    width: 8%;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.5);
    position: relative;
    span {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 100%;
      background: limegreen;
    }
    &:nth-child(1) {
      height: 4px;
      margin-top: 18px;
    }
    &:nth-child(2) {
      height: 6px;
      margin-top: 16px;
    }
    &:nth-child(3) {
      height: 8px;
      margin-top: 14px;
    }
    &:nth-child(4) {
      height: 10px;
      margin-top: 12px;
    }
    &:nth-child(5) {
      height: 12px;
      margin-top: 10px;
    }
    &:nth-child(6) {
      height: 14px;
      margin-top: 8px;
    }
    &:nth-child(7) {
      height: 16px;
      margin-top: 6px;

    }
    &:nth-child(8) {
      height: 18px;
      margin-top: 4px;

    }
    &:nth-child(9) {
      height: 20px;
      margin-top: 2px;

    }
    &:nth-child(10) {
      height: 22px;
      margin-top: 0px;
    }
  }
}
</style>
