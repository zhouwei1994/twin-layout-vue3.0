<template>
  <div id="twinLayout"></div>
</template>
<script>
import twin from "@/twinLayout/index";
import { createApp } from "vue";
import store from "./../store";
import { mapMutations } from "vuex";
export default {
  name: "Home",
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    let twinLayout = new twin("#twinLayout", {
      title: "双生桌面",
      logo: "http://qiniu.jping.ren/file/files/2020-06/15921923362629yg2lg49",
      userInfo: {
        avatar:
          "http://qiniu.jping.ren/file/files/2020-06/15921923362629yg2lg49",
        nickname: "子不语",
      },
      userMenus: [
        {
          icon: "&#xe60a;",
          fontFamily: "iconfont",
          type: "icon",
          name: "个人中心",
          onclick: function() {
            console.log("个人中心");
          },
        },
        {
          icon: "&#xe60c;",
          fontFamily: "iconfont",
          type: "icon",
          name: "退出",
          topLine: true,
          onclick: function() {
            console.log("退出");
          },
        },
      ],
      background: [
        "http://qn.kemean.cn/upload/202008/21/Image.png",
        "http://qn.kemean.cn/upload/202008/21/Image2.png",
        "http://qn.kemean.cn/upload/202008/21/Image3.png",
        "http://qn.kemean.cn/upload/202008/21/Image4.png",
        "http://qn.kemean.cn/upload/202008/21/Image5.png",
        "http://qn.kemean.cn/upload/202008/21/Image6.png",
        "http://qn.kemean.cn/upload/202008/21/Image7.png",
        "http://qn.kemean.cn/upload/202008/21/Image8.png",
        "http://qn.kemean.cn/upload/202008/21/Image9.png",
        "http://qn.kemean.cn/upload/202008/21/Image10.png",
        "http://qn.kemean.cn/upload/202008/21/Image11.png",
        "http://qn.kemean.cn/upload/202008/21/Image12.png",
        "http://qn.kemean.cn/upload/202008/21/Image13.png",
        "http://qn.kemean.cn/upload/202008/21/Image14.png",
        "http://qn.kemean.cn/upload/202008/21/Image15.png",
      ],
      menus: (callbcak) => {
        callbcak([
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "用户列表",
            name: "userList",
            type: "vue",
            hidden: false,
            openMore: false,
            path: "views/userList",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
          {
            icon:
              "http://qiniu.jping.ren/file/files/2020-08/15981660900525rmwdk7zth.png",
            title: "关于我们",
            name: "home",
            type: "vue",
            hidden: false,
            openMore: true,
            path: "views/about",
          },
        ]);
      },
    });
    let componentData = [];
    // 窗口关闭
    twin.prototype.remove = (data) => {
      //注销vue组件
      componentData[data.el].unmount();
    };
    // 窗口打开
    twin.prototype.open = (data) => {
      // data.onHide = function() {
      //   console.log("------------345353543534");
      // };
      let page = require("@/" + data.path);
      console.log(page.default);
      data.onHide = page.default.onHide;
      data.onShow = page.default.onShow;
      let component = createApp(page.default);
      // 挂载组件
      component.use(store).mount(data.el);
      componentData[data.el] = component;
    };
    twinLayout.create();
    setTimeout(() => {
      this.setUserInfo({ token: 111111111111 });
    }, 3000);
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
  },
};
</script>

<style lang="scss" scoped></style>
