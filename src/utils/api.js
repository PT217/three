/*
 * @Author: your name
 * @Date: 2022-04-21 09:41:59
 * @LastEditTime: 2022-10-27 11:13:08
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /swbpm-view/src/api.js
 */
import { get, post, put, $delete } from "./request"

export const test = (data) => post('test', data)
/* --- home --- */

// 用户登录
export const accountLogin = (data, options) => post("account/login", data, options)

// 获取当前用户角色 role/getRoleByToken
export const roleDecideSuperRole = (data) => get("role/decideSuperRole", data)

// 用户退出
export const accountLogout = data => post("account/logout", data)

//获取菜单权限
export const accountGetLoginUserInfo = data => get("account/getLoginUserInfo", data)

// header流程图
export const toolFlushAdd = data => post('tool/flush/add', data)

// 
export const toolFlushDelete = data => get('tool/flush/delete', data)

// X
export const toolFlushPage = data => post('tool/flush/page', data)


/* --- 项目管理 --- */

// 获取所有设施
export const prjBuildGetList = data => post("prj/build/page", data)


// 查询甘特图
export const prjBuildGetGantt = data => get("prj/build/getGantt", data)

//获取状态
export const prjBuildStatusPage = data => get("prj/build/status/page")

//获取类型
export const prjBuildTypePage = data => get("prj/build/type/page")

//表格新增
export const prjBuildAdd = data => post("prj/build/add", data)

//表格编辑
export const prjBuildUpdate = data => put("prj/build/update", data)

// 删除项目
export const prjBuildDelete = data => $delete('prj/build/delete', data)

// 查询一级标题
export const prjProjectWriteFindWordTitleOneInfo = (data) => get('prj/project/write/findWordTitleOneInfo', data)

// 查询项目
export const prjProjectPage = (data) => post('prj/project/page', data)

// 新增项目
export const prjProjectAdd = (data) => post('prj/project/add', data)

// 修改项目
export const prjProjectUpdate = (data) => put('prj/project/update', data)

// 查询全部父项目List
export const prjProjectGetBuildList = (data) => post('prj/project/getBuildList', data)

// 查询全部项目人员
export const prjProjectGetStaffList = (data) => post('prj/project/getStaffList', data)

// 项目中设置编写人员
export const prjProjectStaffAssignStaff = (data) => post('prj/project/staff/assignStaff', data)

// 查询项目编写人员id数组
export const prjProjectStaffGetBindStaffIds = (data) => get('prj/project/staff/getBindStaffIds', data)

// 查询项目编写人员信息
export const prjProjectStaffGetStaffListByProjectId = (data) => get('prj/project/staff/getListByProjectId', data)

// 保存任务分配人员关系
export const prjProjectWriteSetTaskStaff = (data) => post('prj/project/write/setTaskStaff', data)





// 获取首页数据
export const prjTaskGetTaskHome = (data) => get('prj/task/getTaskHome', data)

// 查询个人是否是一个项目的负责人
export const prjProjectGetLeaderFlagAndRole = (data) => get('prj/project/getLeaderFlagAndRole', data)
// 任务管理 查询分配到个人的项目列表
export const taskGetHaveTaskProjectList = (data) => get('prj/task/getHaveTaskProjectList', data)
// 任务管理 获取三日任务
export const prjTaskGetTridTask = (data) => get('prj/task/getTridTask', data)
// 任务管理 查询一个任务的详情
export const prjTaskGetDetails = (data) => get('prj/task/getDetails', data)
// 任务管理 查询所有设施
export const prjTaskGetPublishBuildList = (data) => get('prj/task/getPublishBuildList', data)
// 任务管理 查询设施下所有项目
export const prjTaskGetPublishProjectList = (data) => get('prj/task/getPublishProjectList', data)
// 任务管理 查询一个项目下的任务列表
export const prjTaskGetList = (data) => post('prj/task/page', data)
// 任务管理 修改任务
export const prjTaskUpdateTask = (data) => post('prj/task/updateTask', data)
// 任务管理 完成任务接口
export const prjTaskFinishTask = (data) => post('prj/task/finishTask', data)
// 任务管理 新增任务
export const prjTaskAddTask = (data) => post('prj/task/addTask', data)
// 任务管理 任务文件上传
export const prjTaskUploadTaskFile = (data) => post('prj/task/uploadTaskFile', data)
// 任务管理 下发任务
export const prjTaskPublishTask = (data) => post('prj/task/publishTask', data)
// 任务管理 转派任务
export const prjTaskTransferTask = (data) => post('prj/task/transferTask', data)
// 任务管理 删除任务
export const prjTaskDelTask = (data) => $delete('prj/task/delTask', data)




