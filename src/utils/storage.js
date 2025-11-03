/*
 * @Author: PengTao mj19983171995@icloud.com
 * @Date: 2022-09-23 14:05:10
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @LastEditTime: 2022-09-23 14:08:20
 * @FilePath: /NDP/chengwei/src/utils/storage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function getParseItem(key) {
  try {
    const storage = localStorage.getItem(key);
    return JSON.parse(storage);
  } catch (e) {
    return null;
  }
}

function getItem(key) {
  return getParseItem(key);
}

function setItem(key, value) {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export default {
  getItem,
  setItem
};
