<template>
  <div class="knowledge">
    <Nav :nav="nav"></Nav>

    <Tab title="知识信息管理" :tabShow="false" :request="request" @pageChange="pageChange" @limitChange="limitChange">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-select @change="e => e ? '' : requestFn('reset')" clearable size="mini" v-model="request.data.classifyId"
              placeholder="请选择分类">
              <el-option v-for="item in knowledgeList" :key="item.classifyId" :label="item.classifyName"
                :value="item.classifyId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select @change="e => e.length ? '' : requestFn('reset')" clearable size="mini"
              v-model="request.data.tagIdList" multiple placeholder="请选择标签">
              <el-option v-for="item in tagList" :key="item.tagId" :label="item.tagName" :value="item.tagId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-input v-model="request.data.knowledgeName" clearable size="mini" placeholder="输入关键字查询"
              @input="e => e ? '' : requestFn('reset')"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button v-show="activeName == 'home'" type="primary" size="mini"
              @click="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <div class="container">

        <template>
          <el-tabs v-model="activeName" @tab-click="requestFn">
            <el-tab-pane label="公开模式" name="home">
              <div class="info">

                <div class="box" v-for="item in  publishArr">

                  <div class="content">

                    <div class="head">
                      标题名称：
                      <span v-html="searchValueFn(item.knowledgeName)" />
                    </div>

                    <div class="center">

                      <div>知识分类：{{ item.classifyName }}</div>
                      <div>知识标签：
                        <span v-if="item.tagIdList?.length">
                          <el-tag v-for="(tag, tagIndex) in item.tagIdList " :key="tagIndex" size="mini" effect="dark"
                            style="margin-right: 5px;">{{ tagMap.get(tag) }}</el-tag>
                        </span>
                        <el-tag v-else size="mini">无</el-tag>
                      </div>
                      <div>最新更新时间：{{ item.updateTime ? item.updateTime : item.createTime }}</div>
                      <div>更新人：{{ item.creatorName }}</div>
                    </div>

                    <div class="bottom" v-html="searchValueFn(item.knowledgeExplain)" />

                  </div>

                  <div class="btn">
                    <el-button type="primary" size="mini" @click="approveFn('查看', item)">查看</el-button>
                    <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('修改', item)">修改</el-button>
                    <el-button type="primary" size="mini" @click="downloadFn(item)">下载</el-button>
                    <el-button type="danger" size="mini" @click="addOrUpdateOrDelete('删除', item)">删除</el-button>
                  </div>

                </div>

              </div>

            </el-tab-pane>

            <el-tab-pane label="审批模式" name="knowledge">
              <div class="info">

                <div class="box" v-for="item in publishArr">

                  <div class="content">

                    <div class="head">
                      标题名称：
                      <span v-html="searchValueFn(item.knowledgeName)" />
                    </div>

                    <div class="center">

                      <div>知识分类：{{ item.classifyName }}</div>
                      <div>知识标签：
                        <span v-if="item.tagIdList?.length">
                          <el-tag v-for="(tag, tagIndex) in item.tagIdList " :key="tagIndex" size="mini"
                            style="margin-right: 5px;">{{ tagMap.get(tag) }}</el-tag>
                        </span>
                        <el-tag v-else size="mini">无</el-tag>
                      </div>

                      <div>最新更新时间：{{ item.updateTime ? item.updateTime : item.createTime }}</div>
                      <div>更新人：{{ item.creatorName }}</div>
                    </div>

                    <div class="bottom" v-html="searchValueFn(item.knowledgeExplain)" />

                  </div>

                  <div class="status">状态：{{ statusList[item.knowledgeStatus] }}</div>

                  <div class="btn">
                    <el-button v-if="!(item.knowledgeStatus == 3 || item.knowledgeStatus == 4)" type="primary" size="mini"
                      @click="approveFn('查看', item)">查看</el-button>
                    <el-button v-if="item.knowledgeStatus == 0" type="primary" size="mini"
                      @click="addOrUpdateOrDelete('新增', item)">修改</el-button>
                    <el-button v-if="item.knowledgeStatus == 1" type="primary" size="mini"
                      @click="addOrUpdateOrDelete('修改', item)">修改</el-button>
                    <el-button v-if="item.knowledgeStatus == 2" type="primary" size="mini"
                      @click="addOrUpdateOrDelete('删除', item)">修改</el-button>
                    <el-button v-if="item.knowledgeStatus == 3" type="primary" size="mini"
                      @click="approveFn('审核', item)">审核</el-button>
                    <el-button v-if="item.knowledgeStatus == 4" type="primary" size="mini"
                      @click="approveFn('审批', item)">审批</el-button>
                    <el-button v-if="item.knowledgeStatus == 5" type="primary" size="mini"
                      @click="addOrUpdateOrDelete('新增', item)">修改</el-button>
                    <el-button v-if="item.knowledgeStatus == 6" type="primary" size="mini"
                      @click="addOrUpdateOrDelete('修改', item)">修改</el-button>
                    <el-button v-if="item.knowledgeStatus == 7" type="primary" size="mini"
                      @click="addOrUpdateOrDelete('删除', item)">修改</el-button>

                    <el-button v-if="!(item.knowledgeStatus == 3 || item.knowledgeStatus == 4)" type="danger" size="mini"
                      @click="addOrUpdateOrDelete('移除', item)">移除</el-button>
                  </div>

                </div>

              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>

    </Tab>

    <!-- 一级弹框 -->
    <el-dialog :visible.sync="visible1" :title="title1" :before-close="show1" :close-on-click-modal="false">
      <div v-if="title1 == '移除'">你确定要移除吗?</div>

      <div v-else>
        <el-form class="new" ref="form1" :model="form" :rules="rules1" label-width="117px"
          :disabled="disabledTag || approveTag">
          <el-row>
            <el-col :span="12">
              <el-form-item label="知识分类:" prop="classifyId">
                <el-select clearable v-model="form.classifyId" placeholder="请选择分类" default-first-option>
                  <el-option v-for=" item in knowledgeList  " :key="item.classifyId" :label="item.classifyName"
                    :value="item.classifyId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="知识标签:" prop="tagIdList">
                <el-select clearable v-model="form.tagIdList" multiple placeholder="请选择标签">
                  <el-option v-for="item in tagList  " :key="item.tagId" :label="item.tagName" :value="item.tagId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="知识名称:" prop="knowledgeName">
                <el-input v-model="form.knowledgeName" placeholder="请输入知识名称" maxlength="10" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="知识简介:" prop="knowledgeExplain">
                <el-input v-model="form.knowledgeExplain" type="textarea" maxlength="50" show-word-limit>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="知识内容:" prop="knowledgeContent">
                <Edit eId="knowledgeContent" ref="knowledgeContent" :text="form.knowledgeContent" @Edit="editor"
                  :disabled="disabledTag || approveTag" :onlyRead="disabledTag || approveTag"></Edit>
              </el-form-item>
            </el-col>
          </el-row>

          <el-upload style="padding-left: 117px;" action="#" ref="upload" :auto-upload="false"
            :file-list="form.fileVOList" :on-preview="clickFn" :on-change="changeFn" :before-upload="beforeUpload"
            :before-remove="beforeRemove" :on-remove="removeFn">
            <div slot="tip" class="el-upload__tip">
              上传附件相关
              <el-button :loading="status" size="mini" type="text" @click.prevent="$refs.btn.click()">
                <span class="el-icon-upload2"></span>上传
              </el-button>
              (支持文件:word文档(.docx)、excel文档(.xlsx)、pdf文档(.pdf)、视频(.mp4)、图片(.jpg)、语音(.mp3)上传文件不超过300M)
            </div>
            <div slot="trigger" ref="btn" v-show="false"></div>
          </el-upload>

        </el-form>
      </div>

      <div class="btnBox" v-if="title1 == '移除'">
        <el-button size="small" @click="show1">取消</el-button>
        <el-button size="small" type="primary" @click="remove">确认</el-button>
      </div>

      <div class="btnBox" v-else-if="(title1 != '查看') || operateTag">
        <el-button size="small" @click="show1">取消</el-button>
        <el-button size="small" v-if="form.demand != 2" type="primary" @click="save" :disabled="status">保存</el-button>
        <el-button size="small" type="primary" @click="submit1" :disabled="status">提交</el-button>
      </div>

    </el-dialog>

    <!-- 二级弹框 -->
    <el-dialog :visible.sync="visible2" :before-close="show2" :close-on-click-modal="false">
      <el-form ref="form2" :model="form" :rules="rules1" label-width="117px">

        <el-row v-if="title1.includes('修改') || title1.includes('删除')">

          <el-col :span="24">
            <el-form-item :label="`${title1}原因:`" prop="modifyReason">
              <el-input v-model="form.modifyReason" maxlength="20" show-word-limit placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item :label="`${title1}影响:`" prop="modifyEffect">
              <el-input type="textarea" maxlength="50" show-word-limit v-model="form.modifyEffect">
              </el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="审核人员:" prop="examineFirst">
              <el-select v-model="form.examineFirst" placeholder="请选择" default-first-option clearable>
                <el-option v-for=" item  in  examineFir " :key="item.staffId" :label="item.staffName"
                  :value="item.staffId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="审批人员:" prop="examineSecond">
              <el-select v-model="form.examineSecond" placeholder="请选择" default-first-option clearable>
                <el-option v-for=" item  in   examineSec " :key="item.staffId + 1" :label="item.staffName"
                  :value="item.staffId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>


      <div class="btnBox">
        <el-button size="small" @click="show2">取消</el-button>
        <el-button size="small" type="primary" @click="submit2">提交</el-button>
      </div>
    </el-dialog>

    <!-- 数据查看及审核审批 -->
    <el-drawer :title="title1" :size="widthTag" :visible.sync="drawer1" direction="rtl" :before-close="close => close()">

      <div class="approve">
        <div class="view" v-show="approveTag && form.demand == 1">
          <div class="content">
            <div class="top old">标题：{{ formTemp.knowledgeName }}
              <el-tag effect="dark" size="mini" style="margin-left: 5px;">{{ form.classifyName }}</el-tag>
            </div>

            <div class="center old">
              <div>最新更新时间：{{ formTemp.updateTime ? formTemp.updateTime : formTemp.createTime }}</div>
              <div>更新人：{{ formTemp.creatorName }}</div>
              <div>审核人：{{ formTemp.examineFirstName }}</div>
              <div>审批人：{{ formTemp.examineSecondName }}</div>
            </div>
            <!-- 标签 -->
            <div class="label old">
              <div class="tag">标签：</div>
              <span class="tag" v-if="formTemp.tagIdList.length" v-for="item in formTemp.tagIdList" :key="item">{{
                tagMap.get(item)
              }}</span>
            </div>
            <!-- 简介 -->
            <div class="introduce old">
              <div class="tag">简介：</div>
              <div class="info">{{ formTemp.knowledgeExplain }}</div>
            </div>
            <!-- 富文本 -->
            <div class="text old">
              <div class="tag">内容：</div>
              <div class="info" v-html="formTemp.knowledgeContent"></div>
            </div>
          </div>

          <div class="bottom">
            <div class="tag">附件：</div>
            <div class="file" v-if="formTemp.fileVOList?.length">
              <div v-for="item in formTemp.fileVOList" :key="item.url" @click="clickFn(item)">
                <div class="img" style="margin-right: 5px;">
                  <img :src="require(`../../assets/technology/${srcTag(item)}.png`)">
                </div>
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
            <div v-else>无</div>
          </div>
        </div>

        <div class="view">

          <div class="content">

            <div class="top">标题：{{ form.knowledgeName }}
              <el-tag effect="dark" size="mini" style="margin-left: 5px;">{{ form.classifyName }}</el-tag>
            </div>

            <div class="center">
              <div>最新更新时间：{{ form.updateTime ? form.updateTime : form.createTime }}</div>
              <div>更新人：{{ form.creatorName }}</div>
              <div v-show="activeName == 'home'">审核人：{{ form.examineFirstName }}</div>
              <div v-show="activeName == 'home'">审批人：{{ form.examineSecondName }}</div>
            </div>
            <!-- 标签 -->
            <div class=" label">
              <div class="tag">标签：</div>
              <span v-if="form.tagIdList.length" v-for="item in form.tagIdList" :key="item">{{ tagMap.get(item)
              }}</span>
            </div>
            <!-- 简介 -->
            <div class="introduce">
              <div class="tag">简介：</div>
              <div class="info">{{ form.knowledgeExplain }}</div>
            </div>
            <!-- 富文本 -->
            <div class="text">
              <div class="tag">内容：</div>
              <div class="info" v-html="form.knowledgeContent"></div>
            </div>
          </div>

          <div class="bottom">
            <div class="tag">附件：</div>
            <div class="file" v-if="form.fileVOList?.length">
              <div v-for="item in form.fileVOList " :key="item.url" @click="clickFn(item)">
                <div class="img" style="margin-right: 5px;">
                  <img :src="require(`../../assets/technology/${srcTag(item)}.png`)">
                </div>
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
            <div v-else>无</div>
          </div>
        </div>

        <div class="approveInfo" v-show="approveTag || rejectTag">
          <!-- 1 -->
          <div>
            <div style="margin-bottom: 12px;">提交人员:{{ form.creatorName }} </div>
            <div>更新时间:{{ form.updateTime ? form.updateTime : form.createTime }}</div>
          </div>

          <!-- 2 -->
          <div class="two" v-show="form.demand == 1 || form.demand == 2">
            <div class="box">
              <div class="name">{{ form.demand == 1 ? '修改' : '删除' }}原因：</div>
              <div class="value">{{ form.modifyReason }}</div>
            </div>

            <div class="box">
              <div class="name">{{ form.demand == 1 ? '修改' : '删除' }}影响：</div>
              <div class="value">{{ form.modifyEffect }}</div>
            </div>
          </div>


          <!-- 3 -->
          <div class="three">
            <div class="top">
              <div style="margin-bottom: 12px;">审核人员: {{ form.examineFirstName }} </div>
              <div>审核时间:2022-04-11 14:12</div>
            </div>

            <div class="bottom">
              <div class="name">驳回原因:</div>
              <el-input type="textarea" maxlength="50" show-word-limit v-model="form.rejectFirst" />
            </div>
          </div>

          <!-- 4 -->
          <div class="four">
            <div class="top">
              <div style="margin-bottom: 12px;">审批人员: {{ form.examineSecondName }} </div>
              <div>审批时间:2022-04-11 14:12</div>
            </div>

            <div class="bottom">
              <div class="name">驳回原因:</div>
              <el-input type="textarea" maxlength="50" show-word-limit v-model="form.rejectSecond" />
            </div>
          </div>
        </div>
      </div>


      <div class="btnBox" v-if="approveTag">
        <el-button size="small" @click="reject" style="background-color: #ee4444; color: #EFEFEF;">驳回</el-button>
        <el-button size="small" type="primary" @click="pass">通过</el-button>
      </div>

      <div class="btnBox" v-else>
        <el-button size="small" v-show="activeName == 'home'" @click="downloadFn(form)" type="primary">下载</el-button>
        <el-button size="small" @click="drawer1 = false">返回</el-button>
      </div>

    </el-drawer>

    <!-- 附件查看 -->
    <el-drawer :title="`附件查看:${fileName}`" size="30%" :visible.sync="drawer2" direction="rtl"
      :before-close="close => drawerFn(close)">

      <div class="annex">

        <vue-office-pdf v-if="type == 'pdf'" :src="src" style="width: 100%; height:100%" />

        <vue-office-excel v-if="type == 'xlsx'" :src="src" style="width: 100%; height:100%" />

        <vue-office-docx v-if="type == 'docx'" :src="src" style="width: 100%; height:100%" />

        <img v-if="type == 'img'" :src="src" style="width: 100%; height:100%" />

        <video v-show="type == 'video'" :src="src" ref="video" style="width: 100%; height:100%" controls muted />

        <audio v-show="type == 'audio'" :src="src" ref="audio" style="width: 100%; height:100%" controls />

      </div>
    </el-drawer>

  </div>
