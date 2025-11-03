<template>
  <div>
    <Nav :nav="nav"></Nav>
    <div class="content">
      <el-tabs v-model="activeName" @tab-click="tabClick" size="mini">
        <!-- 知识分类 -->
        <el-tab-pane name="categories">
          <div slot="label" class="title1">
            <div style="width: 4px; height: 14px; background: #0143CE; margin-right: 8px;">
            </div>
            <span id="cate-span">知识分类管理</span>
          </div>

          <Tab v-if="activeName == 'categories'" class="kw-tab" title="知识分类管理" :tableData="tableData"
            :headerList="headerList" :request="request" @pageChange="pageChange" @limitChange="limitChange"
            :loading="loading" :showTitle="false" :leftSearch="true">
            <!-- 搜索 -->
            <template slot="select">
              <el-form inline>
                <el-form-item>
                  <el-input clearable type="primary" size="mini" @input="inputFn" v-model="request.data.classifyName"
                    placeholder="输入关键字查询"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
                </el-form-item>
              </el-form>
            </template>

            <template slot="addBtn">
              <el-form inline>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('新增')">新增</el-button>
                </el-form-item>
              </el-form>
            </template>

            <!-- 字段处理 -->
            <template slot="expand">
              <el-table-column label="序号" width="88px" align="left">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
            </template>

            <!-- 操作 -->
            <template slot="column">
              <el-table-column label="操作" width="220px" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="readFn(scope.row)">查看</el-button>
                  <el-button size="mini" type="primary" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </template>
          </Tab>
        </el-tab-pane>

        <!-- 知识标签 -->
        <el-tab-pane name="tags">
          <div slot="label" class="title2">
            <span id="tags-span">知识标签管理</span>
          </div>
          <Tab v-if="activeName == 'tags'" class="kw-tab" title="知识标签管理" :tableData="tableData" :headerList="headerList2"
            :request="request" @pageChange="pageChange" @limitChange="limitChange" :loading="loading" :showTitle="false"
            :leftSearch="true">
            <!-- 搜索 -->
            <template slot="select">
              <el-form inline>
                <el-form-item>
                  <el-input clearable type="primary" size="mini" @input="inputFn" v-model="request.data.tagName"
                    placeholder="输入关键字查询"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
                </el-form-item>
              </el-form>
            </template>

            <template slot="addBtn">
              <el-form inline>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('新增')">新增</el-button>
                </el-form-item>
              </el-form>
            </template>

            <!-- 字段处理 -->
            <template slot="expand">
              <el-table-column label="序号" width="88px" align="left">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
            </template>

            <!-- 操作 -->
            <template slot="column">
              <el-table-column label="操作" width="220px" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="readFn(scope.row)">查看</el-button>
                  <el-button size="mini" type="primary" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </template>
          </Tab>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增编辑删除模态框 -->
    <el-dialog :visible.sync="visible" :before-close="resetFn" width="25%" top="35vh" class="custom-dialog">
      <template slot="title">
        <div class="title_content">
          <div class="title_icon"></div>
          <div>
            {{ title }}
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </span>
      <!-- 删除 -->
      <div v-if="title === '删除'" class="delete">

        <div v-if="secondDeleteAck">
          <span v-if="activeName === 'tags'">是否确认删除该知识标签？</span>
          <span v-else>是否确认删除该知识分类？</span>
        </div>

        <div v-else>
          是否将该分类下所有数据转入其他知识分类？
          <div class="delete_form">
            <el-form ref="deleteForm" :model="deleteObj" :rules="deleteRules" label-width="88px" size="mini">
              <el-row>
                <el-col :span="14" :offset="4">
                  <el-form-item prop="id" hidden>
                    <el-input type="text" v-model="deleteObj.id">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="14" :offset="4">
                  <el-form-item prop="newId" :label="activeName === 'categories' ? '知识分类' : '知识标签'">
                    <el-select v-model="deleteObj.newId" filterable placeholder="请选择">
                      <el-option v-for="(item, index) in transferArr" :key="index" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>

      <!-- 新增编辑 -->
      <el-form v-else ref="form" :model="formData" :rules="rules" label-width="88px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="id" hidden>
              <el-input type="text" v-model="formData.id">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="name" :label="activeName === 'categories' ? '分类名称' : '标签名称'">
              <el-input type="text" maxlength="30" :placeholder="activeName === 'categories' ? '请输入分类名称' : '请输入标签名称'"
                v-model="formData.name">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="explain" :label="activeName === 'categories' ? '分类描述' : '标签描述'">
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 8 }"
                :placeholder="activeName === 'categories' ? '请输入分类描述，255字以内' : '请输入标签描述，255字以内'"
                v-model="formData.explain" show-word-limit :maxlength="255">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </el-dialog>

    <!-- 查看弹框 -->
    <el-drawer :visible.sync="drawer" :before-close="readBackFn" size="65%">
      <template slot="title">
        <div class="title_content">
          <div class="title_icon"></div>
          <div>
            <span>标题：{{ readData.name }}</span>
          </div>
        </div>
      </template>

      <div class="read_view">

        <div class="read_header">
          <div class="title">
            <span>标题：{{ readData.name }}</span>
          </div>
          <div class="meta_info">
            <div class="befoer"></div>
            <div class="center">
              <span>最新更新时间：{{ readData.updateTime }}</span>
              <span>更新人：{{ readData.updater?.staffName }}</span>
            </div>
            <div class="after"></div>
          </div>
        </div>
        <div class="read_content">
          <p v-html="readData.explain" />
        </div>
      </div>
      <div class="read_btn">
        <el-button size="mini" type="primary" @click="readBackFn">返 回</el-button>
      </div>

    </el-drawer>

  </div>
