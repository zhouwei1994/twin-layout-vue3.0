import { $ } from "./../dom.js";
import { openMenuBar } from "./leftBar.js";
// let windowZIndex = 50;
let windowNum = 0;
let classicWindowList = [];
export default function ClassicWindow(options, data, defaultPage) {
  if (windowSwitch(options, data.name, "name")) {
    return;
  }
  this.elemId = "twin_classic_window" + windowNum;
  this.$windowElem = $(
    `<div class="twin_classic_window_box" id="${this.elemId}"></div>`
  );
  this.$windowTopBarElem = $(
    `<div class="twin_classic_nav_bar_container_item twin_classic_theme_color twin_classic_theme_color_hover ${
      defaultPage ? "twin_classic_default_page" : ""
    }"></div>`
  );
  options.$navBarContainer.append(this.$windowTopBarElem);
  let $windowTopBarContentElem = $(`<div class="twin_classic_nav_bar_container_item_content">
                <span>${data.meta.title}</span></div>`);
  this.$windowTopBarElem.append($windowTopBarContentElem);

  options.$windowContainer.append(this.$windowElem);
  if (!defaultPage) {
    this.$windowTopBarClose = $(
      `<i class="twin_layout_icon_garden_close"></i>`
    );
    $windowTopBarContentElem.append(this.$windowTopBarClose);
    this.$windowTopBarClose.on("click", (e) => {
      this.removeWindow(options);
      this.nextWindowShow(options);
      showPage(options);
      e.stopPropagation();
    });
  }
  let classicWindowItem = {
    $windowElem: this.$windowElem,
    $windowTopBarElem: this.$windowTopBarElem,
    elemId: this.elemId,
    onRemove: this.removeWindow.bind(this),
    onShow: this.showWindow.bind(this),
    onHide: this.hideWindow.bind(this),
    show: true,
    ...data,
  };
  classicWindowList.push(classicWindowItem);
  showPage(options);
  this.callback = {
    el: "#" + this.elemId,
    element: this.$windowElem,
    ...data,
    onHide: undefined,
  };
  setTimeout(() => {
    options.open(this.callback);
  });
  windowNum++;
  centerWindow(options, this.$windowTopBarElem);
  this.$windowTopBarElem.on("click", () => {
    windowSwitch(options, this.elemId);
    openMenuBar(options, data.level);
    centerWindow(options, this.$windowTopBarElem);
  });
}
// 删除窗口
ClassicWindow.prototype.removeWindow = function(options, de = true) {
  options.remove &&
    options.remove({
      el: "#" + this.elemId,
      element: this.$windowElem,
      ...this.data,
    });
  this.$windowTopBarElem.off("click", function() {});
  this.$windowTopBarClose.off("click", function() {});
  this.$windowElem.remove();
  this.$windowTopBarElem.remove();
  if (de) {
    classicWindowList.forEach((item, index) => {
      if (this.elemId == item.elemId) {
        classicWindowList.splice(index, 1);
      }
    });
  }
};
// 显示窗口
ClassicWindow.prototype.showWindow = function() {
  this.$windowElem.show();
  this.$windowTopBarElem.addClass("twin_classic_theme_color");
  this.callback.onShow && this.callback.onShow();
};
// 隐藏窗口
ClassicWindow.prototype.hideWindow = function() {
  this.$windowElem.hide();
  this.$windowTopBarElem.removeClass("twin_classic_theme_color");
  this.callback.onHide && this.callback.onHide();
};
// 插件下一个窗口并显示
ClassicWindow.prototype.nextWindowShow = function(options) {
  let len = classicWindowList.length;
  for (let index = len - 1; index >= 0; index--) {
    const element = classicWindowList[index];
    element.onShow();
    element.show = true;
    openMenuBar(options, element.level);
    centerWindow(options, element.$windowTopBarElem);
    break;
  }
};
// 当前标签在最中间
function centerWindow(options, dom) {
  let viewWidth = options.$navBarContainerView[0].clientWidth;
  let containerWidth = options.$navBarContainer[0].clientWidth;
  if (viewWidth < containerWidth) {
    console.log(dom);
    let offsetLeft = dom[0].offsetLeft - viewWidth / 2;
    let difference = containerWidth - viewWidth;
    if (offsetLeft < 0) {
      options.navBarOffset = 0;
      options.$navBarContainer.css("transform", "translateX(0px)");
    } else if (offsetLeft > difference) {
      options.navBarOffset = -difference;
      options.$navBarContainer.css(
        "transform",
        "translateX(" + -difference + "px)"
      );
    } else {
      options.navBarOffset = offsetLeft;
      options.$navBarContainer.css(
        "transform",
        "translateX(" + -offsetLeft + "px)"
      );
    }
  } else {
    options.navBarOffset = 0;
    options.$navBarContainer.css("transform", "translateX(0px)");
  }
}
function windowSwitch(options, data, key = "elemId") {
  let prohibit = false;
  classicWindowList.forEach((item) => {
    if (item[key] == data) {
      item.onShow();
      item.show = true;
      prohibit = true;
      centerWindow(options, item.$windowTopBarElem);
    } else if (item.show) {
      item.onHide();
      item.show = false;
    }
  });
  return prohibit;
}
// 删除所有窗口
export function allRemove(options) {
  classicWindowList = classicWindowList.filter((item, index) => {
    if (index == 0) {
      if (!item.show) {
        item.onShow();
        item.show = true;
        openMenuBar(options, item.level);
      }
      return true;
    } else {
      item.onRemove(options, false);
      return false;
    }
  });
  showPage(options);
  options.navBarOffset = 0;
  options.$navBarContainer.css("transform", "translateX(0px)");
}
// 删除其他
export function otherRemove(options) {
  classicWindowList = classicWindowList.filter((item, index) => {
    if (item.show || index == 0) {
      return true;
    } else {
      item.onRemove(options, false);
      return false;
    }
  });
  showPage(options);
  options.navBarOffset = 0;
  options.$navBarContainer.css("transform", "translateX(0px)");
}
// 删除左边
export function leftRemove(options) {
  let remove = true;
  classicWindowList = classicWindowList.filter((item, index) => {
    if (remove) {
      if (item.show) {
        remove = false;
        return true;
      } else if (index == 0) {
        return true;
      } else {
        item.onRemove(options, false);
        return false;
      }
    } else {
      return true;
    }
  });
  showPage(options);
  options.navBarOffset = 0;
  options.$navBarContainer.css("transform", "translateX(0px)");
}
// 删除右边
export function rightRemove(options) {
  let remove = false;
  classicWindowList = classicWindowList.filter((item, index) => {
    if (remove && index != 0) {
      item.onRemove(options, false);
      return false;
    } else {
      if (item.show) {
        remove = true;
      }
      return true;
    }
  });
  showPage(options);
}
// 是否显示导航栏页
function showPage(options) {
  let ViewWidth = options.$navBarContainerView[0].clientWidth;
  let containerWidth = options.$navBarContainer[0].clientWidth;
  if (ViewWidth < containerWidth) {
    options.$navBarPreviousPageElem.show();
    options.$navBarNextPageElem.show();
    options.$navBarContainerView.removeClass("nav_bar_container_left_padding");
  } else {
    options.$navBarPreviousPageElem.hide();
    options.$navBarNextPageElem.hide();
    options.$navBarContainerView.addClass("nav_bar_container_left_padding");
  }
}
