import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { accountGetLoginUserInfo, roleDecideSuperRole, backLogGetLeaderAndRole } from '../utils/api'
import router, { dynamicRoutes } from '@/router/index'

const store = new Vuex.Store({
    state: {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        account: JSON.parse(localStorage.getItem('account')),//用户角色
        link: JSON.parse(localStorage.getItem('link')) || '/home',
        avatar: '',//头像
        // 不用登录可以访问的列表
        whiteList: ['/login', '/home', '/test', '/404', '/modelInteraction', '/camera', '/sceneEdit', '/test2'],
        // 本地搜素
        name: '',
        skyValue: localStorage.getItem('skyValue') || 'white'

    },
    getters: {
        link: (state) => state.link,
        userInfo: (state) => state.userInfo,
        permissionPathList: (state) => state.userInfo?.permList.filter(item => item.type == 'm').map(item => item.link),
        permissionButtonList: (state) => state.userInfo?.permList.filter(item => item.type == 'a').map(item => item.link),

    },
    mutations: {
        setState(state, payload) {
            Object.keys(payload).forEach(key => {
                state[key] = payload[key]
                localStorage.setItem(`${key}`, JSON.stringify(payload[key]))
            });
        },

        setName(state, payload) {
            state.name = payload
        },
        setSkyValue(state, payload) {
            state.skyValue = payload
            localStorage.setItem('skyValue', payload)
        }
    },
    actions: {
        async FETCH_PERMISSION(store) {
            let res = await accountGetLoginUserInfo()
            console.log(res);
            if (res) store.commit('setState', { userInfo: res.data.data })
            dynamicRoutes.map(item => {
                if (store.getters.permissionPathList.includes(item.path)) router.addRoute(item)
            })
        },
        async FETCH_ACCOUNT({ commit, state }) {
            const res1 = await roleDecideSuperRole({ token: localStorage.getItem('token') })
            if (res1 && res1.data.data) return commit('setState', { account: true })
            const res2 = await backLogGetLeaderAndRole({ conductId: localStorage.getItem('finalSchemeId') })
            console.log(res2.data.data);
            if (res2) commit('setState', { account: res2.data.data.leader })
        },
    }
})

export default store