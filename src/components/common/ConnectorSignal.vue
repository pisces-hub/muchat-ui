<template>
  <div class="box">
    <el-popover
        placement="bottom"
        title="连接信息"
        width="150"
        trigger="manual"
        v-model="visible">
      <p v-if="ip!=null">ip: <span v-text="ip"></span></p>
      <p v-if="port!=null">port: <span v-text="port"></span></p>
      <p v-if="heartCount!=null">心跳次数: <span v-text="heartCount"></span></p>
      <p v-if="connectorDate!=null">最近连接时间:<br/> <span v-text="connectorDate"></span></p>
      <div v-if="state===1">
        <p style="color: green;">连接正常</p>
      </div>
      <div v-if="state===0">
        <hr/>
        <p v-if="closeTimeDate!=null">最近断开连接时间:<br/> <span v-text="closeTimeDate"></span></p>
        <p v-if="reConnectCount!=null">重连次数: <span v-text="reConnectCount"></span></p>
        <p style="color: red;" v-if="errorMsg!=null">连接已断开<br/> <span v-text="errorMsg"></span></p>
      </div>


      <ul @click.stop="clickSignal" slot="reference" style="width: 60px;  height: 22px;" :title="title">
        <li><span v-if="node.signal >= 10"></span></li>
        <li><span v-if="node.signal >= 20"></span></li>
        <li><span v-if="node.signal >= 30"></span></li>
        <li><span v-if="node.signal >= 40"></span></li>
        <li><span v-if="node.signal >= 50"></span></li>
        <li><span v-if="node.signal >= 60"></span></li>
        <li><span v-if="node.signal >= 70"></span></li>
        <li><span v-if="node.signal >= 80"></span></li>
        <li><span v-if="node.signal >= 90"></span></li>
        <li><span v-if="node.signal >= 100"></span></li>
      </ul>
    </el-popover>
  </div>
</template>

<script>
	export default {
		name: "connectorSignal",
		props: {
      node: {
				type: Object,
			}
		},
		data() {
			return {
        visible:false,
        ip:null,
        port:null,
        heartCount:0,
        state:0,
        connectorDate:null,
        closeTimeDate:null,
        errorMsg:null,
        reConnectCount:0,
      }
		},
		methods: {
      timestampToDate(Timestamp) {
        if(Timestamp==null || Timestamp==undefined){
          return null;
        }
        let now = new Date(Timestamp),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
      },
      clickSignal(){
        let url = this.node.url;
        if(url!=null){
          url = url.replace("ws://","").replace("wss://");
          let arrays = url.split(":");
          this.ip = arrays[0];
          this.port = arrays[1].substring(0,arrays[1].indexOf("/"));
        }
        this.heartCount = this.node.heartCount;
        this.state = this.node.state;
        this.connectorDate = this.timestampToDate(this.node.connectorTime);
        this.closeTimeDate = this.timestampToDate(this.node.closeTime);
        this.errorMsg = this.node.errorMsg;
        this.reConnectCount = this.node.reConnectCount;
        this.visible = true ;
      },
      closeSignal(){
        this.visible = false;
      }
		},
    mounted() {
      document.addEventListener("click", this.closeSignal);
    },
    destroyed() {
      document.removeEventListener("click", this.closeSignal);
    },
    computed: {
      title() {
        if(this.node.signal<=0){
          return "连接已断开";
        }
        return "当前信号值"+String(this.node.signal);
      },

		}
	}
</script>
<style lang="scss" scoped>
.box{
  cursor:pointer;
  margin-right: 20px;
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
