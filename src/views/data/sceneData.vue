<template>
    <div>
        <Nav :nav="nav"></Nav>
        <Tab title="场景数据管理" :tableData="tableData" :headerList="headerList" @pageChange="pageChange"
            @limitChange="limitChange" :request="request" :loading="loading">
            <template slot="select">
                <el-form inline>

                    <el-form-item>
                        <el-input clearable size="mini" @input="inputFn" v-model="request.data.scenarioName"
                            placeholder="请输入场景名称"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" size="mini" @click="requestFn('搜索')">搜索</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('新增')">新增</el-button>
                    </el-form-item>
                </el-form>
            </template>

            <template slot="column">
                <el-table-column label="操作" width="200px" align="left">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="sceneEditFn(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </template>
        </Tab>
        <Dialog :title="title" :visible="visible" @show="show" @submit="submit">
            <el-form ref="form" :model="form" :rules="rules" label-width="117px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设施名称:" prop="buildId">
                            <el-select v-model="form.buildId" placeholder="请选择设施名" default-first-option>
                                <el-option v-for="item in buildList" :key="item.buildId" :label="item.buildName"
                                    :value="item.buildId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="场景名称:" prop="scenarioName">
                            <el-input maxlength="10" show-word-limit v-model="form.scenarioName"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
        </Dialog>
    </div>
</template>
  
  
<script>
import {
    prjBuildGetList,
    dataSceneScenarioPage as requestFn,
    dataSceneScenarioAdd as addFn
} from "../../utils/api";

import { mixins } from "../../mixin";
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
                    name: "场景数据管理",
                    path: "/sceneData",
                    isClick: false,
                },
            ],
            headerList: {
                buildName: "设施名称",
                scenarioName: "场景名称"
            },

            request: {
                data: {
                    scenarioName: "",
                },
                page: 1,
                limit: 5,
                total: 5,
            },
            buildList: [],

            title: "",

            visible: false,

            form: {
                buildId: "",
                scenarioName: "",
            },



            rules: {
                buildName: [
                    { required: true, message: "设施不能为空", trigger: "blur" },
                ],
            },
        };
    },
    mounted() { },
    methods: {
        // 获取表格数据
        async requestFn(reset) {
            console.log(1);
            if (reset) this.request.page = 1;
            const res = await requestFn(this.request);
            // console.log(res);
            if (res) {
                this.handleData(res.data)
                this.buildListFn()
            }
        },
        // 获取设施数组
        async buildListFn() {
            const res1 = await requestFn({
                data: {},
                page: 1,
                limit: 1000,
            });
            const res2 = await prjBuildGetList({
                data: {},
                page: 1,
                limit: 1000,
            });
            if (res1 && res2) {
                this.buildList = res2.data.data.list.filter(item => !res1.data.data.list.some(tabItem => tabItem.buildName === item.buildName))
            }
        },
        // 弹框
        show() {
            if (this.visible) {
                if (this.title == "新增") {
                    this.$refs["form"].resetFields();
                }
                this.requestFn()
            }
            this.visible = !this.visible;
        },
        // 新增与编辑
        addOrUpdateOrDelete(title, row) {
            this.show();
            this.title = title;
        },
        // 提交
        async submit() {
            let res;
            this.$refs["form"].validate(async (valid) => {
                if (valid) {
                    res = await addFn(this.form)
                    console.log(res);
                    this.show();
                    this.requestFn();
                }
            });

        },
        sceneEditFn(row) {
            localStorage.setItem('sceneEditData', JSON.stringify(row))
            this.$router.push({ path: '/sceneEdit' })
        },

    },
};
</script>