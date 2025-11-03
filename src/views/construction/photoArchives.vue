
<template>
  <div class="photoArchives">
    <Nav :nav="nav">
      <template slot="right">
        <el-select class="workmanshipListSelect" v-model="photoListModelNewValue" placeholder="请选择" default-first-option
          filterable clearable @change="selectChange" :disabled="status == '查看'">
          <div class="option">
            <el-option v-for="item in workmanshipList" :key="item.id" :label="item.workContext" :value="item.id">
            </el-option>
          </div>
        </el-select>

        <el-button type="primary" size="mini" @click.prevent="addOrEdit('新增')"
          :disabled="!photoListModelNewValue">新增</el-button>
        <!-- <el-button type="primary" size="mini" @click.prevent="addOrEdit('新增')">新增</el-button> -->
        <el-button type="primary" size="mini" @click.prevent="back()">返回</el-button>
      </template>
    </Nav>
    <div class="content">
      <el-card class="box-card" v-for="(item, index) in photoList" :key="index">
        <div slot="header" class="clearfix">
          <div><img src="../../assets/common/lb.png" />{{ index + 1 }}</div>
          <el-dropdown style="float: right; padding: 3px 0" @command="handleCommand" :disabled="status == '查看'">
            <el-button type="text" class="el-icon-more"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="beforeHandleCommand(item, '编辑')">编辑</el-dropdown-item>
              <el-dropdown-item :command="beforeHandleCommand(item, '删除')" divided>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="item">
          <el-card shadow="hover" class="leftbox">
            <div>
              <div>题名:</div>
              {{ item.title }}
            </div>
            <div>
              <div>照片号:</div>
              {{ item.photoNum }}
            </div>
            <div>
              <div>底片号:</div>
              {{ item.negativeNum }}
            </div>
            <div>
              <div>参见号:</div>
              {{ item.seeAlsoNumber }}
            </div>
            <div>
              <div>时间:</div>
              {{ item.time }}
            </div>
            <div>
              <div>摄影者:</div>
              {{ item.staffVo?.staffName }}
            </div>
            <div>
              <div>文字说明:</div>
              <div class="textDesc">
                {{ item.textDesc }}

              </div>
            </div>
          </el-card>
          <el-card shadow="hover" class="imgbox">
            <img width="100%" height="100%" :src="item.photoPath" @click="bigPicture(item)" alt="" />
          </el-card>
        </div>
      </el-card>


      <el-form label-width="117px">

        <el-form-item prop="approvalOpinion" label="审批意见:"
          v-if="approvalStatus == '审批通过' || approvalStatus == '审批未通过' || isApproval">
          <Edit eId="approvalOpinion" onlyRead :text="approvalOpinion" @Edit="editor" ref="approvalOpinion"
            :disabled="status == '查看' && !isApproval">
          </Edit>
        </el-form-item>


        <el-form-item>
          <div v-if="isApproval" class="photoArchivesApproval">
            <el-button type="primary" @click="submitApproval('审批通过')">通过</el-button>
            <el-button type="danger" @click="submitApproval('审批未通过')">不通过</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <Dialog :visible="visible" :title="dialogTitle" @submit="submit" @show="show">
      <el-form ref="form" :model="form" :rules="rules" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="题名:" prop="title">
              <el-input v-model="form.title" show-word-limit :maxlength="15"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="照片号:" prop="photoNum">
              <el-input v-model="form.photoNum" show-word-limit :maxlength="15"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="底片号:" prop="negativeNum">
              <el-input v-model="form.negativeNum" show-word-limit :maxlength="15"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="参见号:" prop="seeAlsoNumber">
              <el-input v-model="form.seeAlsoNumber" show-word-limit :maxlength="15"> </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="时间:" prop="time" class="select">
              <el-date-picker v-model="form.time" type="date" placeholder="选择日期" align="left">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="摄影者:" prop="staffVo.staffId">
              <el-select v-model="form.staffVo.staffId" placeholder="请选择" default-first-option filterable clearable remote
                :remote-method="filterMethod" :loading="selectLoading" loading-text="请求数据"
                @visible-change="visibleChange">
                <div class="option">
                  <el-option v-for="item in recorderListOptions" :key="item.staffId" :label="item.staffName"
                    :value="item.staffId">
                  </el-option>
                </div>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文字说明:" prop="textDesc">
              <el-input type="textarea" v-model="form.textDesc" show-word-limit :maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="3">
            <el-form-item label="图片上传:" prop="file">
              <el-button @click="uploadPicture('flagImg')" size="small">上传图片</el-button>
              <el-input type="hidden" v-model="form.file" placeholder="请添加封面" />
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item>
              <span>{{ form.file }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>

    <el-dialog title="裁切封面" :visible.sync="cropperModel" width="950px" center>
      <CropperImage @uploadImgSuccess="handleUploadSuccess" ref="child">
      </CropperImage>
    </el-dialog>

    <el-dialog title="查看大封面" :visible.sync="imgVisible" center>
      <img :src="imgName" v-if="imgVisible" style="width: 100%" alt="查看" />
    </el-dialog>

    <Dialog :visible="updateWorkmanshipVisble" title="确认修改的工艺名" @show="updateWorkmanshipShowDialog"
      @submit="updateWorkmanshipSubmitDialog">
      {{ updateWorkmanshipValue }}</Dialog>

    <Dialog :visible="backVisble" title="返回" @show="backShowDialog" @submit="backSubmitDialog">
      {{ backValue }}</Dialog>

    <Dialog :visible="handleDelectVisble" title="删除" @show="delectDialog" @submit="delectInfoDialog">
      {{ delectValue }}</Dialog>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
import Edit from "../../components/Edit.vue";
import Dialog from "@/components/Dialog.vue";
import CropperImage from "../../components/CropperImage.vue";
import {
  staffManageFindstaff,
  photoRecordAdd,
  photoRecordDeleteByPhotoId,
  photoRecordUpdatePhotoInfo,
  photoRecordFindPhotoInfoList,
  photoRecordUpdateNodeInfo, //更新工艺名
  photoRecordFindNodeCount, //查询是否可以勾选
  nodeGetSchemeAllNode,
  techItemGetConductPhoto,
  photoRecordDeleteNode, //删除工艺


  backLogUpdateConductContentStatus//审批状态更改
} from "../../utils/api";
import moment from "moment";
export default {
  name: "photoArchives",
  props: [""],

  data() {
    const validateLogo = (rule, value, callback) => {
      if (this.dialogTitle == '编辑') {
        callback();
        return
      }
      console.log(5);

      console.log(this.form.file);
      if (!this.form.file) callback(new Error("请上传图片"));
      else {
        console.log(this.form);
        console.log(7);
        callback();
      }
    };

    return {
      // 判断是新增还是修改
      conductId: "",
      photoFlag: false,
      flag: false,
      title: "照片档案",
      nav: [
        {
          name: "项目进度管理",
          path: "/proSchedule",
          isClick: false,
        },
        {
          name: "进度完成对比表",
          path: "/gant",
          isClick: false,
        },
        {
          name: "照片档案",
          path: "/photoArchives",
          isClick: false,
        },
      ],
      rules: {
        title: [{ required: true, message: "题名不能为空", trigger: "blur" }],
        photoNum: [
          { required: true, message: "照片号不能为空", trigger: "blur" },
        ],
        negativeNum: [
          { required: true, message: "底片号不能为空", trigger: "blur" },
        ],
        seeAlsoNumber: [
          { required: true, message: "参见号不能为空", trigger: "blur" },
        ],

        time: [{ required: true, message: "时间不能为空", trigger: "blur" }],
        "staffVo.staffId": [
          { required: true, message: "摄影者不能为空", trigger: "blur" },
        ],
        textDesc: [
          { required: true, message: "文字说明不能为空", trigger: "blur" },
        ],
        file: [{ required: true, validator: validateLogo, trigger: "blur" }],
      },
      dialogVisible: false,
      form: {
        itemVo: {
          conductId: "",
          itemId: "",
        },
        staffVo: {
          staffId: "",
        },
        title: "",
        photoNum: "",
        negativeNum: "",
        seeAlsoNumber: "",
        time: "",
        cameraman: "",
        textDesc: "",
        photoPath: "",
        file: "",
        suffix: "",
        page: 1,
        limit: 20,
      },
      photoFile: "",

      proPerManageData: {
        data: {
          staffName: "",
          fkDepartId: "",
          job: "",
          staffFlag: 1,
        },
        page: 1,
        limit: 20,
      },
      // photoListVisible
      photoListVisible: false,
      workmanshipList: [],
      photoListModelNewValue: "",
      photoListModelOldValue: "",
      // 查询

      photoReq: {
        data: {
          conductId: "",
          itemId: "",
        },
        page: 1,
        limit: 20,
      },
      photoList: [],

      recorderListOptions: [],
      selectLoading: false,
      // 图片上传
      fileList: [],
      // Dialog
      visible: false,
      dialogTitle: "编辑",
      fileList: [],
      // 截图
      cropperModel: false,
      cropperName: "",
      // 查看大图片
      imgVisible: false,
      imgName: "",
      // 返回弹窗
      backVisble: false,
      backValue: "",
      // 修改工艺确认
      updateWorkmanshipVisble: false,
      updateWorkmanshipValue: "",
      // 删除
      handleDelectVisble: false,
      delValue: "",
      delectValue: "",

      // 审批意见
      approvalOpinion: '',
      approvalStatus: '',



      status: localStorage.getItem('status'),

      // 是否为审批页面
      isApproval: JSON.parse(localStorage.getItem('isApproval')),

      itemId: ''
    };
  },
  components: {
    Nav,
    Tab,
    Edit,
    Dialog,
    CropperImage,
  },
  created() {
    console.log(this.$store.state.account);
    console.log(localStorage.getItem('status'));
    console.log(this.isApproval);
    this.status = localStorage.getItem('status')
    console.log(this.status);

    this.photoArchives = JSON.parse(localStorage.getItem('photoArchives'))
    switch (this.status) {
      case '新增':
        this.conductId = localStorage.getItem("finalSchemeId");
        this.photoListModelOldValue = "";
        this.form.itemVo.conductId =
          localStorage.getItem("finalSchemeId");

        this.flag = false;
        break;
      case '编辑':
        this.conductId = localStorage.getItem("finalSchemeId");
        this.photoListModelNewValue = this.photoArchives.itemId;
        this.photoListModelOldValue = this.photoArchives.itemId;
        this.form.itemVo.conductId = this.photoArchives.conductId;
        this.form.itemVo.itemId = this.photoArchives.itemId;
        this.photoReq.data.conductId = this.photoArchives.conductId;
        this.photoReq.data.itemId = this.photoArchives.itemId;
        this.flag = true
        this.staffManageFindstaff();
        this.photoRecordFindPhotoInfoList();
        break;
      case '查看':
        this.conductId = localStorage.getItem("finalSchemeId");
        this.photoListModelNewValue = this.photoArchives.itemId;
        this.photoListModelOldValue = this.photoArchives.itemId;
        this.form.itemVo.conductId = this.photoArchives.conductId;
        this.form.itemVo.itemId = this.photoArchives.itemId;
        this.photoReq.data.conductId = this.photoArchives.conductId;
        this.photoReq.data.itemId = this.photoArchives.itemId;
        this.flag = true
        this.staffManageFindstaff();
        this.photoRecordFindPhotoInfoList();
        break;
    }

    this.nodeGetSchemeAllNode();
  },
  methods: {
    // 获取项目人员列表
    async staffManageFindstaff() {
      console.log(this.proPerManageData);
      let res = await staffManageFindstaff(this.proPerManageData);

      console.log(res);
      if (res) {
        this.recorderListOptions = res.data.data.list.map((item) => {
          return {
            ...item,
            staffId: item.staffId,
          };
        });
        this.proPerManageData.page = res.data.data.pageNum;
        this.proPerManageData.limit = res.data.data.pageSize;
        this.proPerManageData.total = res.data.data.total;
        this.selectLoading = false;
      }

      console.log(this.recorderListOptions);
    },
    //查询图片列表
    async photoRecordFindPhotoInfoList() {
      const res = await photoRecordFindPhotoInfoList(this.photoReq);
      if (res) {


        this.photoList = res.data.data.photoInfoVo.list.map((item) => {
          return {
            ...item,
            time: moment(item.time).format("YYYY-MM-DD"),
          };
        });
        console.log(this.photoList);
        this.approvalOpinion = res.data.data.approvalOpinion ? res.data.data.approvalOpinion + " " : " "
      }
      this.photoList.forEach((item) => {
        if (item.photoPath) {
          this.photoFlag = true;
        } else {
          this.photoFlag = false;
        }
      });
    },
    // 获取所有工艺列表
    async nodeGetSchemeAllNode() {
      const res = await nodeGetSchemeAllNode({
        schemeId: this.conductId,
      });
      if (res) this.workmanshipList = res.data.data;
    },
    async selectChange() {

      console.log(this.photoListModelNewValue);
      if (
        this.photoListModelNewValue &&
        this.photoListModelOldValue != this.photoListModelNewValue
      ) {
        const res = await photoRecordFindNodeCount({
          conductId: this.conductId,
          itemId: this.photoListModelNewValue,
        });
        if (res) {
          if (this.photoFlag) {
            this.updateWorkmanshipValue = "您确认要更改工艺名吗?";
            this.updateWorkmanshipShowDialog();
          }
        }
      }
    },
    editor(data) {
      this.journalForm = data.htmlText;
    },
    //截图
    uploadPicture(name) {


      this.cropperName = name;
      this.cropperModel = true;



    },
    //图片上传成功后
    handleUploadSuccess(data) {
      this.photoFile = data.blob;
      this.form.file = data.name;
      console.log(this.$refs.child.option.img);
      this.$refs.child.option.img = ""
      this.cropperModel = false;
    },

    // 图片上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onImport({ file }) {
      this.photoFile = file;
      this.form.file = file.name;
      console.log(this.photoFile);
    },
    filterMethod(val) {
      console.log(val);
      this.selectLoading = true;
      this.proPerManageData.page = 1;
      this.proPerManageData.data.staffName = val;
      this.staffManageFindstaff();
    },
    visibleChange(val) {
      console.log(val);
      if (val) {
        this.proPerManageData.data.staffName = "";
        this.proPerManageData.page = 1;
        this.staffManageFindstaff();
      }
    },
    addOrEdit(word, row) {
      this.dialogTitle = word;
      this.isAdd = true
      if (row) {
        this.$nextTick(() => {
          this.isAdd = false

          this.photoFile = ""
          console.log(row);
          // this.fileList = [{ name: row.title, url: row.photoPath }];
          console.log(this.fileList);
          // this.$refs["photoLoad"].clearFiles();
          let temp = Object.assign({}, row);
          this.form = _.cloneDeep(temp);
        });
      }
      this.show();
    },
    show() {
      if (this.visible) {
        this.$refs.form.resetFields();
      }
      this.visible = !this.visible;
    },
    // 新增及编辑
    submit() {
      this.$refs.form.validate(async (valid) => {
        console.log(valid);
        if (valid) {
          this.form.itemVo.itemId = this.photoListModelNewValue;
          this.form.cameraman = this.form.staffVo.staffId;
          this.form.time = moment(this.form.time).format("YYYY-MM-DD");

          let formData = new FormData();

          if (this.dialogTitle == "新增") {
            console.log(this.form);

            formData.append("photoName", this.form.file);
            formData.append("photoFile", this.photoFile);
            formData.append("photoInfoDto", JSON.stringify(this.form));
            let res = await photoRecordAdd(formData);
            this.photoReq.data.itemId = this.photoListModelNewValue;
            this.photoReq.data.conductId =
              this.form.itemVo.conductId;
          } else {
            console.log(this.photoFile);
            let temp = this.photoFile ? this.photoFile : ""
            formData.append("photoName", this.form.file);
            formData.append("photoFile", temp);
            formData.append("photoInfoDto", JSON.stringify(this.form));
            const res = await photoRecordUpdatePhotoInfo(formData);
          }
          this.show();
          backLogUpdateConductContentStatus({ itemId: this.photoListModelNewValue, approvalStatus: '待提交' })
          this.photoRecordFindPhotoInfoList();
        } else {
          this.$message({
            offset: 170,
            duration: "1000",
            message: "未通过校验，请按表单中的提示修改",
            type: "warning",
          });
        }
      });
    },
    del(val) {
      this.delValue = val.photoInfoId;
      this.delectDialog();
    },
    delectDialog() {
      if (this.photoList.length == 1) {
        this.delectValue =
          "此为最后一条信息,删除之后工艺也将清除,清除之后将返回施工过程照片列表,你确定要删除吗？";
      } else {
        this.delectValue = "你确定要删除吗？";
      }
      this.handleDelectVisble = !this.handleDelectVisble;
    },
    // 删除确认事件
    async delectInfoDialog() {
      const res = await photoRecordDeleteByPhotoId({
        photoId: this.delValue,
      });
      this.delectDialog();
      this.photoRecordFindPhotoInfoList();
      if (this.photoList.length == 1) {
        const res = await photoRecordDeleteNode({
          conductId: this.conductId,
          itemId: this.photoListModelNewValue,
        });
        setTimeout(() => {
          this.$router.push({
            name: "gant",
            params: { data: "photoArchives" },
          });
        }, 1500);
      }
    },

    // 修改工艺名
    updateWorkmanshipShowDialog() {
      if (this.updateWorkmanshipVisble) {
        this.photoListModelNewValue = this.photoListModelOldValue;
      }
      this.updateWorkmanshipVisble = !this.updateWorkmanshipVisble;
    },
    async updateWorkmanshipSubmitDialog() {
      const res = await photoRecordUpdateNodeInfo({
        conductId: this.conductId,
        olditemId: this.photoListModelOldValue,
        newitemId: this.photoListModelNewValue,
      });

      this.photoListModelOldValue = this.photoListModelNewValue;
      this.photoReq.data.itemId = this.photoListModelNewValue;
      this.updateWorkmanshipShowDialog();
      this.photoRecordFindPhotoInfoList();
    },
    // 返回
    back() {
      if (JSON.parse(localStorage.getItem('backWait'))) {
        this.$router.push({ name: "gant", params: { data: "wait" } });
        localStorage.removeItem('backWait')
        return
      }
      if (this.photoFlag) {
        this.$router.push({ name: "gant", params: { data: "photoArchives" } });
      } else {
        this.backValue =
          "您还未创建图片档案,当前实施过程照片资料不会被保存,确定要返回上一页吗？";
        this.backShowDialog();
      }
    },
    //
    backShowDialog() {
      this.backVisble = !this.backVisble;
    },
    backSubmitDialog() {
      this.$router.push({ name: "gant", params: { data: "photoArchives" } });
    },
    beforeHandleCommand(item, command) {
      return {
        item: item,
        command: command,
      };
    },
    // 下拉框事件
    handleCommand(command) {
      console.log(command);
      switch (command.command) {
        case "编辑":
          this.addOrEdit("编辑", command.item);
          break;
        case "删除":
          this.del(command.item);
          break;
      }
    },
    bigPicture(item) {
      this.imgName = item.photoPath;
      this.imgVisible = true;
    },


    editor(data) {
      this.approvalOpinion = data.htmlText;
    },



    async submitApproval(approvalStatus) {
      const res = await backLogUpdateConductContentStatus({
        approvalStatus,
        itemId: this.photoArchives.itemId,
        approvalOpinion: this.approvalOpinion
      })
      setTimeout(() => {
        this.$router.push({ name: "gant", params: { data: "wait" } });
      }, 1100);
    }
  },
};
</script>

