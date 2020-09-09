import { $, domRemove } from "./../dom.js";
import DesktopTopBar, { DesktopGetUserInfo } from "./header.js";
import DesktopAppMenus from "./application.js";
import DesktopBottomBar from "./bottomBar.js";
import DesktopBg from "./background.js";
import "./style/index.scss";
let config = {};

// 创建
function create() {
  Object.assign(this, config, this.options);
  this.$body = $(document.body);
  domRemove("#twin_layout");
  this.$loadContainer = $(
    `<div id="twin_layout" class="twin_desktop_style_default"></div>`
  );
  this.applicationMax = 20;
  this.$body.append(this.$loadContainer);
  // 网站宽度
  this.clientWidth = document.documentElement.clientWidth;
  // 网站高度
  this.clientHeight = document.documentElement.clientHeight;
  let userAgentInfo = navigator.userAgent;
  let mobileAgents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  let mobile_flag = false;
  //根据userAgent判断是否是手机
  for (let v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobile_flag = true;
      break;
    }
  }
  // 是否是手机模式
  if (mobile_flag) {
    this.mobile = true;
    this.$loadContainer.addClass("twin_desktop_mobile");
  } else {
    this.mobile = false;
    // 添加底部菜单
    DesktopBottomBar(this);
  }
  // 添加背景
  DesktopBg(this);
  // 添加顶部
  DesktopTopBar(this);
  // 添加用户信息
  DesktopGetUserInfo(this);
  // 桌面APP
  DesktopAppMenus(this);
  // 关闭点击菜单
  document.body.onclick = (e) => {
    if (this.mobile) {
      if (this.userInfoElemShow) {
        this.$userInfoElemMenu.css("opacity", 0).css("transform", "scale(0)");
        this.userInfoElemShow = false;
      }
    } else {
      this.$clickMenu.hide();
    }
    e.stopPropagation();
  };
}
export default create;
