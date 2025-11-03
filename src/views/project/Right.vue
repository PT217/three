<template>
  <div class="rightSide">
    <div :class="isActive ? 'btn active' : 'btn'" @click="isActive = !isActive">
      <div class="img">
        <img src="../../assets/project/zjt.png" alt="" />
      </div>
    </div>

    <div :class="isActive ? 'popup active' : 'popup'">
      <div class="top">
        <div :class="show ? 'show' : ''" @click="arr = cameraArr, show = true">
          <img src="../../assets/project/jklb.png" alt="" />
          <span>监控列表</span>
        </div>

        <div :class="show ? '' : 'show'" @click="arr = deviceArr, show = false">
          <img src="../../assets/project/sblb.png" alt="" />
          <span>设备列表</span>
        </div>
      </div>

      <div class="content">
        <div class="title">
          <div>{{ show ? "监控" : "设备" }}</div>
          <div>操作</div>
        </div>

        <div v-for="(item, index) of curArr" :key="index" :class="index % 2 ? 'row' : 'row blue'">
          <div>{{ item.name }}</div>
          <div>
            <el-button type="text"
              :disabled="monitorArr.find(i => i.name == item.name) || lightName == item.name ? true : false"
              @click="handFn(item)">查看</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    monitorArr: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isActive: false,
      show: true,
      map: null,
      cameraArr: [],
      deviceArr: [],
      arr: [],
      lightName: ''
    };
  },

  created() {
    let json = JSON.parse(
      localStorage.getItem("sceneData")
    ).json
    this.map = new Map(JSON.parse(json))
    this.init()
  },
  computed: {

    curArr() {
     return this.arr.filter(item => item.name.toLowerCase().includes(this.$store.state.name))
    }
  },

  methods: {
    init() {
      if (this.map.size) {
        this.map.forEach((value, key) => {
          value.map(item => {
            if (item.iconData) {
              if (item.iconData.type == 'sxb') {
                this.cameraArr.push({
                  name: item.name,
                  bindId: item.iconData.bindId
                })
              }
            } else {
              this.deviceArr.push({
                name: item.name
              })
            }
          })
        });
      }
      this.arr = this.show ? this.cameraArr : this.deviceArr
    },

    handFn(item) {
      if (this.show) {
        if (this.monitorArr.length == 4) return
        this.monitorArr.push(item)
        this.$emit("monitorArrFn", this.monitorArr);
        return
      }
      this.deviceFn(item)
    },
    deviceFn(item) {
      this.lightName = item.name
      this.$emit("lightName", this.lightName);
    },
  },
};
</script>

<style lang="less" scoped>
.rightSide {
  width: 20vw;
  padding: 5px;
  position: fixed;
  right: 0;
  top: 210px;
  background-size: 100% 100%;

  font-family: MiSans-Regular;
  z-index: 99999;

  .btn {
    position: absolute;
    right: -25px;
    top: calc(35vh - 125px);
    width: 50px;
    height: 50px;
    // background: rgba(3, 28, 62, 0.8);
    z-index: -1;
    transition: transform 0.3s ease;
    border-radius: 50px 0 0 50px;
    overflow: hidden;

    .img {
      width: 50%;
      // background-color: red;
      position: absolute;
      left: 0;
      height: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(3, 28, 62, 0.8);
    }

    img {
      position: absolute;
      right: -10px;
      width: 25px;
    }
  }

  .popup {
    position: absolute;
    right: -400px;
    top: 0;
    width: 400px;
    height: 45vh;
    background: rgba(3, 28, 62, 0.8);
    transition: right 0.3s ease;
    z-index: 3;

    .top {
      display: flex;
      justify-content: space-between;
      height: 40px;
      color: white;

      font-size: 18px;

      // padding: 0 20px;

      >div {
        width: 49%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        cursor: pointer;
      }

      .show {
        background-image: url("../../assets/project/jklbdj.png");
      }
    }

    &.active {
      right: 0px;
    }
  }

  .btn {
    &.active {
      transform: translateX(-400px);
    }
  }

  .content {
    color: white;
    max-height: 400px;
    overflow: auto;

    .title,
    .row {
      display: flex;
      height: 40px;
      opacity: 0.8;
      background-color: #354560;

      >div {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .blue {
      background-color: #0b1124;
    }

    .see {
      color: #00fffc;
      cursor: pointer;
    }

    .gray {
      pointer-events: none;
      opacity: 0.3;
    }
  }
}
</style>
