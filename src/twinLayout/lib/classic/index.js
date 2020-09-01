import { $ } from "./../dom.js";
import ClassicTopBar, { ClassicGetUserInfo } from "./topBar.js";
import ClassicLeftBar from "./leftBar.js";
import "./index.scss";
let config = {};

// 创建
function create() {
  Object.assign(this, config, this.options);
  this.$body = $(document.body);
  this.$loadContainer = $(`<div name="twin_layout"></div>`);
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
  if (this.clientWidth < 750 || mobile_flag) {
    this.mobile = true;
  } else {
    this.mobile = false;
  }
  ClassicTopBar(this);
  ClassicGetUserInfo(this);
  ClassicLeftBar(this);
  // 关闭点击菜单
  document.body.onclick = (e) => {
    
    e.stopPropagation();
  };
}
export default create;
