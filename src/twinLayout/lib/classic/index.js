import { $ , domRemove} from "./../dom.js";
import ClassicTopBar, { ClassicGetUserInfo } from "./topBar.js";
import ClassicLeftBar from "./leftBar.js";
import "./index.scss";
let config = {};
// 创建窗口容器
function ClassicWindowContainer(options) { 
  options.$windowContainer = $(`<div class="twin_classic_window_container"></div>`);
  options.$loadContainer.append(options.$windowContainer);
}

// 创建
function create() {
  Object.assign(this, config, this.options);
  this.$body = $(document.body);
  domRemove("#twin_layout");
  this.$loadContainer = $(`<div id="twin_layout"></div>`);
  this.$body.append(this.$loadContainer);
  // 网站宽度
  this.clientWidth = document.documentElement.clientWidth;
  // 网站高度
  this.clientHeight = document.documentElement.clientHeight;
  // 菜单模式
  this.mode = "left";
  // 菜单折叠
  this.menuFold = false;
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
    this.$loadContainer.addClass("twin_classic_mobile");
  } else {
    this.mobile = false;
  }
  ClassicTopBar(this);
  ClassicGetUserInfo(this);
  ClassicWindowContainer(this);
  ClassicLeftBar(this);
  // 关闭点击菜单
  document.body.onclick = (e) => {
    if (this.mobile) {
      if (this.userInfoElemShow) {
        this.$userInfoElemMenu.css("opacity", 0).css("transform", "scale(0)");
        this.userInfoElemShow = false;
      }
      if (this.navBarOperatingShow) { 
        this.$navBarOperatingContainerElem.css("opacity", 0).css("transform", "scale(0)");
        this.navBarOperatingShow = false;
      }
    }
    e.stopPropagation();
  };
}
export default create;