/* --- 技术管理 --- */


// 特性调查数据
export const techCharacterAdd = data => post('tech/character/add', data)

// -
export const techCharacterDelete = data => $delete('tech/character/delete', data)

// /
export const techCharacterUpdate = data => put('tech/character/update', data)

// X
export const techCharacterPage = data => post('tech/character/page', data)

// 工程结构分解
export const techStructureAdd = data => post('tech/structure/add', data)

// -
export const structureDeleteById = data => get('tech/structure/deleteById', data)

// /
export const structureUpdate = data => post('tech/structure/update', data)

// X
export const structureQueryByLimit = data => post('tech/structure/page', data)

// 获取项目列表
export const prjProjectFindApprovedProjectList = data => get('prj/project/getListByBuildId', data)

// 批准
export const structureChangeFlag = data => post('tech/structure/changeFlag', data)


// 通过项目建议书id查询工程分解id
export const FindDecomEngineerStructIdByProposalId = data => get('tech/proposal/findDecomEngineerStructIdByProposalId', data)

// +
export const techProposalAdd = data => post('tech/proposal/add', data)

// 
export const techProposalDelete = data => $delete('tech/proposal/delete', data)

// /
export const techProposalUpdate = data => post('tech/proposal/update', data)

// X
export const techProposalPage = data => post('tech/proposal/page', data)

// 建议书批准
export const projectProposalInfoUpdateFinalFlag = data => get('tech/proposal/updateFinalFlag', data)

// 建议书查询批准的父项目
export const techProposalFindProposalBuildList = data => post('tech/proposal/findProposalBuildList', data)

// 建议书通过父项目id查询项目列表
export const techProposalFindProjectVoListOfProjectProposal = data => post('tech/proposal/findProjectVoListOfProjectProposal', data)

// 建议书内容查询
export const techProposal_contentFindById = data => get('tech/proposal_content/findById', data)

// 建议书内容修改
export const techProposal_contentUpdateProjectProposalContent = data => post('tech/proposal_content/updateProjectProposalContent', data)

// 查询不可编辑的文档标题
export const prjProjectWriteGetUnableAllowTitle = data => get('prj/project/write/getUnableAllowTitle', data)

// 待实施方案
export const techConductAdd = data => post("tech/conduct/add", data)

// -
export const techConductDelete = data => $delete("tech/conduct/delete", data)

// /
export const techConductUpdate = data => put("tech/conduct/update", data)

// X
export const techConductPage = data => post("tech/conduct/page", data)

// 查询已批准的待实施父项目
export const techConductAllowBuildPage = data => post('tech/conduct/allowBuildPage', data)

// 待实施查询已批准的项目list 
export const techConductAllowProjectPage = data => post("tech/conduct/allowProjectPage", data)

//将单个方案确认为最终方案
export const techConductUpdateFinalFlag = data => put('tech/conduct/updateFinalFlag', data)

//编辑代实施富文本内容
export const exportSaveHtmlInfo = data => post('tech/export/saveHtmlInfo', data)

//上传图片
export const uploadPhoto = data => post('tech/upload_photo/photo', data)

//查询编辑器内容
export const exportGetWordInfo = data => get("tech/export/getWordInfo", data)

// 分部分项
export const findStatement2Partial = data => get('tech/conduct/findStatement2Partial', data)