</template>

<script>

import Nav from '../../components/Nav.vue'
import Tab from '../../components/Tab.vue'
import Edit from '../../components/Edit.vue'

//引入VueOfficePdf组件
import VueOfficePdf from '@vue-office/pdf'
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/excel/lib/index.css'
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'

import {
  dataKnowledgePage as requestFn,// 分页查询
  dataKnowledgeGet,// 查看内容
  dataKnowledgeSave,// 保存（用于新增、修改、删除需求）
  dataKnowledgeSubmit,// 保存并提交
  dataKnowledgePass,// 通过
  dataKnowledgeReject,// 驳回
  dataKnowledgeCancel,// 移除
  dataKnowledgeGetExamineSet,// 查询审核和审批人列表
  dataKnowledgeGetUploadFile,// 上传文件
  dataKnowledgeDownload,// 下载 test

  dataKnowledgeClassifyGetNameList,//分类
  dataKnowledgeTagGetTagList,//标签
} from '../../utils/api'

export default {
  components: {
    Nav,
    Tab,
    Edit,
    VueOfficePdf,
    VueOfficeExcel,
    VueOfficeDocx,
  },
  data() {
    return {
      nav: [
        {
          name: "技术管理",
          path: "/technology",
          isClick: false,
        },
        {
          name: "知识信息管理",
          path: "/knowledge",
          isClick: false,
        },
      ],
      activeName: 'home',

      request: {

        data: {
          classifyId: null, //分类id
          tagIdList: [],//标签id
          knowledgeName: "",//知识名称
          knowledgeStatus: null, // 7 查询已发布知识 null为未发布
        },
        page: 1,
        limit: 5,
        total: 5
      },

      publishArr: [], // 已发布数组
      unPublishArr: [],//未发布数组

      examineFir: [],// 审核人员
      examineSec: [],// 审批人员
      // 知识分类
      knowledgeList: [],
      // 知识标签
      tagList: [],
      tagMap: null,

      // 一级弹框状态
      title1: '审核',
      visible1: false,
      form: {
      },
      formTemp: {

      },
      rules1: {
        "classifyId": [
          { required: true, message: "知识分类不能为空", trigger: "blur" },
        ],
        "knowledgeName": [
          { required: true, message: "知识名称不能为空", trigger: "blur" },
        ],
        "knowledgeExplain": [
          { required: true, message: "知识简介不能为空", trigger: "blur" },
        ],
        "modifyReason": [
          { required: true, message: '原因不能为空', trigger: "blur" },
        ],
        "modifyEffect": [
          { required: true, message: '影响不能为空', trigger: "blur" },
        ],
        examineFirst: [
          { required: true, message: "审核人员不能为空", trigger: "blur" },
        ],
        examineSecond: [
          { required: true, message: "审批人员不能为空", trigger: "blur" },
        ],
      },

      status: false,
      statusList: ['草稿', '修改中', '待删除', '待审核', '待审批', '新增驳回', '修改驳回', '删除驳回'],

      visible2: false,
      // drawer1
      drawer1: false,

      // 附件查看
      drawer2: false,
      type: "",
      src: "",
      fileName: ""
    };
  },
  created() {
    this.dataKnowledgeTagGetTagList() //标签
    this.dataKnowledgeClassifyGetNameList() //分类
    this.dataKnowledgeGetExamineSet()
  },

  computed: {

    disabledTag() {
      // 禁用
      return this.title1.includes('查看') || this.title1.includes('删除')
    },
    // 是否为审批
    approveTag() {
      return this.title1.includes('审核') || this.title1.includes('审批')
    },

    // 是否为增删改
    operateTag() {
      return this.title1.includes('新增') || this.title1.includes('修改') || this.title1.includes('删除')
    },

    // 是否为驳回
    rejectTag() {
      return this.form.knowledgeStatus == 5
        || this.form.knowledgeStatus == 6
        || this.form.knowledgeStatus == 7
    },

    // 宽度
    widthTag() {
      if (this.rejectTag) return '50%'
      if (this.approveTag) return this.form.demand == 1 ? '80%' : '50%'
      return '30%'
    },


    // wangText
    wangText() {
      return this.form.knowledgeContent.replace(new RegExp("<table border=\"0\"", "g"), "<table border=\"1\"")
    },
    newWangText() {
      return this.form.knowledgeContent.replace(new RegExp("<table border=\"0\"", "g"), "<table border=\"1\"")
    },
    oldWangText() {
      return this.form.knowledgeContent.replace(new RegExp("<table border=\"0\"", "g"), "<table border=\"1\"")
    }

  },
  methods: {
    // 获取表格数据
    async requestFn(reset) {
      if (reset) this.request.page = 1
      this.request.data.knowledgeStatus = this.activeName == 'home' ? -1 : null
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
      if (res) this.knowledgeList = res.data.data
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

    // 查询审核和审批人列表
    async dataKnowledgeGetExamineSet() {
      const res = await dataKnowledgeGetExamineSet()
      if (res) {
        this.examineFir = res.data.data.examineFir
        this.examineSec = res.data.data.examineSec
      }
    },
    // 弹框事件
    show1() {
      if (this.visible1) {
        if (this.operateTag) {
          this.$refs["form1"].resetFields();
        }
        this.form.fileVOList = []
        this.requestFn()
      }
      this.visible1 = !this.visible1
    },
    show2() {
      if (this.visible2) {
        this.$refs["form2"].resetFields();
      }
      this.visible2 = !this.visible2
    },


    async approveFn(title, row) {
      this.title1 = title
      this.drawer1 = true
      console.log(this.title1);
      console.log(row.demand);
      if (this.title1 == '查看') {
        this.form = row
        return
      }
      if (row.demand == 1) {
        const oldForm = await dataKnowledgeGet({
          knowledgeId: row.knowledgeId,
          knowledgeStatus: -1
        })
        if (oldForm) this.formTemp = oldForm.data.data
      }
      const newForm = await dataKnowledgeGet({
        knowledgeTempId: row.knowledgeTempId
      })
      if (newForm) this.form = newForm.data.data


      console.log(this.form);
    },

    async addOrUpdateOrDelete(title, row) {
      this.title1 = title
      this.show1()
      this.form = {
        // knowledgeId: null,
        // knowledgeTempId: null,
        // classifyId: null,
        // knowledgeName: "",
        // knowledgeExplain: "",
        // knowledgeContent: "",
        // knowledgeStatus: null,
        // tagIdList: [],
        fileVOList: [],
        // modifyReason: null,
        // modifyEffect: null,
        // examineFirst: null,
        // examineSecond: null,
        // rejectFirst: null,
        // rejectSecond: null,
        // demand: 0 //必传更新需求，0新增，1修改，2删除
      }
      if (row) {
        if (this.activeName == 'home') {
          const res = await dataKnowledgeGet({
            knowledgeId: row.knowledgeId,
            knowledgeStatus: null
          })
          if (res) {
            this.$nextTick(() => {
              this.form = _.cloneDeep(res.data.data)
              this.$refs.knowledgeContent.editor.txt.html(res.data.data.knowledgeContent)
            });
          }
        } else {
          this.form.modifyReason = ''
          this.form.modifyEffect = ''
          this.$nextTick(() => {
            if (this.title1 !== '移除') this.$refs.knowledgeContent.editor.txt.html(row.knowledgeContent)
            this.form = _.cloneDeep(row)
          });
        }
      } else {
        this.$nextTick(() => {
          this.$refs.knowledgeContent.editor.txt.html('')
        })
      }
    },
    // 保存
    save() {
      this.$refs["form1"].validate(async (valid) => {
        console.log(valid);

        console.log(this.form.knowledgeStatus);
        if (valid) {
          if (this.title1 == '新增') {
            if (this.activeName == 'home') {
              this.form.knowledgeTempId = null
            }
            this.form.knowledgeId = null
            this.form.demand = 0
            await dataKnowledgeSave(this.form)
          } else {
            await dataKnowledgeSave({ ...this.form, demand: this.title1.includes('修改') ? 1 : 2 })
          }
          this.show1()
        } else this.$message({
          offset: 170,
          duration: "1000",
          message: '未通过校验，请按表单中的提示修改',
          type: "warning",
        });
      });
    },

    submit1() {
      this.$refs['form1'].validate(async (valid) => {
        if (valid) this.visible2 = true
        else this.$message({
          offset: 170,
          duration: "1000",
          message: '未通过校验，请按表单中的提示修改',
          type: "warning",
        });
      })
    },

    // 提交
    submit2() {
      console.log(this.title1);

      // console.log(this.$refs.default);
      // return
      this.$refs["form2"].validate(async (valid) => {
        console.log(valid);

        if (valid) {
          console.log(this.form);
          // return
          if (this.title1.includes('新增')) {
            if (this.activeName == 'home') {
              this.form.knowledgeTempId = null
            }
            this.form.knowledgeId = null
            this.form.demand = 0
            await dataKnowledgeSubmit(this.form)
          } else {
            await dataKnowledgeSubmit({ ...this.form, demand: this.title1.includes('修改') ? 1 : 2 })
          }
          this.show2()
          this.show1()
        } else this.$message({
          offset: 170,
          duration: "1000",
          message: '未通过校验，请按表单中的提示修改',
          type: "warning",
        });
      });
    },


    editor(data) {
      this.form.knowledgeContent = data.htmlText;
    },

    beforeUpload() {
      console.log(999);
      return false
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    // 单个点击

    clickFn(file) {
      this.src = file.url
      this.fileName = file.name
      this.type = file.name.split('.').pop().toLowerCase()
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(this.type)) this.type = 'img'
      if (['mp4', 'avi', 'mkv', 'flv'].includes(this.type)) this.type = 'video'
      if (this.type == 'mp3') this.type = 'audio'
      this.drawer2 = true
    },
    // 改变之后
    async changeFn(file, fileList) {
      let type = file.name.split('.').pop().toLowerCase()
      let arr = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'mp4', 'avi', 'mkv', 'flv', 'mp3', 'pdf', 'xlsx', 'docx']
      console.log(fileList);
      if (!arr.includes(type) || fileList.length > 4 || file.size > 300 * 1024 * 1024) {
        this.$message({
          offset: 170,
          duration: "1000",
          message: "文件过大或格式不支持且数量不能超过4个",
          type: "error",
        });
        fileList.pop()
        return
      }
      this.status = true
      let formData = new FormData()
      formData.append("file", file.raw);
      const res = await dataKnowledgeGetUploadFile(formData)
      console.log(res);
      if (res) {
        this.form.fileVOList.push({
          url: res.data.data.url,
          name: res.data.data.name,
          uid: file.uid
        })
        console.log(this.form.fileVOList);
        console.log(fileList);
        this.status = false
      } else {
        fileList.pop()
        this.status = false
      }
    },
    // 删除之后
    removeFn(file, fileList) {
      this.form.fileVOList = this.form.fileVOList.filter(item => item.uid != file.uid)
    },

    // 搜索标红
    searchValueFn(text) {
      if (!this.request.data.knowledgeName) return text
      return text.replace(
        new RegExp(this.request.data.knowledgeName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi'), (match) => `<span class="light">${match}</span>`)
    },




    // 移除
    async remove() {
      const res = await dataKnowledgeCancel({ knowledgeTempId: this.form.knowledgeTempId })
      this.show1()
    },

    // 驳回
    async reject() {
      if (this.title1 == '审核') {
        if (!this.form.rejectFirst) return this.$message({
          offset: 170,
          duration: "1000",
          message: '审核驳回批注不能为空',
          type: "warning",
        });
        await dataKnowledgeReject({
          knowledgeTempId: this.form.knowledgeTempId,
          rejectFirst: this.form.rejectFirst,
        })
        this.drawer1 = false
        this.requestFn()
      } else {
        if (!this.form.rejectSecond) return this.$message({
          offset: 170,
          duration: "1000",
          message: '审批驳回批注不能为空',
          type: "warning",
        });
        await dataKnowledgeReject({
          knowledgeTempId: this.form.knowledgeTempId,
          rejectSecond: this.form.rejectSecond
        })
        this.drawer1 = false
        this.requestFn()
      }
    },

    // 通过
    async pass() {
      await dataKnowledgePass({
        knowledgeTempId: this.form.knowledgeTempId
      })
      this.drawer1 = false
      this.requestFn()
    },
    // 下载的方式
    async downloadFn(item) {
      const res = await dataKnowledgeDownload({ knowledgeId: item.knowledgeId }, { responseType: "blob" })
      const blob = new Blob([res.data], {
        type: "application/msword",
      });
      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = decodeURIComponent(res.headers.filename);
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    },
    // 附近关闭
    drawerFn(close) {
      if (this.type == 'video') {
        this.$refs.video.pause();
        this.$refs.video.currentTime = 0;
      }
      if (this.type == 'audio') {
        this.$refs.audio.pause();
        this.$refs.audio.currentTime = 0;
      }
      this.type = ""
      close()
    },

    srcTag(item) {
      console.log(item);
      let src = item.name.split('.').pop().toLowerCase()
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(src)) src = 'img'
      if (['mp4', 'avi', 'mkv', 'flv'].includes(src)) src = 'video'
      if (src == 'mp3') src = 'audio'
      return src
    },

    limitChange(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    pageChange(page) {
      this.request.page = page;
      this.requestFn();
    },

  }
};
</script>


<style lang="less" scoped>
.knowledge {
  .container {
    padding: 0 20px;

    .info {
      height: 500px;
      overflow: auto;


      .box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 120px;
        margin-bottom: 11px;
        background-color: #f6f6f6;
        cursor: pointer;

        &:hover {
          border: 2px solid #4466EE;
        }

        .content {
          width: 80%;
          font-size: 14px;
          color: #666;
          padding: 12px;




          .head {
            font-size: 18px;
            color: #333;

            :deep(.light) {
              color: #EE4444 !important;
            }
          }

          .center {
            margin-top: 5px;
            display: flex;
            align-items: center;
            // justify-content: space-between;


            >div {
              width: 22%;
            }
          }

          .bottom {
            margin-top: 5px;
            height: 36px;
            overflow: auto;

            :deep(.light) {
              color: #EE4444 !important;
            }
          }
        }

        .status {
          min-width: 100px;
          font-size: 12px;
          color: #EE4444;
        }

        .btn {
          min-width: 276px;
          width: 15%;

          .el-button {
            border-radius: 0;
          }
        }

      }
    }
  }


  // 审批审核
  .approve {
    display: flex;
    margin: 0 auto;
    justify-content: center;

    .view {
      width: 35%;
      min-width: 550px;
      border: 2px solid #E9E9E9;
      margin: 0 15px;
      padding: 37px 30px;

      .content {


        .top {
          // margin-top: 37px;
          font-family: MiSans-Regular !important;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          color: #333333;
          text-align: center;
        }

        .center {
          margin: 0 auto;
          width: 95%;

          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-top: 24px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #666;

          >div {
            margin-bottom: 20px;
          }

          >div:nth-child(2n) {
            width: 30%
          }
        }



        .label {
          font-size: 14px;
          display: flex;
          margin-bottom: 24px;

          .tag {
            min-width: 44px;
            color: #333;
          }

          span {
            margin-right: 3px;
            color: #333;
          }
        }

        .introduce,
        .text {
          font-size: 14px;
          display: flex;
          margin-bottom: 24px;

          .tag {
            min-width: 44px;
            font-size: 14px;
            color: #333;
          }

          .info {
            color: #666666;
          }
        }

        .text .info {
          height: 260px;
          overflow: auto;
        }

        .old {
          color: #999999;

          .tag,
          .info {
            color: #999999;
          }
        }
      }

      .bottom {
        display: flex;
        margin-bottom: 24px;

        .tag {
          min-width: 44px;
          font-size: 14px;
          color: #333;
        }

        .file {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          overflow: auto;

          >div {
            width: 45%;
            min-width: 170px;
            // border-radius: 4px;
            height: 30px;
            display: flex;
            padding: 8px;
            align-items: center;
            background-color: #EDEEEE;
            margin-bottom: 20px;
            font-size: 14px;
            cursor: pointer;

            .img {
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .name {
              height: 14px;
              font-size: 14px;
              line-height: 14px;
              color: #333333;
              overflow: hidden;
            }
          }
        }
      }
    }

    .approveInfo {
      width: 25%;
      background-color: #f2f2f2;
      padding: 10px;
      overflow: auto;
      font-size: 14px;
      color: #666666;

      >div {
        margin-bottom: 20px;
      }


      .two {
        .box {
          margin-bottom: 24px;

          .name {
            color: #333333;
            margin-bottom: 12px;
            font-weight: 700;
          }

          .value {
            color: #666666;
          }
        }
      }

      .three,
      .four {
        border-top: 1px dashed #999;
        padding-top: 20px;


        .bottom {
          margin-top: 20px;

          :deep(.el-textarea__inner) {
            min-height: 94px !important;
          }

          .name {
            font-weight: 700;
            color: #333;
            margin-bottom: 6px;
          }
        }

      }
    }

    :deep(table) {
      border-collapse: collapse;
      width: 100%;
    }

    :deep(th),
    :deep(td) {
      width: 50px;
      border: 1px solid #ccc;
      padding: 2px;
      text-align: left;
      height: 30px;
      background-color: #ffffff
    }

    :deep(th) {
      background-color: #f1f1f1;
    }
  }

  // 附件
  .annex {
    height: calc(100vh - 100px);
    overflow: auto;
  }


  .btnBox {
    width: 200px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    justify-content: space-around;
  }


}
</style>
