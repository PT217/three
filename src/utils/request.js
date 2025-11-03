/*
 * @Author: your name
 * @Date: 2022-03-12 13:51:23
 * @LastEditTime: 2023-06-07 17:20:47
 * @LastEditors: lichen 917099259@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /one/swbpm-view/src/utils/http.js
 */
import axios from "axios";
import Nprogress from 'nprogress'
import { vm } from '../main'
// default
// export const http = 'http://10.95.11.219:8181/'

// local
// export const http = 'http://127.0.0.1:8181'

// yxc
export const http = 'http://192.168.31.122:8181/'

// hyc
// export const http = 'http://192.168.31.151:8181/'

// hx
// export const http = 'http://192.168.31.10:8181/'


export const instance = axios.create({
    baseURL: http,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 200000
});

export const get = (url, params, options) => instance({
    method: 'GET',
    url: url,
    params,
    ...options
});

export const post = (url, params, options) => instance({
    method: 'POST',
    url: url,
    data: params,
    ...options
});

export const put = (url, params, options) => instance({
    method: 'PUT',
    url: url,
    data: params,
    ...options
});

export const $delete = (url, params, options) => instance({
    method: 'DELETE',
    url: url,
    params: params,
    ...options
});

const handleError = error => {
    const msg = error.response?.data?.errmsg || error.response?.data?.message || error.message || '';
    console.log(msg);
    if (msg.includes('timeout')) {
        vm.$message({
            offset: 170,
            duration: "1000",
            message: '网络连接超时',
            type: "error",
        });
        Nprogress.done()
        return
    }

    if (msg.includes('404')) {
        vm.$router.replace({ path: '/404' })
        Nprogress.done()
        return
    }

    if (msg.includes('Network Error')) {
        vm.$message({
            offset: 170,
            message: '网络错误',
            type: "error",
            duration: "1000",
        });
        Nprogress.done()
        setTimeout(() => {
            vm.$router.push({ name: 'login' });
            window.localStorage.clear();
            window.addEventListener(
                "popstate",
                function (e) {
                    history.pushState(null, null, document.URL);
                },
                false
            );
        })
        return
    }
    return Promise.reject(msg);
};
//请求拦截，在请求头中添加token
instance.interceptors.request.use(config => {
    Nprogress.start()
    if (localStorage.getItem("token")) {
        // const url = config.url.replace(config.baseURL, '')
        // if (whiteUrl.some(wl => url === wl)) {
        //     return config
        // }
        config.headers.token = localStorage.getItem('token')
    }
    return config
})
// 响应拦截
instance.interceptors.response.use(res => {
    if (res.config.responseType == 'blob') {
        console.log(res);
        Nprogress.done()
        if (res.data.size) return res;
        else vm.$message({
            offset: 170,
            message: "导出失败",
            type: "error",
            duration: "1000",
        });
        return
    }
    //服务响应时完成进度条
    Nprogress.done()
    switch (res.data.code) {

        case 605:
        case 607:
            vm.$message({
                offset: 170,
                message: res.data.message,
                type: "error",
                duration: "1000",
            });
            break;
        case 612:
            vm.$message({
                offset: 170,
                message: "退出登录",
                type: "success",
                duration: "1000",
            });
            break;
        case 613:
            vm.$message({
                offset: 170,
                message: '你的账号已在另一台设备登录已被迫下线',
                type: "error",
                duration: "1000",
            });
            break
        case 200:
            if (res.data.data === null) {
                vm.$message({
                    offset: 170,
                    message: '操作完成',
                    type: "success",
                    duration: "1000",
                });
                return
            }
            return res;
        default:
            vm.$message({
                offset: 170,
                message: res.data.message,
                type: "error",
                duration: "1000",
            });
            return
    }

    setTimeout(() => {
        console.log('清');
        vm.$router.push({ name: 'login' });
        window.localStorage.clear();
        window.addEventListener(
            "popstate",
            function (e) {
                history.pushState(null, null, document.URL);
            },
            false
        );
    })
}, handleError)