// 综合单价
export const getCompreUnitPrice = data => get('tech/conduct/getCompreUnitPrice', data)

// 总价措施费
export const findItemPay2MeasureCost = data => get('tech/item_pay/findItemPay2MeasureCost', data)

// 规费
export const getItemPay2LaborCost = data => get('tech/item_pay/getItemPay2LaborCost', data)

//报表明细
export const techConductFindPlan = data => get('tech/conduct/findPlan', data)

// 保存节点
export const techItemAdd = data => post("tech/item/add", data)

//查询新流程左边树状结构目录
export const techItem_treeGetTree = data => get("tech/item_tree/getTree")

//查询新流程图单个模块信息
export const techItemGetItem = data => get("tech/item/getItem", data)

// 查询新流程图流程数据
export const techStructure_flushGetStructureFlush = data => get('tech/structure_flush/getStructureFlush', data)

// 保存新流程图流程数据
export const techStructure_flushSave = data => post('tech/structure_flush/save', data)

//通过分类id获取费用
export const dataParamCostPage = data => post("data/param/cost/page", data)

//查询树形结构
export const techItem_treeGetLevels = data => get("tech/item_tree/getLevels", data)

// 单个查询
export const techItem_treeQueryById = data => get('tech/item_tree/queryById', data)

// 分页树形table
export const techItem_treePage = data => post("tech/item_tree/page", data)

// allTable
export const exportExport2Word = (data, options) => get('tech/export/export2Word', data, options)

// proposalText
export const exportExportProjectProposal = (data, options) => get('tech/export/exportProposal', data, options)

/* --- 施工管理 --- */

// + 
export const staffManageAddstaff = data => post('data/account/staff/addStaff', data)

// X
export const photoRecordFindItemList = data => post('const/photo_record/findItemList', data)

// -
export const staffManageDeletestaff = data => $delete('data/account/staff/deleteStaff', data)

// /
export const staffManageUpdatestaff = data => put('data/account/staff/updateStaff', data)

// X
export const staffManageFindstaff = data => post('data/account/staff/page', data)

// 查询所有最终方案
export const finalSchemeFindAll = data => post('const/final_scheme/page', data)

// 获取最终方案的负责人
export const backLogGetLeaderAndRole = data => get('const/back_log/getLeaderAndRole', data)

// 获取甘特图数据
export const finalSchemeGetGantt = data => get('const/final_scheme/getGantt', data)

// 更新实际时间
export const finalSchemeUpdateProcessActualTime = data => put('const/final_scheme/updateProcessActualTime', data)

// 日报新增
export const dailyAddDaily = data => post('const/daily/add', data)

// 日报删除
export const dayDeleteDayLog = data => get('const/daily/delete', data)

// 日报修改
export const dailyUpdateDaily = data => post('const/daily/update', data)

// 日报查询
export const dailyDailyPage = data => post('const/daily/page', data)

// 日报打印
export const dailyExport = (data, options) => post('const/daily/export', data, options)

// 日报工艺下拉
export const nodeGetSchemeAllNode = data => get('tech/item/getSchemeAllItem', data)

// 周报新增  
export const weeklyAddWeekly = data => post('const/weekly/add', data)

// 周报删除
export const weeklyDeleteWeekly = data => get('const/weekly/deleteWeekly', data)

// 周报修改
export const weeklyUpdateWeekly = data => post('const/weekly/updateWeekly', data)

// 周报查询
export const weeklyGetWeekLogPage = data => post('const/weekly/page', data)

// 周报打印
export const weeklyExport = (data, options) => post('const/weekly/export', data, options)

// 月报新增  
export const monthlyAddMonthly = data => post('const/monthly/addMonthly', data)

// 月报删除
export const monthlyDeleteMonthly = data => get('const/monthly/deleteMonthly', data)

// 月报修改
export const monthlyUpdateMonthly = data => post('const/monthly/updateMonthly', data)

// 月报查询
export const monthlyGetMonthlyPage = data => post('const/monthly/page', data)

// 月报打印
export const monthlyExport = (data, options) => post('const/monthly/export', data, options)

