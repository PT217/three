<template>
  <div class="container">
    <div class="content">
      <div class="img">
      </div>
      <el-form ref="form" :model="form" :rules="rules" class="login-container">
        <div class="logo">账号登录</div>
        <el-form-item prop="accountName">
          <el-input type="text" v-model="form.accountName" auto-complete="off" placeholder="账号"
            prefix-icon="el-icon-user"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off" placeholder="密码" show-password
            prefix-icon="el-icon-lock"></el-input>
        </el-form-item>

        <el-checkbox class="remember" v-model="rememberpwd">记住密码</el-checkbox>
        <el-form-item>
          <el-button type="primary" class="loginBtn" @click="submit" :loading="logining">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { setCookie, getCookie, delCookie } from "../../utils/cookie";
import { accountLogin } from "../../utils/api";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      //定义loading默认为false
      logining: false,
      // 记住密码
      rememberpwd: false,
      form: {
        //username和password默认为空
        accountName: "",
        password: "",
      },
      //rules前端验证
      rules: {
        accountName: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  // 创建完毕状态(里面是操作)
  created() {

    this.setState({ link: "/home" })
    this.getuserpwd();
  },
  // 里面的函数只有调用才会执行
  methods: {
    ...mapMutations(["setState"]),
    // 获取用户名密码
    getuserpwd() {
      if (getCookie("user") != "" && getCookie("pwd") != "") {
        this.form.accountName = getCookie("user");
        this.form.password = getCookie("pwd");
        this.rememberpwd = true;
      }
    },

    //获取info列表
    submit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.logining = true;
          const params = new URLSearchParams(); // 创建对象
          params.append("accountName", this.form.accountName); // 封装对象
          params.append("password", this.form.password);
          console.log(params);


          let res = await accountLogin(params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });
          if (res) {

            localStorage.setItem("token", res.data.data);
            this.$store.dispatch("FETCH_PERMISSION").then(() => {
              this.$router.replace({ path: "/home" });
            });

            if (this.rememberpwd) {
              //保存帐号到cookie，有效期7天
              setCookie("user", this.form.accountName, 7);
              //保存密码到cookie，有效期7天
              setCookie("pwd", this.form.password, 7);
            } else {
              delCookie("user");
              delCookie("pwd");
            }
          }
          setTimeout(() => {
            this.logining = false;
          }, 1000);

        } else {
          this.$message({
            offset: 170,
            duration: "1000",
            message: "请输入用户名密码！",
            type: "error",
          });

        }
      });
    },
  },
};
</script>

<style scoped>
.container {
  box-sizing: border-box;
  width: 100%;
  height: 100% !important;
  position: absolute;
  top: 0px;
  min-width: 1400px;
}

.content {
  display: flex;
  justify-content: space-between;
  height: 100%;
}

.login-container {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-sizing: border-box;
}

.el-form>div {
  width: 70%;
}

.img {
  width: 70%;
  height: 100%;
  background-image: url("../../assets/common/dlbg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

.img>img {
  position: relative;
  width: 300px;
  height: 50px;
  left: 70px;
  top: 5%;
}

.logo {
  color: #333;
  font-size: 20px;
  text-align: center;
  margin-bottom: 50px;
}

.remember {
  margin-bottom: 35px;
  position: relative;
  left: -27%;
}

.loginBtn {
  margin-bottom: 50px;
  width: 100%;
}
</style>