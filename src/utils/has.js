/*
 * @Author: PengTao mj19983171995@icloud.com
 * @Date: 2022-09-23 10:48:50
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @LastEditTime: 2022-10-25 17:09:21
 * @FilePath: /NDP/chengwei/src/utils/hasPermission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import store from '../store'
const has = {
  install(Vue, options) {
    Vue.directive('has', {
      inserted: (el, binding) => {
        const currentAction = binding.value.action
        const effect = binding.value.effect
        // 获取到存放在 store 中的权限数据
        let rightArr = store.getters.permissionButtonList
        // console.log(rightArr);
        // 判断是否存在对应的按钮权限
        let item = rightArr.filter((item) => item === currentAction)
        //不具备权限则删除（隐藏）或者禁用该按钮 (el.parentNode 获取当前节点的父节点),根据在芫荽绑定的值去决定
        if (item.length === 0) {
          if (effect === 'disabled') {
            el.disabled = true
            el.classList.add('is-disabled')
          } else {
            (el.parentNode && el.parentNode.removeChild(el)) ||
              (el.style.display = "none");
          }
        }
      }
    });
  }
}
export default has;
