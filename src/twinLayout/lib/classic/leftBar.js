import { $ } from "../dom.js";
import ClassicWindow from "./window.js";
export default function ClassicLeftBar(options) {
  let $leftContainer = $(`<div class="twin_classic_left_bar"></div>`);
  let leftHtml = `<div class="twin_classic_left_scroll twin_classic_theme_left_bar_background"><div class="twin_classic_left_bar_info twin_classic_theme_left_bar_background">`;
  if (options.logo) {
    leftHtml += `<img class="twin_classic_left_bar_logo" src="${options.logo}"/>`;
  }
  leftHtml += `<span class="twin_classic_left_bar_title">${options.title ||
    "双生布局"}</span>`;
  let $leftBarElem = $(leftHtml + `</div></div>`);
  options.$leftMenuBar = $(
    `<div class="twin_classic_left_bar_menus twin_classic_theme_left_bar_background"></div>`
  );
  $leftBarElem.append(options.$leftMenuBar);
  $leftContainer.append($leftBarElem);
  options.$loadContainer.append($leftContainer);
  options.menuBarList = [];
  ClassicAppMenus(options);
}
function ClassicAppMenus(options) {
  if (options.menus) {
    if (typeof options.menus === "function") {
      options.menus(function(data) {
        if (Array.isArray(data) && data.length > 0) {
          ClassicMenuBar(options, options.$leftMenuBar, data, 0);
        } else {
          console.error("【twin-layout】menus返回的数据类型不正确，应为array");
        }
      });
    } else if (Array.isArray(options.menus) && options.menus.length > 0) {
      ClassicMenuBar(options.$leftMenuBar, options.menus, 0);
    } else {
      console.error("【twin-layout】menus数据类型不正确，应为function、array");
    }
  } else {
    alert("【twin-layout】请添加菜单 menus");
  }
}
let defaultOpen = true;
function ClassicMenuBar(options, container, res, level = 0, fatherId = "") {
  res.forEach((item, index) => {
    let $menuBarElem = $(
      `<div class="twin_classic_menu ${
        level == 0 ? "twin_classic_menu_first" : ""
      }"></div>`
    );
    let $menuBarItemHtml = `<div class="twin_classic_menu_item twin_classic_theme_left_bar_hover" style="padding-left:${(level +
      1) *
      15}px"><div class="twin_classic_menu_item_left">`;
    item.meta = Object.assign(
      {
        icon: "&#xe617;",
        fontFamily: "iconfont",
        iconType: "icon",
        title: "名称未定义",
      },
      item.meta
    );
    // if (level == 0 && options.mode == "left") {
    if (item.meta.iconType == "image") {
      $menuBarItemHtml += `<i class="twin_classic_menu_item_image" style="background-image: url(${item.meta.icon});"></i>`;
    } else if (item.meta.iconType == "icon") {
      $menuBarItemHtml += `<i class="twin_classic_menu_item_icon" style="font-family: ${item.meta.fontFamily};">${item.meta.icon}</i>`;
    }
    // }
    $menuBarItemHtml += `<span class="twin_classic_menu_item_title">${item.meta.title}</span></div><div class="twin_classic_menu_item_right">`;
    if (item.meta.label) {
      $menuBarItemHtml += `<span class="twin_classic_menu_item_label">${item.meta.label}</span>`;
    }
    container.append($menuBarElem);
    if (item.children && Array.isArray(item.children)) {
      $menuBarItemHtml += `<i class="twin_layout_icon_flat_arrow"></i>`;
    }
    $menuBarItemHtml += `</div></div>`;
    let $menuBarItemElem = $($menuBarItemHtml);
    $menuBarElem.append($menuBarItemElem);
    let levelChain = level == 0 ? String(index) : fatherId + "_" + index;
    item.level = levelChain;
    if (item.children && Array.isArray(item.children)) {
      let childrenHeight = item.children.length * 50;
      let topLen = 0;
      levelChain.split("_").forEach((item) => {
        topLen += Number(item);
      });
      let topHeight = topLen * 50 + 60;
      let left = level > 0 ? level * 200 + 50 : 50;
      let childrenMenuHtml = `<div class="twin_classic_children_menu" style="left:${left}px;`;
      if (childrenHeight > options.clientHeight) {
        childrenMenuHtml += `top: 0px;bottom: 0px;`;
      } else if (options.clientHeight - topHeight < childrenHeight) {
        childrenMenuHtml += `bottom: 0px;`;
      } else {
        childrenMenuHtml += `top: ${topHeight}px;`;
      }
      let $childrenMenuBarElem = $(childrenMenuHtml + `"></div>`);
      $menuBarElem.append($childrenMenuBarElem);
      let $childrenMenuScrollElem = $(
        `<div class="twin_classic_children_menu_scroll"></div>`
      );
      $childrenMenuBarElem.append($childrenMenuScrollElem);
      ClassicMenuBar(
        options,
        $childrenMenuScrollElem,
        item.children,
        level + 1,
        levelChain
      );
      options.menuBarList.push({
        dom: $menuBarElem,
        level: levelChain,
        type: "father",
        openState: false,
        data: item,
      });
      $menuBarItemElem.on("click", function() {
        openMenuBar(options, levelChain, "father");
      });
    } else {
      options.menuBarList.push({
        dom: $menuBarItemElem,
        level: levelChain,
        type: "menu",
        data: item,
      });
      if (defaultOpen) {
        new ClassicWindow(options, item, true);
        defaultOpen = false;
        openMenuBar(options, levelChain);
      }
      $menuBarItemElem.on("click", function() {
        new ClassicWindow(options, item);
        openMenuBar(options, levelChain);
        if (options.menuFold) {
          if (options.mobile) {
            options.$loadContainer.removeClass("twin_classic_menu_fold");
            options.menuFold = false;
            setTimeout(() => {
              options.$topBarMask.hide();
            }, 300);
          } else if (level > 0) {
            container.parent().hide();
            setTimeout(() => {
              container.parent().show();
            }, 50);
          }
        }
      });
    }
  });
}
export function openMenuBar(options, levelChain, type = "menu") {
  let rootLevel = levelChain.split("_")[0];
  let isMenu = false;
  options.menuBarList.forEach((childItem) => {
    if (childItem.type == "father") {
      let verification = new RegExp("^" + childItem.level);
      setTimeout(() => {
        if (isMenu) {
          if (rootLevel == childItem.level) {
            childItem.dom.addClass("twin_classic_theme_before");
          } else if (childItem.level.length == 1) {
            childItem.dom.removeClass("twin_classic_theme_before");
          }
        }
      });
      if (verification.test(levelChain)) {
        if (!childItem.openState) {
          childItem.dom.addClass(
            "twin_classic_theme_left_bar_background_active"
          );
          childItem.openState = true;
        } else if (levelChain == childItem.level) {
          childItem.dom.removeClass(
            "twin_classic_theme_left_bar_background_active"
          );
          childItem.openState = false;
        }
      } else {
        childItem.dom.removeClass(
          "twin_classic_theme_left_bar_background_active"
        );
        childItem.openState = false;
      }
    } else if (childItem.type == "menu" && type != "father") {
      if (levelChain == childItem.level) {
        childItem.dom.addClass("twin_classic_theme_background");
        isMenu = true;
      } else {
        childItem.dom.removeClass("twin_classic_theme_background");
      }
    }
  });
}