// 照片墙+
export const photoRecordAdd = data => post('const/photo_record/add', data)

// -
export const photoRecordDeleteByPhotoId = data => $delete('const/photo_record/deleteByPhotoId', data)

// /
export const photoRecordUpdatePhotoInfo = data => put('const/photo_record/update', data)

// X
export const photoRecordFindPhotoInfoList = data => post('const/photo_record/page', data)

// -
export const photoRecordDeleteNode = data => $delete('const/photo_record/deleteItem', data)

// 查询是否允许勾选该工艺
export const photoRecordFindNodeCount = data => post('const/photo_record/findItemCount', data)

// 工艺批量修改
export const photoRecordUpdateNodeInfo = data => put('const/photo_record/updateItemInfo', data)

// 查询方法已有的工艺列表
export const techItemGetConductPhoto = data => get('tech/item/getConductPhoto', data)

// 照片导出
export const constPhoto_recordExport2zip = (data, options) => post('const/photo_record/export2zip', data, options)

// 获取模型数据
export const dataModelGetModelData = data => get('data/model/getModelData', data)

// 待办查询
export const constBack_logPage = data => post('const/back_log/page', data)


// 照片墙状态
export const backLogUpdateConductContentStatus = data => get('const/back_log/updateConductContentStatus', data)

/* --- 数据管理 --- */

// 废物库
export const techCharacterFindByBuildId = data => post("tech/character/findByBuildId", data)

// +
export const dataWasteAdd = data => post("data/waste/add", data)

// - 
export const dataWasteDelete = data => $delete("data/waste/delete", data)

// /
export const dataWasteUpdate = data => put('data/waste/update', data)

// X
export const dataWasteFindAll = data => post("data/waste/page", data)


// 费用分类
export const dataReportFindDetailGroup = data => get('data/report/findDetailGroup', data)

// 
export const dataParamCostAdd = data => post('data/param/cost/add', data)

// 
export const dataParamCostUpdate = data => put('data/param/cost/update', data)

//媒体库
export const dataMultimediaAdd = data => post("data/multimedia/add", data)

//-
export const dataMultimediaDelete = data => get("data/multimedia/delete", data)

///
export const dataMultimediaUpdate = data => post("data/multimedia/update", data)

//X
export const dataMultimediaPage = data => post("data/multimedia/page", data)

//判断媒体文件名是否重复
export const dataMultimediaGetAllFileName = data => get("data/multimedia/judgeFileName", data)

// 模型库
export const dataModelAdd = data => post('data/model/add', data)

// -
export const dataModelDelete = data => get("data/model/delete", data)

// /
export const dataModelUpdate = data => post("data/model/update", data)

// X
export const dataModelPage = data => post("data/model/page", data)

//判断模型名是否重复
export const dataModelGetAllFileName = data => get("data/model/getAllFileName", data)

// 基本参数管理列表查询
export const dataReportPage = data => post("data/report/page", data)

// 基本参数管理列表编辑
export const dataReportUpdate = data => post("data/report/update", data)

//辐射场系数列表
export const dataReportQuery = data => get("data/report/query")

//新增用户
export const accountCreateAccount = data => post("account/createAccount", data)


//修改用户标志
export const accountUpdateAccountFlag = data => put("/account/updateAccountFlag", data)

//编辑用户
export const accountUpdateAccount = data => put("account/updateAccount", data)

//查询全部用户
export const accountFindAll = data => post("account/page", data)

//新增路径
export const departAdd = data => post("depart/add", data)

//修改用户
export const departUpdate = data => put("depart/update", data)

//查询全部部门
export const departFindAll = data => post("depart/page", data)

//删除用户
export const departDelete = data => $delete("depart/delete", data)

//根据用户ID查询权限
export const accountGetStaff = data => get("account/getStaff", data)

//查询全部角色(不带分页)
export const roleFindAllRoles = data => get("role/allRoles", data)

//查询全部路径(不带分页)
export const permFindAllPerms = data => get("perm/allPerms", data)

