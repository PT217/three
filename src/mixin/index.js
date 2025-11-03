/*
 * @Author: PengTao mj19983171995@icloud.com
 * @Date: 2022-10-25 11:28:41
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @LastEditTime: 2023-02-08 09:40:40
 * @FilePath: /NDP/chengwei/src/mixin/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Nav from '../components/Nav'
import Tab from '../components/Tab'
import Dialog from "../components/Dialog";
export const mixins = {
  data() {
    return {
      tableData: [],
      loading: true,
    };
  },
  components: {
    Nav,
    Tab,
    Dialog
  },
  created() {
    this.requestFn();
  },
  methods: {
    handleData(data) {
      if (data) {
        this.tableData = data.data.list;
        this.request.page = data.data.pageNum;
        this.request.limit = data.data.pageSize;
        this.request.total = data.data.total;
      }
      this.loading = false;
    },

    limitChange(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    pageChange(page) {
      this.request.page = page;
      this.requestFn();
    },
    inputFn(e) {
      if (!e) this.requestFn("reset");
    },
    show() {
      if (this.visible) {
        console.log(this.form.structureId);
        if (this.title == "新增" || this.title == "编辑") this.$refs["form"].resetFields();
        console.log(this.form.structureId);
        this.requestFn()
      }
      this.visible = !this.visible;
    },
    responseFn(data) {
      if (data) this.$message({
        offset: 170,
        message: `${this.title}成功`,
        type: "success",
        duration: "1000",
      });
      this.show()
      this.requestFn()
    },
    formErrorFn() {
      this.$message({
        offset: 170,
        message: `未通过校验，请按表单中的提示修改`,
        type: "warning",
        duration: "1000",
      });
    },
    totalFn() {
      this.request.total--;
      if (
        this.request.page > 1 &&
        this.request.total % this.request.limit == 0
      )
        this.request.page--;
    },
    async submit() {

      console.log(this.form);
      switch (this.title) {
        case "删除":
          this.totalFn();
          this.deleteFn().then((res) => {
            // console.log(res);
            // if (res) this.responseFn(res.data)


            this.show()
            // this.requestFn()
          })

          break;
        case "批准":
          this.switchFn().then((res) => {
            // if (res) this.responseFn(res.data)

            this.show()

          })
        default:
          this.$refs["form"].validate(async (valid) => {
            if (valid) {
              if (this.title == "新增") {
                this.add().then((res) => {

                  this.show()

                  // this.requestFn()
                  // if (res) this.responseFn(res.data)
                })
              }
              else this.update().then((res) => {

                this.show()
                // this.requestFn()
                // if (res) this.responseFn(res.data)
              })
            } else this.formErrorFn();
          });
      }
    },
  },
};