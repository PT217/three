import Vue from 'vue'
import Vuex, { Store } from 'vuex'

// import 'element-ui/lib/theme-chalk/index.css'

import './styles/theme/index.css'
import ElementUI from 'element-ui'
// import '@/styles/index.less'
import App from './App'
import router from './router'
import _ from "lodash";
import store from './store'
import 'nprogress/nprogress.css'
import { dynamicRoutes } from '../src/router/index'
import has from '../src/utils/has'

Vue.config.productionTip = false
Vue.use(ElementUI)
  .use(Vuex)
  .use(has)


export const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// return
//实现菜单权限管理

let permissionPathList = store.getters.permissionPathList

if (permissionPathList?.length) {
  dynamicRoutes.map(item => {
    if (permissionPathList.includes(item.path)) {
      router.addRoute(item);
    }
  })
}
router.beforeEach((to, from, next) => {
  if (!localStorage.getItem("token")) {   //TODO只这样判断token会不会有问题？
    if (to.name == "login" || store.state.whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/' })
    }
  } else {
    if (store.getters.permissionPathList.includes(to.path) || store.state.whiteList.includes(to.path)) {
      console.log('进');
      next()
    } else {
      next({ path: "/404" })
    }
  }
})

