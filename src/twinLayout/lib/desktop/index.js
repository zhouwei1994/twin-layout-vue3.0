import { $ } from "./../dom.js";
import  { allMin, allShow } from "./window.js";
import DesktopTopBar, { DesktopGetUserInfo } from "./topBar.js";
import DesktopApp from "./application.js";
import "./index.scss";
let config = {};
// 桌面背景
function DesktopBg(options) {
  if (options.background) {
    if (typeof options.background === "function") {
      options.background(function(data) {
        DesktopBgContainer(options, data);
      });
    } else if (
      Array.isArray(options.background) &&
      options.background.length > 0
    ) {
      DesktopBgContainer(options, options.background);
    } else if (typeof options.background === "string") {
      DesktopBgContainer(options, [options.background]);
    } else {
      console.error(
        "【twin-layout】background数据类型不正确，应为function、array、string"
      );
    }
  } else {
    DesktopBgContainer(options, [
      "http://qn.kemean.cn/upload/202008/21/Image.png",
    ]);
  }
}
function DesktopBgContainer(options, background) {
  let backgroundLength = background.length;
  let index = Math.floor(Math.random() * backgroundLength);
  let $elem = $(
    '<div class="twin_desktop_bg" style="background-image: url(' +
      background[index] +
      ');"></div>'
  );
  options.$loadContainer.append($elem);
  if (!options.mobile) { 
    let $switchBgElem = $('<div class="twin_desktop_bg_switch" />');
    $elem.append($switchBgElem);
    $switchBgElem.on("click", function () {
      let index = Math.floor(Math.random() * backgroundLength);
      let img = new Image();
      img.onload = function () {
        $elem.css(
          "background-image",
          "url('" + background[index] + "');\"></div>"
        );
      };
      img.src = background[index];
    });
  }
}
function DesktopAppMenus(options) {
  if (options.menus) {
    if (typeof options.menus === "function") {
      options.menus(function(data) {
        DesktopApp(options, data);
      });
    } else if (Array.isArray(options.menus) && options.menus.length > 0) {
      DesktopApp(options, options.menus);
    } else {
      console.error("【twin-layout】menus数据类型不正确，应为function、array");
    }
  } else {
    alert("【twin-layout】请添加菜单 menus");
  }
}

// 创建底部菜单
function DesktopBottomBar(options) {
  let $bottomBar = $(`<div class="twin_desktop_bottom_bar"></div>`);
  let $leftOperation = $(
    `<div class="twin_desktop_bottom_bar_operation"></div>`
  );
  let $bottomBarDesktopLeft = $(`<div class="twin_desktop_bottom_bar_desktop">
    <i class="twin_desktop_icon_desktop"></i>
    <span>桌面</span>
  </div>`);
  let $bottomBarDesktopMenuLeft = $(
    `<div class="twin_desktop_bottom_bar_operation_menu twin_desktop_bottom_bar_operation_menu_left"></div>`
  );
  let $bottomBarDesktopMenuMinLeft = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_desktop_icon_min"></i>
      <span>全部最小化</span>   
  </div>`);
  let $bottomBarDesktopMenuShowLeft = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_desktop_icon_unfold"></i>
      <span>全部展开</span>
  </div>`);
  $bottomBarDesktopMenuLeft
    .append($bottomBarDesktopMenuMinLeft)
    .append($bottomBarDesktopMenuShowLeft);
  $leftOperation
    .append($bottomBarDesktopLeft)
    .append($bottomBarDesktopMenuLeft);
  let $rightOperation = $(
    `<div class="twin_desktop_bottom_bar_operation"></div>`
  );
  let $bottomBarDesktopRight = $(`<div class="twin_desktop_bottom_bar_desktop">
    <i class="twin_desktop_icon_desktop"></i>
    <span>桌面</span>
  </div>`);
  let $bottomBarDesktopMenuRight = $(
    `<div class="twin_desktop_bottom_bar_operation_menu twin_desktop_bottom_bar_operation_menu_right"></div>`
  );
  let $bottomBarDesktopMenuMinRight = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_desktop_icon_min"></i>
      <span>全部最小化</span>   
  </div>`);
  let $bottomBarDesktopMenuShowRight = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_desktop_icon_unfold"></i>
      <span>全部展开</span>
  </div>`);
  $bottomBarDesktopMenuRight
    .append($bottomBarDesktopMenuMinRight)
    .append($bottomBarDesktopMenuShowRight);
  $rightOperation
    .append($bottomBarDesktopRight)
    .append($bottomBarDesktopMenuRight);
  options.$bottomBarContainer = $(
    `<div class="twin_desktop_bottom_bar_container"></div>`
  );
  options.$clickMenu = $(
    `<div class="twin_desktop_click_menu" style="display:none;"></div>`
  );
  options.$positionFrame = $(`<div class="twin_desktop_position_frame"></div>`);
  $bottomBar
    .append($leftOperation)
    .append(options.$bottomBarContainer)
    .append($rightOperation);
  options.$loadContainer
    .append($bottomBar)
    .append(options.$clickMenu)
    .append(options.$positionFrame);
  $bottomBarDesktopRight.on("click", () => {
    allMin();
  });
  $bottomBarDesktopLeft.on("click", () => {
    allMin();
  });
  $bottomBarDesktopMenuMinRight.on("click", () => {
    allMin();
  });
  $bottomBarDesktopMenuMinLeft.on("click", () => {
    allMin();
  });
  $bottomBarDesktopMenuShowRight.on("click", () => {
    allShow();
  });
  $bottomBarDesktopMenuShowLeft.on("click", () => {
    allShow();
  });
  
}
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
  // 添加背景
  DesktopBg(this);
  // 是否是手机模式
  if (this.clientWidth < 750 || mobile_flag) {
    this.mobile = true;
    this.$loadContainer.addClass("twin_desktop_mobile");
  } else {
    this.mobile = false;
    // 添加底部菜单
    DesktopBottomBar(this);
  }
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
