<template>
  <div>
    <Nav :nav="nav">
      <template slot="right">
        <el-button type="primary" size="mini" style="margin-right: 10px;"
          @click="accountTempletaDownLoad">下载模版</el-button>

        <el-upload ref="upload" action="#" :limit="1" :auto-upload="false" :on-change="handleChange"
          :show-file-list="false"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
          <el-button type="primary" size="mini">人员同步</el-button>
        </el-upload>
      </template>
    </Nav>

    <Tab title="项目人员管理" :tabShow="false" :pageShow="false">
      <div class="boxList">
        <div class="contentBox" v-for="(item, i) in pathList" :key="item.path">
          <div class="box">
            <div class="left">
              <div class="first">{{ item.h4 }}</div>
              <div class="two">{{ item.p }}</div>
              <div class="three">
                <el-button @click="$router.push({ path: item.path })">点击进入</el-button>
              </div>
            </div>
            <div>
              <img :src="require(`../../assets/common/${i + 1}.png`)" />
            </div>
          </div>
        </div>
      </div>
    </Tab>
  </div>
</template>
<script>
import {
  accountSyncUser as requestFn,
  accountTempletaDownLoad
} from '../../utils/api'
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
export default {
  components: {
    Tab,
    Nav,
  },
  data() {
    return {
      nav: [
        {
          name: "数据管理",
          path: "/data",
          isClick: false,
        },
        {
          name: "项目人员管理",
          path: "/projectPersonnel",
          isClick: false,
        },
      ],
      pathList: [
        {
          h4: "用户管理",
          p: "所有用户管理列表",
          path: "/user",
        },
        {
          h4: "角色管理",
          p: "所有角色管理列表",
          path: "/roles",
        },
        {
          h4: "路径管理",
          p: "所有路径管理列表",
          path: "/path",
        },
        {
          h4: "部门管理",
          p: "所有部门管理列表",
          path: "/department",
        },
      ],
    };
  },
  methods: {
    async handleChange(file) {
      if (!file) return;
      let formData = new FormData();
      formData.append("file", file.raw
      );
      const res = await requestFn(formData)


      this.$refs.upload.clearFiles()
    },

    // xls格式下载
    async accountTempletaDownLoad() {
      const res = await accountTempletaDownLoad({}, { responseType: "blob" })
      const blob = new Blob([res.data], {
        type: "application/vnd.ms-excel",
      });
      const elink = document.createElement("a");
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.download = '模版';
      elink.style.display = "none";
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    }

  }
};
</script>

<style lang='less' scoped>
.boxList {
  display: flex;
  flex-wrap: wrap;

  .contentBox {
    width: 23%;
    margin-left: 20px;
    margin-top: 30px;
    height: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .box {
      width: 80%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #dddddd;
      padding: 10px;
      box-sizing: border-box;
      position: relative;

      .left {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 90%;

        .first {
          height: 10%;
          color: #333333;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .two {
          color: #777777;
          font-size: 14px;
          margin-bottom: 10px;
          height: 40%;
          overflow: auto;
        }

        .three {
          height: 20%;
        }
      }
    }
  }
}
</style>