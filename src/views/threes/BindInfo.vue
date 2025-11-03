<template>
  <div>
    <div class="header">
      <el-input type="text" maxlength="10" v-model="form.name" size="mini" placeholder="未命名"></el-input>
      <div class="icon" @click="$refs.drawer.drawerShow = true">+</div>
    </div>

    <div class="center">
      <div class="box" v-for="item in form.arr" :key="item.knowledgeId">
        <div class="name">{{ item.knowledgeName }}</div>
        <div>
          <el-button type="primary" size="mini" @click="knowledgeId = item.knowledgeId">查看</el-button>
          <el-button type="primary" size="mini"
            @click="form.arr = form.arr.filter(i => i.knowledgeId != item.knowledgeId)">解绑</el-button>
        </div>
      </div>
    </div>


    <BindKnow :form="form" ref="drawer" @bindFn="bindFn" @knowledgeIdFn="(id) => knowledgeId = id" />
    <KnowledgeInfo ref="know" :knowledgeId="knowledgeId" @close="knowledgeId = 0" />

  </div>
</template>

<script>
import KnowledgeInfo from '../../components/KnowledgeInfo.vue'
import BindKnow from '../threes/BindKnow.vue'


import {
  // 获取绑定的知识列表
  dataKnowledgeModelBindGetBindKnowledge,
  // 保存绑定的知识列表数组
  dataKnowledgeModelBindSaveKnowledge,
  // 保存绑定的知识列表名字
  dataKnowledgeModelBindUpdate
} from '../../utils/api'
export default {
  props: {
    bindId: {
      type: Number,
      default: 0
    },
    showIconInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        arr: []
      },
      drawerShow: false,
      knowledgeId: 0
    };
  },
  components: {
    KnowledgeInfo,
    BindKnow,
  },
  created() { },
  mounted() { },

  watch: {
    bindId: {
      handler(newVal, oldVal) {
        console.log(newVal);
        if (newVal) {
          this.dataKnowledgeModelBindGetBindKnowledge()
        }
      },
      immediate: true
    },
    showIconInfo: {
      handler(newVal, oldVal) {
        console.log(newVal);
        if (!newVal) this.save()
      },
    }
  },
  methods: {
    // 查询绑定id的数据
    async dataKnowledgeModelBindGetBindKnowledge() {
      if (!this.bindId) return
      console.log(this.bindId);
      const res = await dataKnowledgeModelBindGetBindKnowledge({ bindId: this.bindId })
      console.log(res);
      if (res) this.form = res.data.data
      console.log(this.form.name);
    },

    async save() {

      console.log('保存图标信息');
      const res1 = await dataKnowledgeModelBindSaveKnowledge({
        bindId: this.bindId,
        knowledgeIdList: this.form.arr.map(i => i.knowledgeId)
      })
      if (res1) {
        console.log(res1);
      }

      console.log(res1);
      // 保存绑定的知识列表名字
      const res2 = await dataKnowledgeModelBindUpdate({
        bindId: this.bindId,
        explain: this.form.name
      })

      console.log(res2);
    },

    bindFn(item) {
      if (this.form.arr.length == 5) return
      this.form.arr.push({
        knowledgeId: item.knowledgeId,
        knowledgeName: item.knowledgeName
      })
    },


  },
}
</script>

<style lang='less' scoped>
.header {
  height: 38px;
  display: flex;
  justify-content: space-between;
  padding: 5px;

  .el-input {
    width: 70%;

    :deep(.el-input__inner) {
      background-color: transparent;
      color: white;
    }
  }

  .icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: white;
    border: 1px solid white;
  }
}


.center {
  height: 200px;
  overflow: auto;
  padding: 0 5px;

  .box {
    height: 42px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      width: 50%;
      overflow: hidden;
      padding-left: 5px;
      color: white;
      font-size: 14px;
    }
  }
}
</style>