<template>
  <div>
    <Nav :nav="nav"></Nav>

    <div class="content">
      <div class="title">

        <div class="left">
          <img src="../../assets/common/lb.png" />
          {{ title }}
        </div>

        <div class="right">
          <el-input placeholder="请输入名称" size="mini" v-model="$store.state.name" style="margin-right: 5px;" clearable
            @input="e => $store.commit('setName', e)">
          </el-input>
          <el-button class="btn" type="primary" size="mini"
            @click="$router.push({ path: '/ndpProManage' })">返回</el-button>
        </div>

      </div>
    </div>

    <MoniterThree :lightName="lightName" />

    <Center :monitorArr="monitorArr" @monitorArrFn="arr => monitorArr = arr" />

    <Right :monitorArr="monitorArr" @monitorArrFn="arr => monitorArr = arr" @lightName="e => lightName = e" />
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import MoniterThree from './MoniterThree.vue'
import Center from "./Center.vue"
import Right from "./Right.vue"
import Warn from "./Warn.vue"


export default {
  components: {
    Nav,
    MoniterThree,
    Center,
    Right,
    Warn,
  },
  data() {
    return {
      title: '轻量级可视化场景',
      nav: [
        {
          name: "项目管理",
          path: "/project",
          isClick: false,
        },
        {
          name: "核退役设施",
          path: "/ndpProManage",
          isClick: false,
        },
        {
          name: "轻量级可视化场景",
          path: "/camera",
          isClick: false,
        },
      ],
      lightName: null,
      monitorArr: [],
    };
  },
};
</script>

<style lang='less' scoped>
.content {
  background-color: #fff;
  box-shadow: 0px 3px 6px rgba(48, 116, 237, 0.1);

  .title {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    padding: 0 20px;

    .left {
      display: flex;
      align-items: center;

      img {
        width: 22px;
        height: 22px;
        margin-right: 17px;
      }
    }

    .right {
      display: flex;
      justify-content: space-between;
    }


  }
}
</style>