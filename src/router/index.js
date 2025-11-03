import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/*初始化路由*/
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/test',
      component: () => import('../views/home/test.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/home/login.vue')
    },

    // 首页
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home')
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: () => import('../views/project/monitor.vue')
    },
    {
      path: '/404',
      component: () => import('../components/Index.vue')
    },
    {
      path: '/ndpChildManage',
      component: () => import('../../src/views/project/ndpChildManage.vue')
    },
    {
      path: '/sceneEdit',
      name: 'sceneEdit',
      component: () => import('../views/data/sceneEdit.vue'),
    },
  ]
})
// 技术管理
const technology = [

  {
    path: '/technology',
    name: 'technology',
    component: () => import('../views/technology'),
  },
  {
    path: '/characteristic',
    name: 'characteristic',
    component: () => import('../views/technology/characteristic.vue'),
  },
  {
    path: '/proDecompose',
    name: 'proDecompose',
    component: () => import('../views/technology/proDecompose.vue'),
  },
  {
    path: '/proposal',
    name: 'proposal',
    component: () => import('../views/technology/proposal.vue'),
  },
  {
    path: '/programme',
    name: 'programme',
    component: () => import('../views/technology/programme.vue'),
  },
  {
    path: '/proposalText',
    name: 'proposalText',
    component: () => import('../views/technology/proposalText.vue'),
  },
  {
    path: '/programmeText',
    name: 'programmeText',
    component: () => import('../views/technology/programmeText.vue')
  },
  {
    path: '/flowChart',
    name: 'flowChart',
    component: () => import('../views/technology/flowChart.vue'),
  },
  {
    path: '/visualShow',
    name: 'visualShow',
    component: () => import('../views/technology/visualShow.vue'),
  },
  {
    path: '/schemeDetails',
    name: 'schemeDetails',
    component: () => import('../views/technology/schemeDetails.vue')
  },
  {
    path: '/allTable',
    name: 'allTable',
    component: () => import('../views/technology/allTable.vue'),
  },
  {
    path: '/costAggregation',
    name: 'costAggregation',
    component: () => import('../views/technology/costAggregation.vue'),
  },
  {
    path: '/subItemTable',
    name: 'subItemTable',
    component: () => import('../views/technology/subItemTable.vue')
  },
  {
    path: '/unitPriceTable',
    name: 'unitPriceTable',
    component: () => import('../views/technology/unitPriceTable.vue'),
  },
  {
    path: '/totalPriceMeasures',
    name: 'totalPriceMeasures',
    component: () => import('../views/technology/totalPriceMeasures.vue')
  },
  {
    path: '/commonCost',
    name: 'commonCost',
    component: () => import('../views/technology/commonCost.vue'),
  },

  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('../views/technology/knowledge.vue'),
  },
]
// 施工管理
const construction = [

  {
    path: '/construction',
    name: 'construction',
    component: () => import('../views/construction'),
  },
  {
    path: '/proSchedule',
    name: 'proSchedule',
    component: () => import('../views/construction/proSchedule.vue'),
  },
  {
    path: '/gant',
    name: 'gant',
    component: () => import('../views/construction/gant.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/journal',
    name: 'journal',
    component: () => import('../views/construction/journal.vue'),
  },
  {
    path: '/journalDetails',
    name: 'journalDetails',
    component: () => import('../views/construction/journalDetails.vue'),
  },
  {
    path: '/weekly',
    name: 'weekly',
    component: () => import('../views/construction/weekly.vue'),

  },
  {
    path: '/monthlyRep',
    name: 'monthlyRep',
    component: () => import('../views/construction/monthlyRep.vue'),
  },
  {
    path: '/photoArchives',
    name: 'photoArchives',
    component: () => import('../views/construction/photoArchives.vue'),
  },
  {
    path: '/modelInteraction',
    name: 'modelInteraction',
    component: () => import('../views/construction/modelInteraction.vue'),
  },
]
// 项目管理
const project = [
  {
    path: '/project',
    name: 'project',
    component: () => import('../views/project'),
  },
  {
    path: '/ndpProManage',
    name: 'ndpProManage',
    component: () => import('../views/project/ndpProManage.vue'),
  },
  {
    path: '/taskManage',
    name: 'taskManage',
    component: () => import('../views/project/taskManage.vue'),
  },

  {
    path: '/wallChart2',
    name: 'wallChart2',
    component: () => import('../views/project/wallChart2.vue'),
  }
]

// 数据管理
const data = [
  {
    path: '/data',
    name: 'data',
    component: () => import('../views/data'),
  },
  {
    path: '/model',
    name: 'model',
    component: () => import('../views/data/model.vue'),
  },

  {
    path: '/media',
    name: 'media',
    component: () => import('../views/data/media.vue'),
  },
  {
    path: '/waste',
    name: 'waste',
    component: () => import('../views/data/waste.vue'),
  },
  {
    path: '/retirementDeclaration',
    name: 'retirementDeclaration',
    component: () => import('../views/data/retirementDeclaration.vue'),
  },
  {
    path: '/projectPersonnel',
    name: 'projectPersonnel',
    component: () => import('../views/data/projectPersonnel.vue'),
  },
  {
    path: '/operateLog',
    name: 'operateLog',
    component: () => import('../views/data/operateLog.vue'),
  },
  {
    path: '/threeModel',
    name: 'threeModel',
    component: () => import('../views/data/threeModel.vue')
  },
  {
    path: '/workflow',
    name: 'workflow',
    component: () => import('../views/data/workflow.vue'),
  },
  {
    path: '/retireCost',
    name: 'retireCost',
    component: () => import('../views/data/retireCost.vue'),
  },
  {
    path: '/parameter',
    name: 'parameter',
    component: () => import('../views/data/parameter.vue'),
  },
  {
    path: '/laborCost',
    name: 'laborCost',
    component: () => import('../views/data/laborCost.vue'),
  },

  {
    path: '/user',
    name: 'user',
    component: () => import('../views/data/user.vue'),
  },
  {
    path: '/roles',
    name: 'roles',
    component: () => import('../views/data/roles.vue'),
  },
  {
    path: '/path',
    name: 'path',
    component: () => import('../views/data/path.vue'),
  },
  {
    path: '/department',
    name: 'department',
    component: () => import('../views/data/department.vue'),
  },
  // 分类管理
  {
    path: '/knowledgeCategory',
    name: 'knowledgeCategory',
    component: () => import('../views/data/knowledgeCategory.vue'),
  },
  // 场景数据
  {
    path: '/sceneData',
    name: 'sceneData',
    component: () => import('../views/data/sceneData.vue'),
  },
  {
    path: '/camera',
    name: 'camera',
    component: () => import('../views/data/camera.vue'),
  },
]

export const dynamicRoutes = technology.concat(project, construction, data)

const originalPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return originalPush.call(this, to).catch(err => err)
}
const VueRouterReplace = Router.prototype.replace
Router.prototype.replace = function replace(to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}



