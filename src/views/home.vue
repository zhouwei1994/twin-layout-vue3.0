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
    let twinLayout = new twin({
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
      menus: (callbcak) => {
        callbcak([
          {
            name: "userList",
            type: "vue",
            hidden: false,
            openMore: false,
            path: "views/userList",
            meta: {
              icon: "&#xe617;",
              fontFamily: "iconfont",
              iconType: "icon",
              title: "首页",
              color: "red",
              label: "最新"
            },
          },
          {
            name: "userManage",
            meta: {
              icon: "&#xe60a;",
              fontFamily: "iconfont",
              iconType: "icon",
              title: "用户管理",
            },
            children: [
              {
                name: "about",
                type: "vue",
                hidden: false,
                openMore: true,
                path: "views/about",
                meta: {
                  icon: "&#xe60a;",
                  fontFamily: "iconfont",
                  iconType: "icon",
                  title: "用户管理",
                },
              }
            ]
          },
          {
            name: "userManage",
            meta: {
              icon: "&#xe60a;",
              fontFamily: "iconfont",
              iconType: "icon",
              title: "文章管理",
            },
            children: [
              {
                name: "about",
                type: "vue",
                hidden: false,
                openMore: true,
                path: "views/about",
                meta: {
                  icon: "&#xe60a;",
                  fontFamily: "iconfont",
                  iconType: "icon",
                  title: "文章列表",
                },
              },
              {
                name: "userManage",
                meta: {
                  icon: "&#xe60a;",
                  fontFamily: "iconfont",
                  iconType: "icon",
                  title: "用户管理",
                },
                children: [
                  {
                    name: "about",
                    type: "vue",
                    hidden: false,
                    openMore: true,
                    path: "views/about",
                    meta: {
                      icon: "&#xe60a;",
                      fontFamily: "iconfont",
                      iconType: "icon",
                      title: "用户管理",
                    },
                  },
                  {
                name: "userManage",
                meta: {
                  icon: "&#xe60a;",
                  fontFamily: "iconfont",
                  iconType: "icon",
                  title: "用户管理",
                },
                children: [
                  {
                    name: "about",
                    type: "vue",
                    hidden: false,
                    openMore: true,
                    path: "views/about",
                    meta: {
                      icon: "&#xe60a;",
                      fontFamily: "iconfont",
                      iconType: "icon",
                      title: "用户管理",
                    },
                  }
                ]
              },
                ]
              },
            ]
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
