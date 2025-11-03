<template>
    <div>
        <!-- 知识库详情查看 -->
        <el-drawer :visible.sync="drawer" :before-close="bindBackFn" size="50%">
            <template slot="title">
                <div class="title_content">
                    <div class="title_icon"></div>
                    <div>
                        <span>标题：{{ descData.knowledgeName ? descData.knowledgeName : "未命名" }}</span>
                    </div>
                </div>
            </template>

            <div class="view">

                <div class="content">

                    <div class="top">标题：{{ descData.knowledgeName }}
                        <el-tag effect="dark" size="mini" style="margin-left: 5px;">核工业</el-tag>
                    </div>

                    <div class="center">
                        <div>最新更新时间：{{ descData.updateTime ? descData.updateTime : descData.createTime }}</div>
                        <div>更新人：{{ descData.creatorName }}</div>
                        <div>审核人：{{ descData.examineFirstName }}</div>
                        <div>审批人：{{ descData.examineSecondName }}</div>

                    </div>
                    <!-- 标签 -->
                    <div class="label">
                        <div class="tag">标签：</div>
                        <span v-for="item in descData.tagIdList" :key="item">{{ tagMap.get(item) }}</span>
                    </div>
                    <!-- 简介 -->
                    <div class="introduce">
                        <div class="tag">简介：</div>
                        <div class="info">{{ descData.knowledgeExplain }}</div>
                    </div>
                    <!-- 富文本 -->
                    <div class="text">
                        <div class="tag">内容：</div>
                        <div class="info" v-html="descData.knowledgeContent"></div>
                    </div>
                </div>

                <div class="bottom">
                    <div class="tag">附件：</div>
                    <div class="file" v-if="descData.fileVOList?.length">
                        <div v-for="item in descData.fileVOList" :key="item.url" @click="clickFn(item)">
                            <div class="img" style="margin-right: 5px;">
                                <img :src="require(`../assets/technology/${srcTag(item)}.png`)">
                            </div>
                            <div class="name">{{ item.name }}</div>
                        </div>
                    </div>
                    <div v-else>无</div>
                </div>
            </div>

            <div class="bind_btn">
                <el-button size="mini" type="primary" @click="bindBackFn">关 闭</el-button>
            </div>
        </el-drawer>


        <!-- 附件查看 -->
        <el-drawer :title="`附件查看:${fileName}`" :visible.sync="fjDrawer" direction="rtl"
            :before-close="close => fjDrawerFn(close)" size="50%">

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
import {
    dataKnowledgeTagGetTagList,//标签
    dataKnowledgeGet,
} from '@/utils/api'

//引入VueOfficePdf组件
import VueOfficePdf from '@vue-office/pdf'
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/excel/lib/index.css'
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
export default {
    components: {
        VueOfficePdf,
        VueOfficeExcel,
        VueOfficeDocx
    },
    props: {
        knowledgeId: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            drawer: false,
            fjDrawer: false,
            type: null,
            src: null,
            descData: {},
            tagMap: null,
            fileName: ""
        }
    },
    created() {
        this.dataKnowledgeTagGetTagList()
    },
    watch: {
        knowledgeId: {
            handler(newValue, oldValue) {
                if (newValue) {
                    console.log(4);
                    this.drawer = true
                    this.dataKnowledgeGet()
                }
            },
            immediate: true
        }
    },

    methods: {
        clickFn(file) {
            console.log(file);
            this.fjDrawer = true
            this.src = file.url
            this.fileName = file.name
            this.type = file.name.split('.').pop().toLowerCase()
            if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(this.type)) this.type = 'img'
            if (['mp4', 'avi', 'mkv', 'flv'].includes(this.type)) this.type = 'video'
            if (this.type == 'mp3') this.type = 'audio'

            console.log(this.type);
        },
        // 附件关闭
        fjDrawerFn(close) {
            if (this.type == 'video') {
                this.$refs.video.pause();
                this.$refs.video.currentTime = 0;
            }
            if (this.type == 'audio') {
                this.$refs.audio.pause();
                this.$refs.audio.currentTime = 0;
            }
            close()
        },
        bindBackFn() {
            this.drawer = false;
            this.$emit('close')
        },
        // 标签
        async dataKnowledgeGet() {
            const { data } = await dataKnowledgeGet(
                {
                    knowledgeId: this.knowledgeId,
                    knowledgeStatus: -1
                }
            )

            if (data.code == 200) {
                this.descData = data.data
            }
        },
        async dataKnowledgeTagGetTagList() {
            const res = await dataKnowledgeTagGetTagList()
            if (res) {
                this.tagMap = new Map(res.data.data.map(item => [item.tagId, item.tagName]))
            }

        },
        srcTag(item) {
            console.log(item);
            let src = item.name.split('.').pop().toLowerCase()
            if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(src)) src = 'img'
            if (['mp4', 'avi', 'mkv', 'flv'].includes(src)) src = 'video'
            if (src == 'mp3') src = 'audio'
            return src
        },
    },

}
</script>

<style lang="less" scoped>
.annex {
    width: 100%;
    height: calc(100vh - 100px);
    // overflow: auto;
}

.title_content {
    display: flex;
    border-bottom: 1px solid #ddd;

    .title_icon {
        width: 4px;
        height: auto;
        background: #0143CE;
        margin-right: 10px;
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

.view {
    min-width: 550px;
    border: 2px solid #E9E9E9;
    margin: 0 15px;
    margin-top: 19px;
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
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 24px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;

            >div {
                width: 50%;
                margin-bottom: 20px;
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
</style>