</template>

<script>
import { mixins } from "../../mixin";
import {
  // 分类
  dataKnowledgeClassifyPage as classifyReq,
  dataKnowledgeClassifyAdd,
  dataKnowledgeClassifyGetById,
  dataKnowledgeClassifyUpdate,
  dataKnowledgeClassifyGetNameList,
  dataKnowledgeClassifyDelete,

  // 标签
  dataknowledgeTagPage as tagReq,
  dataknowledgeTagAdd,
  dataknowledgeTagGetById,
  dataknowledgeTagUpdate,
  dataknowledgeTagDelete,
} from "../../utils/api";
export default {
  mixins: [mixins],
  data() {
    return {
      nav: [
        {
          name: "数据管理",
          path: "/data",
          isClick: false,
        },
        {
          name: "知识索引管理",
          path: "/knowledgeCategory",
          isClick: false,
        },
      ],
      headerList: {
        classifyName: "分类名称",
        classifyExplain: "分类介绍",
        'creator.staffName': '上传者',
        createTime: "创建时间",
      },

      headerList2: {
        tagName: "标签名称",
        tagExplain: "标签介绍",
        'creator.staffName': '上传者',
        createTime: "创建时间",
      },

      request: {
        data: {
          classifyId: null,
          classifyName: "",
          classifyExplain: ""
        },
        page: 1,
        limit: 5,
      },

      // 'categories' or 'tags' 
      activeName: 'categories',
      title: "",
      visible: false,
      // 分类和标签通用formData
      formData: {
        name: "",
        explain: ""
      },

      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        explain: [
          { required: true, message: "描述不能为空", trigger: "blur" },
        ],
      },
      deleteRules: {
        newId: [
          { required: true, message: "转移目标必选", trigger: "blur" },
        ],
      },

      // 查看弹框visible
      drawer: false,
      // 删除功能参数对象
      deleteObj: {
        id: null,
        newId: null,
      },
      transferArr: [],
      // 删除二次确认
      secondDeleteAck: false,
      readData: {
        name: "",
        explain: "",
        updateTime: "",
        updater: ""
      }
    };
  },
  created() { },
  methods: {

    dispatchRequestFn() {
      return this.activeName === 'categories' ? classifyReq : tagReq
    },

    async requestFn(reset) {
      if (reset) this.request.page = 1;
      let req = this.dispatchRequestFn()
      const res = await req(this.request);
      if (res) this.handleData(res.data);
    },

    async addOrUpdateOrDelete(title, row) {
      this.visible = true
      this.title = title

      if (title === '编辑') {
        this.formData.id = this.activeName === 'categories' ? row.classifyId : row.tagId
        this.formData.name = this.activeName === 'categories' ? row.classifyName : row.tagName
        this.formData.explain = this.activeName === 'categories' ? row.classifyExplain : row.tagExplain
      }
      else if (title === '删除') {
        if (this.activeName === 'categories') {
          // 将要删除的id
          this.deleteObj.id = row.classifyId
          // this.transferArr = []
          // return
          let { data } = await dataKnowledgeClassifyGetNameList({ classifyId: row.classifyId })
          if (data?.code == 200) {
            // 可选的转移id列表 transferArr
            this.transferArr = data.data.map(item => {
              // 转换为通用的
              item.id = item.classifyId
              item.name = item.classifyName
              return item
            })
            //默认选中第一项
            if (this.transferArr.length > 0) {
              this.deleteObj.newId = this.transferArr[0].id
            }
          }
        } else if (this.activeName === 'tags') {
          // 将要删除的id
          this.deleteObj.id = row.tagId
          //第二次确认标志
          this.secondDeleteAck = true
        }


      }
    },

    /**
     * 查看弹框
     * @param {*} row 
     */
    readFn(row) {
      // 构建数据
      console.log("dra:", row);
      this.readData.name = this.activeName === 'categories' ? row.classifyName : row.tagName
      this.readData.updateTime = this.activeName === 'categories' ? row.updateTime : row.updateTime
      this.readData.updater = this.activeName === 'categories' ? row.updater : row.updater
      this.readData.explain = this.activeName === 'categories' ? row.classifyExplain : row.tagExplain

      this.drawer = true
    },

    /**
     * 模态关闭
     */
    resetFn() {
      if (this.title === '删除') {
        // 二次确认页面返回一次确认页面
        if (this.secondDeleteAck && this.activeName === 'categories') {
          this.secondDeleteAck = false
          return
        } else if (this.secondDeleteAck && this.activeName === 'tags') {
          // tags页面没有两次确认 直接关闭弹框
          this.deleteObj = {
            id: null,
            newId: null,
          }
          this.visible = false
          // 解决关闭闪烁
          setTimeout(() => {
            this.secondDeleteAck = false
          }, 500);
        } else {
          // 一次确认页面取消
          this.deleteObj = {
            id: null,
            newId: null,
          }
          this.transferArr = []
          this.secondDeleteAck = false
          this.$refs.deleteForm?.resetFields()
        }
      } else {
        this.formData = {
          name: "",
          explain: ""
        }
        this.$refs.form.resetFields()
      }
      this.visible = false
    },

    readBackFn() {
      this.drawer = false
      this.readData = {
        name: "",
        explain: "",
        updateTime: "",
        updater: ""
      }
    },

    async submit() {

      console.log(this.formData);
      let data = null
      let submitRequest = null
      if (this.activeName === 'categories') {

        switch (this.title) {
          case '新增': {
            data = {
              classifyName: this.formData.name,
              classifyExplain: this.formData.explain
            }
            submitRequest = dataKnowledgeClassifyAdd
            break;
          }
          case '编辑': {
            data = {
              classifyId: this.formData.id,
              classifyName: this.formData.name,
              classifyExplain: this.formData.explain
            }
            submitRequest = dataKnowledgeClassifyUpdate
            break;
          }
          case '删除': {

            console.log("delete:", this.deleteObj);
            if (this.deleteObj.newId && !this.secondDeleteAck) {
              this.$refs.deleteForm.validate((valid) => {
                if (valid) {
                  //第二次确认标志
                  this.secondDeleteAck = true
                  return
                }
              })
            } else if (this.deleteObj.newId && this.secondDeleteAck) {
              data = {
                classifyId: this.deleteObj.id,
                newClassifyId: this.deleteObj.newId,
              }
              submitRequest = dataKnowledgeClassifyDelete
              // 删除
              await submitRequest(data)
              this.secondDeleteAck = false
              this.resetFn()
              this.requestFn()
            }

            return;
          }

          default: {
            console.log("submit failed");
          }

        }

      } else if (this.activeName === 'tags') {
        switch (this.title) {
          case '新增': {
            data = {
              tagName: this.formData.name,
              tagExplain: this.formData.explain
            }
            submitRequest = dataknowledgeTagAdd
            break;
          }
          case '编辑': {
            data = {
              tagId: this.formData.id,
              tagName: this.formData.name,
              tagExplain: this.formData.explain
            }
            submitRequest = dataknowledgeTagUpdate
            break;
          }
          case '删除': {
            console.log("delete2:", this.deleteObj);
            data = {
              tagId: this.deleteObj.id,
            }
            submitRequest = dataknowledgeTagDelete
            await submitRequest(data)
            this.resetFn()
            this.requestFn()
            return
          }

          default: {
            console.log("submit failed");
          }

        }
      }


      // 新增 编辑 
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await submitRequest(data)
          this.resetFn()
          this.requestFn()
        }
      })
    },

    /**
    * tab切换更改选中颜色
    * @param {*} tab 
    * @param {*} event 
    */
    tabClick(tab, event) {
      console.log("tab:", tab.name);
      this.requestFn()

      if (tab.name == 'categories') {
        document.getElementById('cate-span').style.color = '#333333'
        document.getElementById('tags-span').style.color = '#999999'
      } else if (tab.name == 'tags') {
        document.getElementById('cate-span').style.color = '#999999'
        document.getElementById('tags-span').style.color = '#333333'
      }
    },

  },
};
</script>


