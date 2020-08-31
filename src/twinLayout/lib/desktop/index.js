import { $ } from "./../dom.js";
import DesktopWindow, { allMin, allShow } from "./window.js";
import "./index.scss";
import { Math } from "core-js";
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
  if (options.mobile) { 
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
// 桌面图标
function DesktopApp(options, res) {
  let appWidth = 100;
  let appInterval = 20;
  let column = 0;
  let row = 0;
  let currentIndex = 0;
  let maxHeight = options.clientHeight - 80;
  if (options.mobile) { 
    maxHeight = options.clientHeight - 40;
    appWidth = options.clientWidth / 4;
    let maxRow = parseInt(maxHeight / appWidth);
    appInterval = (maxHeight - maxRow * appWidth) / maxRow;
  }
  let $appContainer = $(`<div class="twin_desktop_app_container"></div>`);
  let $appContainerView = $(`<div class="twin_desktop_app_container_view"></div>`);
  let $appContainerUl = $(`<div class="twin_desktop_app_container_ul"></div>`);
  if (res && Array.isArray(res) && res.length > 0) {
    res.forEach((item) => {
      let top = 0;
      let left = 0;
      if (options.mobile) {
        top = row * appWidth + appInterval * row;
        left = currentIndex * appWidth;
      } else {
        top = appInterval * currentIndex + appWidth * currentIndex;
        left = appWidth * column;
      }
      let $elem = $(`<div class="twin_desktop_app_item" style="top:${top}px;left:${left}px;width:${appWidth}px;height:${appWidth}px;">
            <i class="twin_desktop_app_item_icon" style="background-image: url(${
              item.icon
            });"></i>
            <span class="twin_desktop_app_item_text">${item.title}</span>
        </div>`);
      currentIndex += 1;
      if (options.mobile) { 
        $appContainerUl.append($elem);
        if (left + appWidth * 2 > options.clientWidth) {
          currentIndex = 0;
          row += 1;
          if (top + (appWidth + appInterval) * 2 > maxHeight) {
            column += 1;
            row = 0;
            $appContainerView.append($appContainerUl);
            $appContainerUl = $(`<div class="twin_desktop_app_container_ul"></div>`);
          }
        }
      } else {
        if (top + (appWidth + appInterval) * 2 > maxHeight) {
          column += 1;
          currentIndex = 0;
        }
        $appContainerUl.append($elem);
      }
      $elem.on("click", function() {
        new DesktopWindow(options, item);
      });
    });
    $appContainerView.append($appContainerUl);
    $appContainer.append($appContainerView);
    options.$loadContainer.append($appContainer);
    if (options.mobile) { 
      let startX = 0;
      let translateX = 0;
      let maxWidth = column * options.clientWidth;
      //手指接触屏幕
      $appContainerView.on("touchstart", e => {
        startX = e.touches[0].pageX;
      });
      //手指滑动屏幕
      $appContainerView.on("touchmove", e => {
        let interval = e.touches[0].pageX - startX;
        let result = translateX + interval;
        if (translateX + interval > 0) { 
          result = 0;
        } else if (translateX + interval < -maxWidth){
          result = -maxWidth;
        }
        $appContainerView.css("transform", "translateX(" + result + "px)").css("transition", "all 0s");
      });
      //手指离开屏幕
      $appContainerView.on("touchend", e => {
        let interval = e.changedTouches[0].pageX - startX;
        let intervalAbs = Math.abs(interval);
        if (intervalAbs >= options.clientWidth / 4) {
          if (interval > 0) { 
            translateX += options.clientWidth;
          } else {
            translateX -= options.clientWidth;
          }
          if (translateX > 0) {
            translateX = 0;
          } else if (translateX < -maxWidth) { 
            translateX = -maxWidth;
          }
        }
        $appContainerView.css("transform", "translateX(" + translateX + "px)").css("transition", "all 0.4s");
      });
    }
  } else {
    alert("【twin-layout】至少要有一个菜单");
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
// 创建顶部导航
function DesktopTopBar(options) {
  let $topBar = $(`<div class="twin_desktop_top_bar"></div>`);
  let leftHtml = `<div class="twin_desktop_top_bar_left">`;
  if (!options.mobile) { 
    if (options.logo) {
      leftHtml += `<img class="twin_desktop_top_bar_logo" src="${options.logo}"/>`;
    }
    leftHtml += `<span class="twin_desktop_top_bar_title">${options.title ||
      "双生布局"}</span>`;
  }
  leftHtml += `</div>`;
  let $leftInfo = $(leftHtml);
  options.$rightInfo = $(`<div class="twin_desktop_top_bar_right"></div>`);
  
  let $notice = $(`<div class="twin_desktop_top_bar_operating">
      <a class="twin_desktop_top_bar_operating_btn" title="通知消息">
        <i class="twin_desktop_icon_notice"></i>
        <span class="twin_desktop_top_bar_operating_dot">+99</span>
      </a>
    </div>`);
  options.$rightInfo
    .append($notice);
  $topBar.append($leftInfo).append(options.$rightInfo);
  options.$loadContainer.append($topBar);
  if (!options.mobile) { 
    let $browserScreen = $(`<div class="twin_desktop_top_bar_operating">
      <a class="twin_desktop_top_bar_operating_btn" title="全屏">
        <i class="twin_desktop_icon_browser_screen"></i>
      </a>
    </div>`);
    let $language = $(`<div class="twin_desktop_top_bar_operating">
      <a class="twin_desktop_top_bar_operating_btn" title="语言选择">
        <i class="twin_desktop_icon_language"></i>
        <i class="twin_desktop_icon_arrow"></i>
      </a>
    </div>`);
    options.$rightInfo.append($browserScreen)
      .append($language);
    // 是否全屏
    let fullScreen = false;
    let el = undefined;
    let rfs = undefined;
    let cfs = undefined;
    $browserScreen.on("click", function() {
      if (fullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        if (typeof cfs != "undefined" && cfs) {
          cfs.call(el);
        }
        fullScreen = false;
      } else {
        el = document.documentElement;
        rfs =
          el.requestFullScreen ||
          el.webkitRequestFullScreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
          rfs.call(el);
        }
        fullScreen = true;
      }
    });
  }
}
// 用户信息
function DesktopGetUserInfo(options) {
  if (options.userInfo) {
    if (typeof options.userInfo === "function") {
      options.userInfo(function(data) {
        DesktopUserInfo(options, data);
      });
    } else if (typeof options.userInfo === "object") {
      DesktopUserInfo(options, options.userInfo);
    } else {
      console.error(
        "【twin-layout】userInfo数据类型不正确，应为function、object"
      );
    }
  } else {
    DesktopUserInfo(options, {
      avatar: "",
      nickname: "游客",
    });
  }
}
function DesktopUserInfo(options, data) {
  let html = `<div class="twin_desktop_top_bar_operating">
  <a class="twin_desktop_top_bar_user_info twin_desktop_top_bar_operating_btn" href="javascript:void(0)">
    <img class="twin_desktop_top_bar_avatar" src="${data.avatar}"/>
    <span class="twin_desktop_top_bar_nickname">${data.nickname}</span>
  <i class="twin_desktop_icon_arrow"></i></a></div>`;
  let $userInfoElem = $(html);
  options.$userInfoElemMenu = $(
    `<div class="twin_desktop_top_bar_operating_menu"></div>`
  );
  let $theme = $(`<div class="twin_desktop_click_menu_item">
    <i class="twin_desktop_icon_theme"></i>
    <span>主题</span>
  </div>`);
  options.$userInfoElemMenu.append($theme);
  if (options.mobile) {
    let userInfoElemShow = false;
    $userInfoElem.children().get(0).on("click", (e) => {
      if (userInfoElemShow) {
        options.$userInfoElemMenu.css("opacity", 0).css("transform", "scale(0)");
        options.userInfoElemShow = false;
      } else {
        options.$userInfoElemMenu.css("opacity", 1).css("transform", "scale(1)");
        options.userInfoElemShow = true;
      }
      e.stopPropagation();
      e.preventDefault();
    });
    let $browserScreen = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_desktop_icon_browser_screen"></i>
      <span>全屏</span>
    </div>`);
    let $language = $(`<div class="twin_desktop_click_menu_item">
        <i class="twin_desktop_icon_language"></i>
        <span>语言选择</span>
    </div>`);
    options.$userInfoElemMenu.append($browserScreen).append($language);
    // 是否全屏
    let fullScreen = false;
    let el = undefined;
    let rfs = undefined;
    let cfs = undefined;
    $browserScreen.on("click", function () {
      if (fullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        if (typeof cfs != "undefined" && cfs) {
          cfs.call(el);
        }
        fullScreen = false;
      } else {
        el = document.documentElement;
        rfs =
          el.requestFullScreen ||
          el.webkitRequestFullScreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
          rfs.call(el);
        }
        fullScreen = true;
      }
    });
  }

  if (
    options.userMenus &&
    Array.isArray(options.userMenus) &&
    options.userMenus.length > 0
  ) {
    options.userMenus.forEach((item) => {
      let menuItemHtml = `<div class="twin_desktop_click_menu_item ${
        item.topLine ? "twin_desktop_click_menu_item_line" : ""
      }">`;
      if (item.type == "icon") {
        if (item.fontFamily) {
          menuItemHtml += `<i style="font-family: '${item.fontFamily}';">${item.icon}</i>`;
        } else {
          menuItemHtml += `<i>${item.icon}</i>`;
        }
      } else if (item.type == "image") {
        menuItemHtml += `<img class="twin_desktop_icon_garden_close" src="${item.icon}" />`;
      }
      menuItemHtml += `<span>${item.name || "未定义"}</span></div>`;
      let $userInfoElemMenuItem = $(menuItemHtml);
      options.$userInfoElemMenu.append($userInfoElemMenuItem);
      $userInfoElemMenuItem.on("click", function() {
        item.onclick && item.onclick();
      });
    });
  }
  $userInfoElem.append(options.$userInfoElemMenu);
  options.$rightInfo.append($userInfoElem);
}
// 创建
function create() {
  Object.assign(this, config, this.options);
  // var _this = this;
  this.$loadContainer = $(this.loadContainer);
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