//查询全部角色(带分页)
export const roleFindPageRoles = data => post("role/page", data)

//新增角色
export const roleCreateRole = data => post("role/create", data)

// 修改角色
export const roleUpdateRole = data => put("role/update", data)

// 删除角色
export const roleDeleteRole = data => $delete("role/delete", data)

// 通过角色id查询信息
export const roleFindRolePermsByRoleId = data => get("role/findRolePermsByRoleId", data)

//查询全部路径(带分页)
export const permPage = data => post("perm/page", data)

//新增路径
export const permAdd = data => post("perm/createPermission", data)

// 修改路径
export const permUpdate = data => put("perm/update", data)

// 删除路径
export const permDelete = data => $delete("perm/deletePermission", data)

// 费用汇总
export const techConductFindSummaryCost = data => get('tech/conduct/findSummaryCost', data)

//编辑目录
export const techItem_treeUpdate = data => post("tech/item_tree/update", data)

//删除基础费用
export const dataParamCostDelete = data => $delete("data/param/cost/delete", data)

// 
export const dataParamCost_groupList = data => get("data/param/cost_group/list")

// 人工费估算
export const dataParamLabor_costPayTable = data => post('data/param/labor_cost/payTable', data)

// 人工费修改
export const dataParamLabor_costUpdate = data => post('data/param/labor_cost/update', data)

// 模型切片
export const chunk = (url, data, options) => post(url, data, options)

// 查询日志
export const dataLog_operatePage = data => post('data/log_operate/page', data)


//查找所有摄像头
export const dataCameraFind = data => get('data/camera/find', data)
// 开启转码并查看摄像头画面
export const dataCameraGetCameraVideo = data => get('/data/camera/getCameraVideo', data)
// 关闭转码
export const dataCameraOffCameraVideo = data => $delete('/data/camera/offCameraVideo', data)



// 人员信息同步
export const accountSyncUser = data => post('account/syncUser', data)

// 警告
export const dataCameraFindAlarmList = data => post('data/camera/findAlarmList', data)


// 下载模版
export const accountTempletaDownLoad = (data, options) => post('account/templetaDownLoad', data, options)




// 请求柱状图数据 structureId 29
export const techItem_payGetItemPay2Bar = (data) => get('tech/item_pay/getItemPay2Bar', data)
// 请求折线图数据 structureId
export const techItem_payGetItemPay2Line = (data) => get('tech/item_pay/getItemPay2Line', data)
// 请求半圆图数据
export const techItem_payGetItemPay2Pie = (data) => get('tech/item_pay/getItemPay2Pie', data)
// 请求方案下的所有分类费用数据之和
export const techItem_payGetSchemePrice = (data) => get('tech/item_pay/getSchemePrice', data)



// 分页查询
export const dataKnowledgePage = (data) => post('data/knowledge/page', data)
// 查看内容
export const dataKnowledgeGet = (data) => post('data/knowledge/get', data)
// 保存（用于新增、修改、删除需求）
export const dataKnowledgeSave = (data) => post('data/knowledge/save', data)
// 保存并提交
export const dataKnowledgeSubmit = (data) => post('data/knowledge/submit', data)
// 通过
export const dataKnowledgePass = (data) => get('data/knowledge/pass', data)
// 驳回
export const dataKnowledgeReject = (data) => post('data/knowledge/reject', data)
// 移除
export const dataKnowledgeCancel = (data) => $delete('data/knowledge/cancel', data)
// 标签
export const dataKnowledgeTagGetTagList = (data) => get('data/knowledgeTag/getTagList', data)
// 查询审核和审批人列表
export const dataKnowledgeGetExamineSet = (data) => get('data/knowledge/getExamineSet', data)
// 上传文件
export const dataKnowledgeGetUploadFile = (data) => post('data/knowledge/uploadFile', data)
// 下载 test
export const dataKnowledgeDownload = (data, options) => get('data/knowledge/download', data, options)
// 知识库索引

