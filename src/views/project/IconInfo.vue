<template>
  <div>
    <div class="header">
      <el-input type="text" maxlength="10" v-model="form.name" size="mini" placeholder="未命名" disabled></el-input>
    </div>

    <div class="center">
      <div class="box" v-for="item in form.arr" :key="item.knowledgeId">
        <div class="name">{{ item.knowledgeName }}</div>
        <div>
          <el-button type="primary" size="mini" @click="knowledgeId = item.knowledgeId">查看</el-button>
        </div>
      </div>
    </div>
    <KnowDetail ref="know" :knowledgeId="knowledgeId" @close="knowledgeId = 0" />
  </div>
</template>

<script>
import KnowDetail from '../../components/KnowDetail.vue'

import {
  // 获取绑定的知识列表
  dataKnowledgeModelBindGetBindKnowledge
} from '../../utils/api'
export default {
  props: {
    iconId: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      form: {
        name: '',
        arr: []
      },
      knowledgeId: 0
    };
  },
  components: {
    KnowDetail,
  },
  created() { },
  mounted() { },

  watch: {
    iconId: {
      handler(newVal, oldVal) {
        console.log(newVal);
        if (newVal) {
          this.dataKnowledgeModelBindGetBindKnowledge()
        }
      },
      immediate: true
    },
  },
  methods: {
    // 查询绑定id的数据
    async dataKnowledgeModelBindGetBindKnowledge() {
      if (!this.iconId) return
      console.log(this.bindId);
      const res = await dataKnowledgeModelBindGetBindKnowledge({ bindId: this.iconId })
      console.log(res);
      if (res) this.form = res.data.data
      console.log(this.form.name);
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