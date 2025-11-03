<template>
  <el-drawer :visible.sync="drawerShow" :before-close="() => drawerShow = false" size="74%">
    <template slot="title">
      <div class="title_content">
        <div class="title_icon"></div>
        <div>
          <span>标题：{{ form.name ? form.name : "未命名" }}</span>
        </div>
      </div>
    </template>

    <div class="bind-box">

      <div class="bind-left">
        <div class="bind-left-first">
          <div class="header">知识分类</div>
          <el-radio-group class="group" v-model="request.data.classifyId" size="mini" @input="requestFn">
            <el-radio-button v-for="item in knowledgeList" :label="item.classifyId" :key="item.classifyId">
              {{ item.classifyName }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <div class="header">知识标签</div>
          <el-checkbox-group class="group" v-model="request.data.tagIdList" size="mini" @input="requestFn">
            <el-checkbox-button v-for="item in tagList" :label="item.tagId" :key="item.tagId">
              {{ item.tagName }}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>

      <div class="bind-right">
        <el-form inline>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-input placeholder="请输入关键字搜索" size="mini" v-model="request.data.knowledgeName"
                  class="input-with-select">
                  <span slot="suffix" class="el-icon-search el-input__icon" @click="requestFn('reset')"></span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <Tab :showTitle="false" :tabShow="false" :request="request" @pageChange="pageChange" @limitChange="limitChange">
          <div class="container">
            <div class="info">
              <div class="box" v-for="item in  publishArr" :key="item.knowledgeId">
                <div class="content">

                  <div class="head">
                    <span>标题名称：
                      <span v-html="searchValueFn(item.knowledgeName)" />
                    </span>
                  </div>

                  <div class="center">

                    <div class="classify">知识分类：
                      <span v-html="searchValueFn(item.classifyName)" />
                    </div>
                    <div>知识标签：
                      <el-tag v-for="( tag, tagIndex  ) in item.tagIdList" :key="tagIndex" size="mini" effect="dark"
                        style="margin-right: 5px;">{{ tagMap.get(tag) }}</el-tag>
                    </div>
                    <div>最新更新时间：{{ item.updateTime ? item.updateTime : item.createTime }}</div>
                    <div>更新人：{{ item.creatorName }}</div>
                  </div>

                  <div class="desc">
                    <div class="bottom" v-html="searchValueFn(item.knowledgeExplain)" />
                    <div class="btn">
                      <el-row>
                        <el-button type="primary" size="mini"
                          @click="$emit('knowledgeIdFn', item.knowledgeId)">查看</el-button>

                        <el-button :class="isBind(item) ? 'ybd—bth' : ''" :disabled="isBind(item)"
                          :type="isBind(item) ? 'info' : 'primary'" size="mini" @click="$emit('bindFn', item)">{{
                            isBind(item) ? '已绑定' : '绑定' }}</el-button>
                      </el-row>
                    </div>
                  </div>

                </div>


              </div>

            </div>

          </div>
        </Tab>

      </div>
    </div>
  </el-drawer>
</template>

<script>
import {
  dataKnowledgePage as requestFn,// 分页查询
  dataKnowledgeClassifyGetNameList,//分类
  dataKnowledgeTagGetTagList,//标签
} from '../utils/api'
import Tab from './Tab.vue'
export default {
  props: {
    form: {
      type: Object,
      default: {
        name: '',
        arr: []
      }
    }
  },
  data() {
    return {
      drawerShow: false,
      request: {
        data: {
          classifyId: null, //分类id
          classifyList: [],
          tagIdList: [],//标签id
          knowledgeName: "",//知识名称
          knowledgeStatus: null, // 7 查询已发布知识 null为未发布
        },
        page: 1,
        limit: 5,
        total: 5
      },
      // 知识分类
      knowledgeList: [],
      // 知识标签
      tagList: [],

      tagMap: null,
      publishArr: [],
    };
  },
  components: {
    Tab
  },
  created() {
    this.dataKnowledgeTagGetTagList()//标签,
    this.dataKnowledgeClassifyGetNameList() //分类
  },
  mounted() { },

  watch: {
    drawerShow: {
      handler(newVal, oldVal) {
        if (newVal) this.requestFn()
      },
      immediate: true,
    },
  },

  methods: {
    // 获取表格数据
    async requestFn(reset) {
      if (reset) {
        this.request.page = 1
      }
      this.request.data.knowledgeStatus = -1
      const res = await requestFn(this.request)
      if (res) {
        this.publishArr = res.data.data.list
        this.request.limit = res.data.data.pageSize;
        this.request.page = res.data.data.pageNum;
        this.request.total = res.data.data.total;
      }
    },
    // 分类
    async dataKnowledgeClassifyGetNameList() {
      const res = await dataKnowledgeClassifyGetNameList({ classifyId: null })
      let allSelectObj = {
        classifyId: 0,
        classifyName: "未选择"
      }
      this.knowledgeList = []
      this.knowledgeList.push(allSelectObj)
      if (res) this.knowledgeList.push(...res.data.data)
    },
    // 标签
    async dataKnowledgeTagGetTagList() {
      const res = await dataKnowledgeTagGetTagList()
      if (res) {
        this.tagList = res.data.data
        this.tagMap = new Map(this.tagList.map(item => [item.tagId, item.tagName]))
        this.requestFn()
      }
    },

    limitChange(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    pageChange(page) {
      this.request.page = page;
      this.requestFn();
    },
    // 搜索标红
    searchValueFn(text) {
      if (!this.request.data.knowledgeName) return text
      return text.replace(
        new RegExp(this.request.data.knowledgeName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi'), (match) => `<span class="light">${match}</span>`)
    },
    isBind(item) {
      let temp = this.form.arr.find(i => i.knowledgeId == item.knowledgeId) ? true : false
      return temp
    },
  },
}
</script>

<style lang='less' scoped>
.bind-box {
  width: 100%;
  height: 85vh;
  display: flex;

  // border: 1px solid black;

  .bind-left {
    flex: 1;
    width: 100%;
    height: 85vh;
    background: #F6F6F6;

    display: flex;

    .header {
      width: 68px;
      height: 30px;

      background: #4466EE;
      border-radius: 2px 2px 2px 2px;

      text-align: center;
      font-size: 14px;
      font-family: MiSans-Regular;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;

    }

    >div {
      flex: 1;
      width: 100%;
      margin-left: 22px;
      margin-top: 16px;
      overflow-y: auto;

      .group {
        margin-top: 16px;
        display: flex;
        flex-direction: column;

        :deep(.el-radio-button__inner) {
          padding: 7px 0;
          background: none;
          border: none;
        }

        :deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner) {
          color: #fff;
          background-color: #46e;
          border-color: #46e;
          box-shadow: -1px 0 0 0 #46e;
        }

        :deep(.el-radio-button--mini .el-radio-button__inner) {
          font-size: 14px;
          font-family: MiSans-Regular;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
        }

        :deep(.el-checkbox-button__inner) {
          margin: 2px 0;
          padding: 7px 0;
          background: none;
          border: none;
        }

        :deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
          color: #fff;
          background-color: #46e;
          border-color: #46e;
          box-shadow: -1px 0 0 0 #46e;
        }

        :deep(.el-checkbox-button--mini .el-checkbox-button__inner) {
          font-size: 14px;
          font-family: MiSans-Regular;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
        }
      }

    }

    .bind-left-first {
      border-right: 1px solid #E9E9E9;
    }

    // border: 1px solid gold;

  }

  .bind-right {
    flex: 3;
    width: 100%;
    height: 85vh;
    // border: 1px solid aquamarine;


    :deep(.el-form-item) {
      width: 100%;
      display: flex;
      justify-content: center;

      .el-form-item__content {
        width: 80%;
      }
    }

    :deep(.Tab) {
      height: 100%;
    }

    .container {
      // padding: 0 16px;
      height: 83%;
      // background-color: forestgreen;

      .info {
        height: 100%;
        overflow: auto;


        .box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 120px;
          margin-bottom: 11px;
          background-color: #f6f6f6;
          cursor: pointer;

          .content {
            width: 100%;
            font-size: 12px;
            color: #666;
            padding: 12px;


            .head {
              font-size: 18px;
              font-family: MiSans-Regular;
              font-weight: 400;
              color: #333333;
              line-height: 18px;




              :deep(.light) {
                // background-color: red !important;
                color: red;
              }
            }

            .center {
              margin-top: 10px;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;

              // border: 1px solid black;

              >div {
                flex: 2;
                font-size: 14px;
                font-family: MiSans-Regular;
                font-weight: 400;
                color: #666666;
                line-height: 18px;
              }

              div:first-child {
                flex: 3;
              }

              div:nth-child(n+3) {
                // background-color: #387CD7;

                font-size: 12px;
                font-family: MiSans-Regular;
                font-weight: 400;
                color: #999999;
                line-height: 18px;
              }

              .classify {
                :deep(.light) {
                  // background-color: red !important;
                  color: red;
                }
              }

              div {
                margin-right: 20px;
              }
            }

            .desc {
              margin-top: 10px;
              height: 36px;
              display: flex;
              align-items: center;

              .bottom {
                flex: 7;
                height: 36px;
                overflow: auto;
                // border: 1px solid red;

                font-size: 14px;
                font-family: MiSans-Regular;
                font-weight: 400;
                color: #999999;
                line-height: 18px;



                :deep(.light) {
                  // background-color: red !important;
                  color: red;
                }
              }
            }

            .btn {
              flex: 2;
              height: 36px;
              display: flex;
              justify-content: flex-start;
              align-items: center;


              :deep(.el-button--mini) {

                width: 68px;

                font-size: 14px;
                font-family: MiSans-Regular;
                font-weight: 400;
                line-height: 14px;
              }

              // border: 1px solid red;

              .ybd—bth {
                color: #999999;
              }

              :deep(.el-button--info.is-disabled) {
                background: #DEDEDE;
              }


              .el-button {
                border-radius: 0;
              }
            }

          }

          .status {
            min-width: 100px;
            font-size: 12px;
            color: #EE4444;
          }



        }
      }
    }

  }
}

.bind_btn {
  width: 100%;
  height: 5vh;
  // border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>