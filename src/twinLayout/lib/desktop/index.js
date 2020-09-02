import { $, domRemove } from "./../dom.js";
import  { allMin, allShow } from "./window.js";
import DesktopTopBar, { DesktopGetUserInfo } from "./topBar.js";
import DesktopAppMenus from "./application.js";
import "./index.scss";
let config = {};
let defaultBackground = "http://api.iehu.cn/Image.php?type=2";
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
    DesktopBgContainer(options, undefined);
  }
} 
function DesktopBgContainer(options, background) {
  let backgroundUrl = defaultBackground;
  let backgroundLength = 2;
  let index = 0;
  if (background) { 
    backgroundLength = background.length;
    index = Math.floor(Math.random() * backgroundLength);
    backgroundUrl = background[index];
  }
  
  let $bgElem = $(
    `<div class="twin_desktop_bg" style="background-image: url(${backgroundUrl});"></div>`
  );
  // let $bgImageElem = $(
  //   `<img class="twin_desktop_bg_image" src="${backgroundUrl}"/>`
  // );
  // $bgElem.append($bgImageElem);
  options.$loadContainer.append($bgElem);
  if (!options.mobile && backgroundLength > 1) { 
    let $switchBgElem = $('<div class="twin_desktop_bg_switch" />');
    $bgElem.append($switchBgElem);
    $switchBgElem.on("click", function () {
      if (background) { 
        index = Math.floor(Math.random() * backgroundLength);
        backgroundUrl = background[index];
      } else {
        backgroundUrl = defaultBackground + "?t=" + new Date().getTime();
      }
      let img = new Image();
      img.onload = function () {
        // $bgImageElem.attr("src", backgroundUrl);
        $bgElem.css(
          "background-image",
          "url('" + backgroundUrl + "');\"></div>"
        );
      };
      img.src = backgroundUrl;
    });
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
    allMin(options);
  });
  $bottomBarDesktopLeft.on("click", () => {
    allMin(options);
  });
  $bottomBarDesktopMenuMinRight.on("click", () => {
    allMin(options);
  });
  $bottomBarDesktopMenuMinLeft.on("click", () => {
    allMin(options);
  });
  $bottomBarDesktopMenuShowRight.on("click", () => {
    allShow(options);
  });
  $bottomBarDesktopMenuShowLeft.on("click", () => {
    allShow(options);
  });
  
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