<style scoped>
.photoArchives {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}


.content {
  height: calc(100vh - 150px);
  border-radius: 10px;
  padding: 20px;
  background-color: white;
  overflow: auto;

  .box-card {
    height: 45%;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0px 3px 6px rgba(48, 116, 237, 0.1);
  }
}





.select .el-date-editor.el-input {
  width: 100%;
}

:deep(.el-card__header) {
  padding: 0 20px;
}

.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clearfix>div>img {
  width: 22px;
  height: 22px;
  margin-right: 17px;
  vertical-align: top;
}

/* item */
.item {
  padding: 0 50px;
  height: 100%;
  display: flex;
  justify-content: space-around;
}

.leftbox {
  width: 50%;
  padding: 20px;
}

.item :deep(.leftbox .el-card__body) {
  flex-direction: column;
  justify-content: space-around;
}

.item :deep(.leftbox .el-card__body > div) {
  height: 28px;
  display: flex;
  margin-right: 20px;
}


.item :deep(.leftbox .el-card__body > div > div:nth-child(1)) {
  width: 15%;
  height: 30px;
}

.item :deep(.leftbox .el-card__body > div > div:nth-child(2)) {
  width: 85%;
  height: 30px;
  overflow-wrap: break-word;
}


.item .textDesc {
  overflow: auto;
}

.item>.imgbox {
  padding: 20px;
  width: 30%;
  height: 100%;
  box-sizing: border-box;
}

.content :deep(.el-card__body) {
  height: 80% !important;
}

.content :deep(.item .el-card__body) {
  padding: 0;
  height: 100% !important;
}

.photoArchives :deep(.workmanshipListSelect) {
  margin-right: 20px;
}

.photoArchives :deep(.workmanshipListSelect .el-input__inner) {
  min-width: 120px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #409eff;
}

.photoArchives :deep(.workmanshipListSelect .el-input__suffix) {
  top: 4px;
}


.content :deep(.w-e-toolbar) {
  z-index: 1 !important;
}

.content :deep(.w-e-text-container) {
  z-index: 0 !important;
}

.photoArchivesApproval {
  display: flex;
  justify-content: center;
}
</style>