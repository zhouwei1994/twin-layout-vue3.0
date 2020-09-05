import { $ } from "./../dom.js";
import DesktopWindow from "./window.js";
import { Object } from "core-js";
export default function DesktopAppMenus(options) {
  if (options.menus) {
    if (typeof options.menus === "function") {
      options.menus(function(data) {
        if (Array.isArray(data) && data.length > 0) {
          if (options.mobile) {
            DesktopMobileApp(options, data);
          } else {
            DesktopPcApp(options, data);
          }
        } else {
          console.error("【twin-layout】menus返回的数据类型不正确，应为array");
        }
      });
    } else if (Array.isArray(options.menus) && options.menus.length > 0) {
      if (options.mobile) {
        DesktopMobileApp(options, options.menus);
      } else {
        DesktopPcApp(options, options.menus);
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
  let column = 0;
  let row = 0;
  let currentIndex = 0;
  let maxHeight = options.clientHeight - 60;
  let appWidth = options.clientWidth > 500 ? 100 : options.clientWidth / 4;
  let maxRow = parseInt(maxHeight / appWidth);
  let appInterval = (maxHeight - maxRow * appWidth) / maxRow;
  let $appContainer = $(`<div class="twin_desktop_app_container"></div>`);
  let $appContainerView = $(
    `<div class="twin_desktop_app_container_view"></div>`
  );
  let $appContainerUl = $(`<div class="twin_desktop_app_container_ul"></div>`);
  if (res && Array.isArray(res) && res.length > 0) {
    let appList = DesktopAppData(res);
    appList.forEach((item) => {
      let top = row * appWidth + appInterval * row;
      let left = currentIndex * appWidth;
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
      let $elemHtml = `<div class="twin_desktop_app_item" style="top:${top}px;left:${left}px;width:${appWidth}px;height:${appWidth}px;">`;
      if (item.meta.iconType == "image") {
        $elemHtml += `<i class="twin_desktop_app_item_image" style="background-image: url(${item.meta.icon});"></i>`;
      } else if (item.meta.iconType == "icon") {
        $elemHtml += `<i class="twin_desktop_app_item_icon" style="font-family: ${item.meta.fontFamily};color:${item.meta.color};">${item.meta.icon}</i>`;
      }
      let $elem = $(
        $elemHtml +
          `<span class="twin_desktop_app_item_text">${item.meta.title}</span></div>`
      );
      currentIndex += 1;
      $appContainerUl.append($elem);
      if (left + appWidth * 2 > options.clientWidth) {
        currentIndex = 0;
        row += 1;
        if (top + (appWidth + appInterval) * 2 > maxHeight) {
          column += 1;
          row = 0;
          $appContainerView.append($appContainerUl);
          $appContainerUl = $(
            `<div class="twin_desktop_app_container_ul"></div>`
          );
        }
      }
      $elem.on("click", function() {
        new DesktopWindow(options, item);
      });
    });
    $appContainerView.append($appContainerUl);
    $appContainer.append($appContainerView);
    options.$loadContainer.append($appContainer);
    let startX = 0;
    let translateX = 0;
    let maxWidth = column * options.clientWidth;
    //手指接触屏幕
    $appContainerView.on("touchstart", (e) => {
      startX = e.touches[0].pageX;
    });
    //手指滑动屏幕
    $appContainerView.on("touchmove", (e) => {
      let interval = e.touches[0].pageX - startX;
      let result = translateX + interval;
      if (translateX + interval > 0) {
        result = 0;
      } else if (translateX + interval < -maxWidth) {
        result = -maxWidth;
      }
      $appContainerView
        .css("transform", "translateX(" + result + "px)")
        .css("transition", "all 0s");
    });
    //手指离开屏幕
    $appContainerView.on("touchend", (e) => {
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
      $appContainerView
        .css("transform", "translateX(" + translateX + "px)")
        .css("transition", "all 0.4s");
    });
  } else {
    alert("【twin-layout】至少要有一个菜单");
  }
}
// PC桌面图标
function DesktopPcApp(options, res) {
  let appWidth = 100;
  let column = 0;
  let row = 0;
  let currentIndex = 0;
  let maxHeight = options.clientHeight - 100;
  let maxRow = parseInt(maxHeight / appWidth);
  let appInterval = (maxHeight - maxRow * appWidth) / maxRow;

  let $appContainer = $(`<div class="twin_desktop_app_container"></div>`);
  let $appContainerView = $(
    `<div class="twin_desktop_app_container_view"></div>`
  );
  let $appContainerUl = $(`<div class="twin_desktop_app_container_ul"></div>`);
  let isDrag = false;
  if (res && Array.isArray(res) && res.length > 0) {
    let appList = DesktopAppData(res);
    appList.forEach((item) => {
      let top = appInterval * currentIndex + appWidth * currentIndex;
      let left = appWidth * column;
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
      let $elemHtml = `<div class="twin_desktop_app_item" style="top:${top}px;left:${left}px;width:${appWidth}px;height:${appWidth}px;">`;
      if (item.meta.iconType == "image") {
        $elemHtml += `<i class="twin_desktop_app_item_image" style="background-image: url(${item.meta.icon});"></i>`;
      } else if (item.meta.iconType == "icon") {
        $elemHtml += `<i class="twin_desktop_app_item_icon" style="font-family: ${item.meta.fontFamily};color:${item.meta.color};">${item.meta.icon}</i>`;
      }
      let $elem = $(
        $elemHtml +
          `<span class="twin_desktop_app_item_text">${item.meta.title}</span></div>`
      );
      currentIndex += 1;
      $appContainerUl.append($elem);
      if (top + (appWidth + appInterval) * 2 > maxHeight) {
        column += 1;
        currentIndex = 0;
        if (left + appWidth * 2 > options.clientWidth) {
          currentIndex = 0;
          row += 1;
          column = 0;
          $appContainerView.append($appContainerUl);
          $appContainerUl = $(
            `<div class="twin_desktop_app_container_ul"></div>`
          );
        }
      }
      $elem.on("click", function() {
        if (isDrag) {
          isDrag = false;
        } else {
          new DesktopWindow(options, item);
        }
      });
    });
    $appContainerView.append($appContainerUl);
    $appContainer.append($appContainerView);
    options.$loadContainer.append($appContainer);
    let startX = 0;
    let translateX = 0;
    let maxWidth = row * options.clientWidth;
    let down = false;
    let startTime = 0;
    //手指接触屏幕
    $appContainerView.on("mousedown", (e) => {
      startX = e.clientX;
      startTime = new Date().getDate();
      down = true;
    });
    //手指滑动屏幕
    $appContainerView.on("mousemove", (e) => {
      if (down) {
        let interval = e.clientX - startX;
        let result = translateX + interval;
        if (translateX + interval > 0) {
          result = 0;
        } else if (translateX + interval < -maxWidth) {
          result = -maxWidth;
        }
        $appContainerView
          .css("transform", "translateX(" + result + "px)")
          .css("transition", "all 0s");
        if (Math.abs(interval) > 5) {
          isDrag = true;
        }
      }
    });
    //手指离开屏幕
    $appContainerView.on("mouseup", (e) => {
      if (down) {
        let interval = e.clientX - startX;
        let intervalAbs = Math.abs(interval);
        if (
          intervalAbs >= options.clientWidth / 5 ||
          (intervalAbs > 50 && new Date().getDate() - startTime < 300)
        ) {
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
        $appContainerView
          .css("transform", "translateX(" + translateX + "px)")
          .css("transition", "all 0.4s");
        down = false;
      }
      setTimeout(() => {
        isDrag = false;
      });
    });
  } else {
    alert("【twin-layout】至少要有一个菜单");
  }
}
function DesktopAppData(res) {
  let appList = [];
  res.forEach(function(item) {
    if (item.children && Array.isArray(item.children)) {
      appList = appList.concat(DesktopAppData(item.children));
    } else {
      appList.push(item);
    }
  });
  return appList;
}
