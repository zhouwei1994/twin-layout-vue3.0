import { $ } from "./../dom.js";
import { allRemove, otherRemove, leftRemove, rightRemove } from "./window.js";
export default function ClassicTopBar(options) {
  let $topBar = $(`<div class="twin_classic_top_bar"></div>`);
  ClassicHeader(options, $topBar);
  ClassicNavBar(options, $topBar);
  options.$loadContainer.append($topBar);
  options.$topBarMask = $(`<div class="twin_classic_mask"></div>`);
  options.$loadContainer.append(options.$topBarMask);
  options.$topBarMask.on("click", function() {
    options.$loadContainer.removeClass("twin_classic_menu_fold");
    options.menuFold = false;
    if (options.mobile) {
      setTimeout(() => {
        options.$topBarMask.hide();
      }, 300);
    }
  });
}
// 用户信息
export function ClassicGetUserInfo(options) {
  if (options.userInfo) {
    if (typeof options.userInfo === "function") {
      options.userInfo(function(data) {
        ClassicUserInfo(options, data);
      });
    } else if (typeof options.userInfo === "object") {
      ClassicUserInfo(options, options.userInfo);
    } else {
      console.error(
        "【twin-layout】userInfo数据类型不正确，应为function、object"
      );
    }
  } else {
    ClassicUserInfo(options, {
      avatar: "",
      nickname: "游客",
    });
  }
}
function ClassicUserInfo(options, data) {
  let html = `<div class="twin_classic_header_operating">
  <div class="twin_classic_header_user_info twin_classic_header_operating_btn" href="javascript:void(0)">
    <img class="twin_classic_header_avatar" src="${data.avatar}"/>
    <span class="twin_classic_header_nickname">${data.nickname}</span>
  <i class="twin_layout_icon_arrow"></i></div></div>`;
  let $userInfoElem = $(html);
  options.$userInfoElemMenu = $(
    `<div class="twin_classic_header_operating_menu"></div>`
  );
  let $theme = $(`<div class="twin_classic_click_menu_item">
    <i class="twin_layout_icon_theme"></i>
    <span>主题</span>
  </div>`);
  options.$userInfoElemMenu.append($theme);
  if (options.mobile) {
    $userInfoElem.on("click", (e) => {
      if (options.userInfoElemShow) {
        options.$userInfoElemMenu
          .css("opacity", 0)
          .css("transform", "scale(0)");
        options.userInfoElemShow = false;
      } else {
        options.$userInfoElemMenu
          .css("opacity", 1)
          .css("transform", "scale(1)");
        options.userInfoElemShow = true;
      }
      e.stopPropagation();
      e.preventDefault();
    });
    let $browserScreen = $(`<div class="twin_classic_click_menu_item">
      <i class="twin_layout_icon_browser_screen"></i>
      <span>全屏</span>
    </div>`);
    let $language = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_layout_icon_language"></i>
        <span>语言选择</span>
    </div>`);
    options.$userInfoElemMenu.append($browserScreen).append($language);
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

  if (
    options.userMenus &&
    Array.isArray(options.userMenus) &&
    options.userMenus.length > 0
  ) {
    options.userMenus.forEach((item) => {
      let menuItemHtml = `<div class="twin_classic_click_menu_item ${
        item.topLine ? "twin_classic_click_menu_item_line" : ""
      }">`;
      if (item.type == "icon") {
        if (item.fontFamily) {
          menuItemHtml += `<i style="font-family: '${item.fontFamily}';">${item.icon}</i>`;
        } else {
          menuItemHtml += `<i>${item.icon}</i>`;
        }
      } else if (item.type == "image") {
        menuItemHtml += `<img class="twin_layout_icon_garden_close" src="${item.icon}" />`;
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
function ClassicHeader(options, $topBar) {
  let $headerElem = $(`<div class="twin_classic_header"></div>`);
  let leftHtml = `<div class="twin_classic_header_left">`;
  leftHtml += `</div>`;
  let $leftInfo = $(leftHtml);
  let $foldElem = $(`<div class="twin_classic_header_operating">
      <a class="twin_classic_header_operating_btn" title="折叠">
        <i class="twin_layout_icon_fold"></i>
      </a>
    </div>`);
  $foldElem.on("click", function() {
    if (options.menuFold) {
      options.$loadContainer.removeClass("twin_classic_menu_fold");
      options.menuFold = false;
    } else {
      options.menuFold = true;
      options.$topBarMask.show();
      setTimeout(function() {
        options.$loadContainer.addClass("twin_classic_menu_fold");
      });
    }
  });

  $leftInfo.append($foldElem);
  options.$rightInfo = $(`<div class="twin_classic_header_right"></div>`);
  let $notice = $(`<div class="twin_classic_header_operating">
      <a class="twin_classic_header_operating_btn" title="通知消息">
        <i class="twin_layout_icon_notice"></i>
        <span class="twin_classic_header_operating_dot">+99</span>
      </a>
    </div>`);
  let $switchLayout = $(`<div class="twin_classic_header_operating">
      <a class="twin_classic_header_operating_btn" title="切换布局">
        <i class="twin_layout_icon_switch"></i>
      </a>
    </div>`);
  $switchLayout.on("click", function() {
    localStorage.setItem("twinLayout", "desktop");
    window.location.reload();
  });
  options.$rightInfo.append($switchLayout).append($notice);
  $headerElem.append($leftInfo).append(options.$rightInfo);
  $topBar.append($headerElem);
  if (!options.mobile) {
    let $browserScreen = $(`<div class="twin_classic_header_operating">
      <a class="twin_classic_header_operating_btn" title="全屏">
        <i class="twin_layout_icon_browser_screen"></i>
      </a>
    </div>`);
    let $language = $(`<div class="twin_classic_header_operating">
      <a class="twin_classic_header_operating_btn" title="语言选择">
        <i class="twin_layout_icon_language"></i>
        <i class="twin_layout_icon_arrow"></i>
      </a>
    </div>`);
    options.$rightInfo.append($browserScreen).append($language);
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
function ClassicNavBar(options, $topBar) {
  let $navBarElem = $(`<div class="twin_classic_nav_bar"></div>`);
  $topBar.append($navBarElem);
  // 导航栏上一页
  options.$navBarPreviousPageElem = $(`<div class="twin_classic_nav_bar_previous_page">
        <i class="twin_layout_icon_previous_page"></i>
    </div>`);
  $navBarElem.append(options.$navBarPreviousPageElem);
  // 导航栏容器
  options.$navBarContainerView = $(
    `<div class="twin_classic_nav_bar_container_view"></div>`
  );
  $navBarElem.append(options.$navBarContainerView);
  // 导航栏容器
  options.$navBarContainer = $(
    `<div class="twin_classic_nav_bar_container"></div>`
  );
  options.$navBarContainerView.append(options.$navBarContainer);
  // 导航栏下一页
  options.$navBarNextPageElem = $(`<div class="twin_classic_nav_bar_next_page">
        <i class="twin_layout_icon_next_page"></i>
    </div>`);
  $navBarElem.append(options.$navBarNextPageElem);
  // 更多操作
  let $navBarOperatingElem = $(`<div class="twin_classic_nav_bar_line"></div><div class="twin_classic_nav_bar_operating">
        <div class="twin_classic_nav_bar_operating_info">
            <span class="twin_classic_nav_bar_operating_info_text">关闭其他</span>
            <i class="twin_layout_icon_flat_arrow"></i>
        </div>
    </div>`);
  $navBarElem.append($navBarOperatingElem);
  if (options.mobile) {
    $navBarOperatingElem.on("click", (e) => {
      if (options.navBarOperatingShow) {
        options.$navBarOperatingContainerElem
          .css("opacity", 0)
          .css("transform", "scale(0)");
        options.navBarOperatingShow = false;
      } else {
        options.$navBarOperatingContainerElem
          .css("opacity", 1)
          .css("transform", "scale(1)");
        options.navBarOperatingShow = true;
      }
      e.stopPropagation();
      e.preventDefault();
    });
  }
  // 弹窗容器
  options.$navBarOperatingContainerElem = $(
    `<div class="twin_classic_header_operating_menu"></div>`
  );
  $navBarOperatingElem.append(options.$navBarOperatingContainerElem);
  // 关闭其他
  let $navBarOperatingCloseOtherElem = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_layout_icon_garden_close"></i>
        <span>关闭其他</span>
    </div>`);
  options.$navBarOperatingContainerElem.append($navBarOperatingCloseOtherElem);
  $navBarOperatingCloseOtherElem.on("click", function() {
    otherRemove(options);
  });
  // 关闭左边
  let $navBarOperatingCloseLeftElem = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_layout_icon_garden_close"></i>
        <span>关闭左边</span>
    </div>`);
  options.$navBarOperatingContainerElem.append($navBarOperatingCloseLeftElem);
  $navBarOperatingCloseLeftElem.on("click", function() {
    leftRemove(options);
  });
  // 关闭右边
  let $navBarOperatingCloseRightElem = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_layout_icon_garden_close"></i>
        <span>关闭右边</span>
    </div>`);
  options.$navBarOperatingContainerElem.append($navBarOperatingCloseRightElem);
  $navBarOperatingCloseRightElem.on("click", function() {
    rightRemove(options);
  });
  // 关闭全部
  let $navBarOperatingCloseAllElem = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_layout_icon_close"></i>
        <span>关闭全部</span>
    </div>`);
  options.$navBarOperatingContainerElem.append($navBarOperatingCloseAllElem);
  $navBarOperatingCloseAllElem.on("click", function() {
    allRemove(options);
  });
  options.navBarOffset = 0;
  // 上一页
  options.$navBarPreviousPageElem.on("click", () => {
    let ViewWidth = options.$navBarContainerView[0].clientWidth;
    if (options.navBarOffset + ViewWidth / 2 > 0) {
      options.navBarOffset = 0;
    } else {
      options.navBarOffset = options.navBarOffset + ViewWidth / 2;
    }
    options.$navBarContainer.css(
      "transform",
      "translateX(" + options.navBarOffset + "px)"
    );
  });
  // 下一页
  options.$navBarNextPageElem.on("click", () => {
    let ViewWidth = options.$navBarContainerView[0].clientWidth;
    let containerWidth = options.$navBarContainer[0].clientWidth;
    if (ViewWidth < containerWidth) {
      let maxNavBarOffset = containerWidth - ViewWidth;
      if (options.navBarOffset - ViewWidth / 2 < -maxNavBarOffset) {
        options.navBarOffset = -maxNavBarOffset;
      } else {
        options.navBarOffset = options.navBarOffset - ViewWidth / 2;
      }
      options.$navBarContainer.css(
        "transform",
        "translateX(" + options.navBarOffset + "px)"
      );
    }
  });
}