//知识分类 -查询列表
export const dataKnowledgeClassifyPage = (data) => post('/data/knowledgeClassify/page', data)
// 知识分类 -新增
export const dataKnowledgeClassifyAdd = (data) => post('/data/knowledgeClassify/add', data)
// 知识分类 -查询单个详情
export const dataKnowledgeClassifyGetById = (data) => get('/data/knowledgeClassify/getById', data)
// 知识分类 -编辑
export const dataKnowledgeClassifyUpdate = (data) => post('/data/knowledgeClassify/update', data)
// 知识分类 -删除前查询可转移列表
export const dataKnowledgeClassifyGetNameList = (data) => get('/data/knowledgeClassify/getNameList', data)
// 知识分类 -删除
export const dataKnowledgeClassifyDelete = (data) => get('/data/knowledgeClassify/delete', data)

//知识标签 -查询列表
export const dataknowledgeTagPage = (data) => post('/data/knowledgeTag/page', data)
// 知识标签 -新增
export const dataknowledgeTagAdd = (data) => post('/data/knowledgeTag/add', data)
// 知识标签 -查询单个详情
export const dataknowledgeTagGetById = (data) => get('/data/knowledgeTag/getById', data)
// 知识标签 -编辑
export const dataknowledgeTagUpdate = (data) => post('/data/knowledgeTag/update', data)
// 知识标签 -删除前查询可转移列表
export const dataknowledgeTagGetNameList = (data) => get('/data/knowledgeTag/getNameList', data)
// 知识标签 -删除
export const dataknowledgeTagDelete = (data) => get('/data/knowledgeTag/delete', data)


// 3d场景编辑 -模型绑定(也用于图标绑定)
export const dataKnowledgeModelBindBind = (data) => post('/data/knowledgeModelBind/bind', data)
// 3d场景编辑 -绑定知识
export const dataKnowledgeModelBindKnowledgeBind = (data) => post('/data/knowledgeModelBind/knowledgeBind', data)
// 3d场景编辑 -解除知识绑定
export const dataKnowledgeModelBindDeleteBind = (data) => get('/data/knowledgeModelBind/deleteBind', data)
// 3d场景编辑 -获取已绑定知识列表
export const dataKnowledgeModelBindGetBindKnowledge = (data) => get('/data/knowledgeModelBind/getBindKnowledge', data)
// 3d场景编辑 -删除图标
export const dataKnowledgeModelBindDelete = (data) => get('/data/knowledgeModelBind/delete', data)
// 3d场景编辑 -获取场景内的模型
export const dataKnowledgeModelBindGetBind = (data) => get('/data/knowledgeModelBind/getBind', data)



// 获取场景列表
export const dataSceneScenarioPage = (data) => post('data/scene/scenario/page', data)

// 新增场景 旧
// export const dataSceneScenarioUploadScenarioZip = (data) => post('data/scene/scenario/uploadScenario', data)

// 新增场景
export const dataSceneScenarioAdd = (data) => post('data/scene/scenario/add', data)
// 保存场景JSON
export const dataSceneScenarioUpdateScenarioJson = (data) => post('data/scene/scenario/updateScenarioJson', data)


// 保存图标名称
export const dataKnowledgeModelBindUpdate = (data) => post('data/knowledgeModelBind/update', data)
// 保存图标知识列表
export const dataKnowledgeModelBindSaveKnowledge = (data) => post('data/knowledgeModelBind/saveKnowledge', data)



//通过id查询摄像头信息
export const dataCameraGetCameraById = (data) => get('data/camera/getCameraById', data)
// 模型和监控点位的绑定
export const dataCameraModelBindCamera = (data) => post('data/camera/modelBindCamera', data)

// 查询摄像头
export const dataCameraPage = (data) => post('data/camera/page', data)
// 新增摄像头
export const dataCameraAddCamera = (data) => post('data/camera/addCamera', data)
// 编辑摄像头
export const dataCameraUpdateCamera = (data) => post('data/camera/updateCamera', data)
// 删除摄像头
export const dataCameraDeleteCamera = (data) => get('data/camera/deleteCamera', data)











