
/*
 * @Author: your name
 * @Date: 2022-03-12 13:51:23
 * @LastEditTime: 2022-09-23 14:11:32
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /one/swbpm-view/src/utils/util.js
 */
/**
 * 设置cookie
 **/
function setCookie(name, value, day) {
    let date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
};

/**
 * 获取cookie
 **/
function getCookie(name) {
    let reg = RegExp(name + '=([^;]+)');
    let arr = document.cookie.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
};

/**
 * 删除cookie
 **/

function delCookie(name) {
    setCookie(name, null, -1);
};


export {
    setCookie,
    getCookie,
    delCookie,
}