<style lang="less" scoped>
.content {
  background-color: #fff;
  height: calc(100% - 90px);
  padding: 0 17px;
  box-shadow: 0px 3px 6px rgba(48, 116, 237, 0.1);
  overflow: auto;

  :deep(.el-tabs__header) {
    padding: 0 17px;
    margin: 0 0 5px;
  }
}

.title1 {
  span {
    font-family: MiSans-Regular, MiSans;
    color: #333333;
    line-height: 18px;
    font-size: 14px;
  }

  text-align: center;
  display: flex;
  align-content: space-between;
}

.title2 {

  display: inline;
  text-align: center;

  span {
    font-family: MiSans-Regular, MiSans;
    color: #999999;
    font-size: 14px !important;
  }
}

:deep(.el-tabs__item) {
  height: auto;
  padding: 0 10px;
}

.kw-tab {
  :deep(.top-left) {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  :deep(.el-table) {
    margin-top: 10px
  }

  :deep(.cell-overflow) {
    white-space: nowrap;
    /* 防止文本换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 显示省略号 */
    max-width: none;
    /* 适当设置最大宽度 */
  }
}

// 弹框
.title_content {
  display: flex;
  border-bottom: 1px solid #ddd;
  // padding-bottom: 2px;
  // font-family: MiSans-Regular;

  .title_icon {
    width: 4px;
    height: auto;
    background: #0143CE;
    margin-right: 10px;
  }
}

.custom-dialog {
  :deep(.el-dialog) {
    min-width: 352px !important;
  }
}


.dialog-footer {
  display: flex;
  justify-content: center;
}

.read_view {
  width: 75%;
  height: 85Vh;
  margin: 0 auto;
  border: 1px solid #ddd;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: space-between;

  .read_header {
    height: 80px;
    width: 100%;
    text-align: center;
    // border: 1px solid blue;
    margin: 40px 0 30px 0;


    .title {
      margin-bottom: 24px;

      span {
        font-size: 24px;
        line-height: 24px;
        font-weight: 500;
        color: #333333;
      }
    }

    .meta_info {
      display: flex;

      .befoer,
      .after {
        flex: 1;
      }

      .center {
        flex: 2;
        display: flex;
        justify-content: space-between;

        span {
          font-size: 14px;
          font-family: MiSans-Regular, MiSans;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
        }
      }
    }
  }

  .read_content {
    // background-color: #fff;
    height: 100%;
    padding: 0 17px;
    // border: 1px solid red;
    // white-space: pre-wrap;
    // 使过长的文字换行
    word-break: break-all;
    overflow-y: auto;


    p {
      font-size: 14px;
      font-family: MiSans-Regular, MiSans;
      font-weight: 400;
      color: #666666;
      // line-height: 14px;
      line-height: 150%;

    }
  }
}

.read_btn {
  width: 100%;
  height: 5vh;
  // border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete {
  text-align: center;
  font-size: 16px;
  font-family: MiSans-Regular, MiSans;
  font-weight: 400;
  color: #333333;
  line-height: 16px;


  .delete_form {
    margin-top: 30px;
  }
}
</style>
