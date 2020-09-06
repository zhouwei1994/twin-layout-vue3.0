import { $ } from "./../dom.js";
import DesktopWindow from "./window.js";
import { Object } from "core-js";
export default function DesktopAppMenus(options) {
  if (options.menus) {
    if (typeof options.menus === "function") {
      options.menus(function(data) {
        if (Array.isArray(data) && data.length > 0) {
          if (options.mobile) {
            new DesktopMobileApp(options, data);
          } else {
            new DesktopPcApp(options, data);
          }
        } else {
          console.error("【twin-layout】menus返回的数据类型不正确，应为array");
        }
      });
    } else if (Array.isArray(options.menus) && options.menus.length > 0) {
      if (options.mobile) {
        new DesktopMobileApp(options, options.menus);
      } else {
        new DesktopPcApp(options, options.menus);
      }
    } else {
      console.error("【twin-layout】menus数据类型不正确，应为function、array");
    }
  } else {
    alert("【twin-layout】请添加菜单 menus");
  }
}
function randomColor(transparent = 1) {
  return `rgba(${Math.ceil(Math.random() * 255)},${Math.ceil(
    Math.random() * 255
  )},${Math.ceil(Math.random() * 255)}, ${transparent})`;
}
// 手机桌面图标
function DesktopMobileApp(options, res) {
  this.column = 0;
  this.row = 0;
  this.currentIndex = 0;
  this.maxHeight = options.clientHeight - 60;
  this.appWidth = options.clientWidth > 500 ? 100 : options.clientWidth / 4;
  let maxRow = parseInt(this.maxHeight / this.appWidth);
  this.appInterval = (this.maxHeight - maxRow * this.appWidth) / maxRow;
  let $appContainer = $(`<div class="twin_desktop_app_container"></div>`);
  this.$appContainerView = $(
    `<div class="twin_desktop_app_container_view"></div>`
  );
  this.$appContainerUl = $(`<div class="twin_desktop_app_container_ul"></div>`);
  if (res && Array.isArray(res) && res.length > 0) {
    let { list } = DesktopAppData(res);
    list.forEach((item) => {
      if (item.children) {
        item.children.forEach((childItem) => {
          this.DesktopMobileAppView(options, childItem);
        });
      } else {
        this.DesktopMobileAppView(options, item);
      }
    });
    this.$appContainerView.append(this.$appContainerUl);
    $appContainer.append(this.$appContainerView);
    options.$loadContainer.append($appContainer);
    let startX = 0;
    let translateX = 0;
    let maxWidth = this.column * options.clientWidth;
    //手指接触屏幕
    this.$appContainerView.on("touchstart", (e) => {
      startX = e.touches[0].pageX;
    });
    //手指滑动屏幕
    this.$appContainerView.on("touchmove", (e) => {
      let interval = e.touches[0].pageX - startX;
      let result = translateX + interval;
      if (translateX + interval > 0) {
        result = 0;
      } else if (translateX + interval < -maxWidth) {
        result = -maxWidth;
      }
      this.$appContainerView
        .css("transform", "translateX(" + result + "px)")
        .css("transition", "all 0s");
    });
    //手指离开屏幕
    this.$appContainerView.on("touchend", (e) => {
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
      this.$appContainerView
        .css("transform", "translateX(" + translateX + "px)")
        .css("transition", "all 0.4s");
    });
  } else {
    alert("【twin-layout】至少要有一个菜单");
  }
}
DesktopMobileApp.prototype.DesktopMobileAppView = function(options, item) {
  let top = this.row * this.appWidth + this.appInterval * this.row;
  let left = this.currentIndex * this.appWidth;
  item.meta = Object.assign(
    {
      icon: "&#xe617;",
      fontFamily: "iconfont",
      iconType: "icon",
      title: "名称未定义",
      color: randomColor(),
    },
    item.meta
  );
  let $elemHtml = `<div class="twin_desktop_app_item" style="top:${top}px;left:${left}px;width:${this.appWidth}px;height:${this.appWidth}px;">`;
  if (item.meta.iconType == "image") {
    $elemHtml += `<i class="twin_desktop_app_item_image" style="background-image: url(${item.meta.icon});"></i>`;
  } else if (item.meta.iconType == "icon") {
    $elemHtml += `<i class="twin_desktop_app_item_icon" style="font-family: ${item.meta.fontFamily};color:${item.meta.color};">${item.meta.icon}</i>`;
  }
  let $elem = $(
    $elemHtml +
      `<span class="twin_desktop_app_item_text">${item.meta.title}</span></div>`
  );
  this.currentIndex += 1;
  this.$appContainerUl.append($elem);
  if (left + this.appWidth * 2 > options.clientWidth) {
    this.currentIndex = 0;
    this.row += 1;
    if (top + (this.appWidth + this.appInterval) * 2 > this.maxHeight) {
      this.column += 1;
      this.row = 0;
      this.$appContainerView.append(this.$appContainerUl);
      this.$appContainerUl = $(
        `<div class="twin_desktop_app_container_ul"></div>`
      );
    }
  }
  $elem.on("click", function() {
    new DesktopWindow(options, item);
  });
};
// PC桌面图标
let leftMenus = [];
function DesktopPcApp(options, res) {
  this.appWidth = 100;
  this.column = 0;
  this.row = 0;
  this.currentIndex = 0;
  this.maxHeight = options.clientHeight - 100;
  this.containerMaxWidth = options.clientWidth - 70;
  let maxRow = parseInt(this.maxHeight / this.appWidth);
  this.appInterval = (this.maxHeight - maxRow * this.appWidth) / maxRow;
  let $appContainer = $(`<div class="twin_desktop_app_container"></div>`);
  this.$appContainerView = $(
    `<div class="twin_desktop_app_container_view"></div>`
  );
  this.screenIndex = 0;
  this.currentScreen = 0;
  this.currentIndex = 0;
  let _this = this;
  if (res && Array.isArray(res) && res.length > 0) {
    let { list, total } = DesktopAppData(res);
    let $appMenus = undefined;
    let $appMenusBackground = undefined;
    let $appMenusContainer = undefined;
    if (total > 18) {
      $appMenus = $(`<div class="twin_desktop_app_menus"></div>`);
      $appMenusBackground = $(
        `<div class="twin_desktop_app_menus_background"></div>`
      );
      $appMenusContainer = $(
        `<div class="twin_desktop_app_menus_container"></div>`
      );
      $appMenusBackground.append($appMenusContainer);
      $appMenus.append($appMenusBackground);
      options.$loadContainer.append($appMenus);
    } else {
      this.$appContainerUl = $(
        `<div class="twin_desktop_app_container_ul"></div>`
      );
    }
    list.forEach((item) => {
      if (total > 18) {
        item.meta = Object.assign(
          {
            icon: "&#xe617;",
            fontFamily: "iconfont",
            iconType: "icon",
            title: "名称未定义",
            color: randomColor(),
          },
          item.meta
        );
        let $menusElemHtml = `<div class="twin_desktop_app_menu_item ${
          this.screenIndex == 0 && item.children
            ? "twin_desktop_app_menu_active"
            : ""
        }">`;
        if (item.meta.iconType == "image") {
          $menusElemHtml += `<i class="twin_desktop_app_menu_item_image" style="background-image: url(${item.meta.icon});"></i>`;
        } else if (item.meta.iconType == "icon") {
          $menusElemHtml += `<i class="twin_desktop_app_menu_item_icon" style="font-family: ${item.meta.fontFamily};color:${item.meta.color};">${item.meta.icon}</i>`;
        }
        let $menusElem = $(
          $menusElemHtml + `<span>${item.meta.title}</span></div>`
        );
        $appMenusContainer.append($menusElem);
        if (item.children) {
          let currentScreenIndex = this.screenIndex;
          leftMenus.push($menusElem);
          $menusElem.on("click", function() {
            _this.currentScreen = currentScreenIndex;
            leftMenus.forEach((childItem) => {
              if ($menusElem.equal(childItem)) {
                childItem.addClass("twin_desktop_app_menu_active");
              } else {
                childItem.removeClass("twin_desktop_app_menu_active");
              }
            });
            _this.$appContainerView
              .css(
                "transform",
                "translateY(" + -(currentScreenIndex * _this.maxHeight) + "px)"
              )
              .css("transition", "all 0.3s");
          });
          this.$appContainerUl = $(
            `<div class="twin_desktop_app_container_ul"></div>`
          );
          this.currentIndex = 0;
          this.row = 0;
          this.column = 0;
          item.children.forEach((childItem) => {
            this.DesktopPcAppView(options, childItem, "classify");
          });
          this.$appContainerView.append(this.$appContainerUl);
          this.screenIndex += 1;
        } else {
          $menusElem.on("click", function() {
            new DesktopWindow(options, item);
          });
        }
      } else {
        if (item.children) {
          item.children.forEach((childItem) => {
            this.DesktopPcAppView(options, childItem);
          });
        } else {
          this.DesktopPcAppView(options, item);
        }
      }
    });
    if (total < 18) {
      this.$appContainerView.append(this.$appContainerUl);
    }
    $appContainer.append(this.$appContainerView);
    options.$loadContainer.append($appContainer);
    this.$appContainerView.on("mousewheel", function(e) {
      if (e.wheelDelta > 0) {
        if (_this.currentScreen > 0) {
          _this.currentScreen -= 1;
          leftMenus.forEach((childItem, index) => {
            if (index == _this.currentScreen) {
              childItem.addClass("twin_desktop_app_menu_active");
            } else {
              childItem.removeClass("twin_desktop_app_menu_active");
            }
          });
          _this.$appContainerView
            .css(
              "transform",
              "translateY(" + -(_this.currentScreen * _this.maxHeight) + "px)"
            )
            .css("transition", "all 0.3s");
        }
      } else {
        if (_this.currentScreen < _this.screenIndex - 1) {
          _this.currentScreen += 1;
          leftMenus.forEach((childItem, index) => {
            if (index == _this.currentScreen) {
              childItem.addClass("twin_desktop_app_menu_active");
            } else {
              childItem.removeClass("twin_desktop_app_menu_active");
            }
          });
          _this.$appContainerView
            .css(
              "transform",
              "translateY(" + -(_this.currentScreen * _this.maxHeight) + "px)"
            )
            .css("transition", "all 0.3s");
        }
      }
    });
  } else {
    alert("【twin-layout】至少要有一个菜单");
  }
}
DesktopPcApp.prototype.DesktopPcAppView = function(
  options,
  item,
  type = "bigScreen"
) {
  let top =
    this.appInterval * this.currentIndex + this.appWidth * this.currentIndex;
  let left = this.appWidth * this.column;
  item.meta = Object.assign(
    {
      icon: "&#xe617;",
      fontFamily: "iconfont",
      iconType: "icon",
      title: "名称未定义",
      color: randomColor(),
    },
    item.meta
  );
  let $elemHtml = `<div class="twin_desktop_app_item" style="top:${top}px;left:${left}px;width:${this.appWidth}px;height:${this.appWidth}px;">`;
  if (item.meta.iconType == "image") {
    $elemHtml += `<i class="twin_desktop_app_item_image" style="background-image: url(${item.meta.icon});"></i>`;
  } else if (item.meta.iconType == "icon") {
    $elemHtml += `<i class="twin_desktop_app_item_icon" style="font-family: ${item.meta.fontFamily};color:${item.meta.color};">${item.meta.icon}</i>`;
  }
  let $elem = $(
    $elemHtml +
      `<span class="twin_desktop_app_item_text">${item.meta.title}</span></div>`
  );
  this.currentIndex += 1;
  this.$appContainerUl.append($elem);
  if (top + (this.appWidth + this.appInterval) * 2 > this.maxHeight) {
    this.column += 1;
    this.currentIndex = 0;
    if (
      type == "bigScreen" &&
      left + this.appWidth * 2 > this.containerMaxWidth
    ) {
      this.currentIndex = 0;
      this.row += 1;
      this.column = 0;
      this.$appContainerView.append(this.$appContainerUl);
      this.$appContainerUl = $(
        `<div class="twin_desktop_app_container_ul"></div>`
      );
    }
  }
  $elem.on("click", function() {
    new DesktopWindow(options, item);
  });
};
function DesktopAppData(res, level = 0) {
  let appList = [];
  let allTotal = 0;
  res.forEach(function(item) {
    if (level == 0) {
      if (item.children && Array.isArray(item.children)) {
        let { list, total } = DesktopAppData(item.children, level + 1);
        appList.push({
          ...item,
          children: list,
        });
        allTotal += total;
      } else {
        appList.push(item);
        allTotal += 1;
      }
    } else {
      if (item.children && Array.isArray(item.children)) {
        let { list, total } = DesktopAppData(item.children, level + 1);
        appList = appList.concat(list);
        allTotal += total;
      } else {
        appList.push(item);
        allTotal += 1;
      }
    }
  });
  return {
    list: appList,
    total: allTotal,
  };
}
