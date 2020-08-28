import { $ } from "./../dom.js";
let windowZIndex = 50;
let windowNum = 0;
let allowMouse = true;

let startClientX = 0;
let startClientY = 0;
let desktopWindowList = [];
// 窗口
export default function DesktopWindow(options, data) {
  if (!data.openMore) {
    let prohibit = false;
    desktopWindowList.forEach((item) => {
      if (item.name == data.name) {
        item.onShow();
        prohibit = true;
      }
    });
    if (prohibit) {
      return;
    }
  }
  this.data = data;
  this.elemId = "twin_desktop_window" + windowNum;
  let startTop = options.clientHeight * 0.1;
  let startLeft = options.clientWidth * 0.15;
  this.top = 40 * windowNum;
  this.left = 40 * windowNum;
  this.windowMouseType = false;
  this.minimize = false;
  this.zIndex = windowZIndex;
  if (options.clientHeight * 0.2 < this.top) {
    this.top = startTop + Math.ceil(Math.random() * startTop);
  } else {
    this.top += startTop;
  }
  if (startLeft < this.left) {
    this.left = startLeft + Math.ceil(Math.random() * startLeft);
  } else {
    this.left += startLeft;
  }
  this.right = options.clientWidth * 0.3 - this.left;
  this.bottom = options.clientHeight * 0.3 - 40 - this.top;
  // 窗口
  this.$windowElem = $(
    `<div class="twin_desktop_window twin_desktop_window_active" style="top: ${this.top}px;left: ${this.left}px;right: ${this.right}px;bottom: ${this.bottom}px;z-index:${this.zIndex};"></div>`
  );
  // 窗口导航栏
  this.$windowNavbarElem = $(`<div class="twin_desktop_window_navbar"></div>`);
  // 窗口导航栏信息
  this.$windowNavbarInfoElem = $(`<div class="win_desktop_window_navbar_info">
        <i class="twin_desktop_window_navbar_icon" style="background-image: url(${data.icon});"></i>
        <span class="twin_desktop_window_navbar_text">${data.title}</span>
    </div>`);
  // 窗口容器
  let $windowContainerElem = $(
    `<div class="twin_desktop_window_container" id="${this.elemId}"></div>`
  );
  this.$windowNavbarElem.append(this.$windowNavbarInfoElem);
  this.$windowElem.append(this.$windowNavbarElem).append($windowContainerElem);
  options.$loadContainer.append(this.$windowElem);

  this.BottomBar(options);
  this.drag(options);
  this.operating(options);

  // 移除其他窗口状态
  desktopWindowList.forEach((item) => {
    item.$windowElem.removeClass("twin_desktop_window_active");
    item.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
  });
  // 添加到窗口列表
  desktopWindowList.push({
    $windowElem: this.$windowElem,
    $bottomBarElem: this.$bottomBarElem,
    elemId: this.elemId,
    minimize: this.minimize,
    zIndex: this.zIndex,
    onRemove: this.removeWindow.bind(this),
    onShow: this.showWindow.bind(this),
    onMinimize: this.onMinimize.bind(this),
    ...data,
  });

  //创建完成后更新全局变量
  windowNum++;
  windowZIndex++;
  this.callback = {
    el: "#" + this.elemId,
    element: this.$windowElem,
    ...data,
    onHide: undefined,
  };
  setTimeout(() => {
    options.open(this.callback);
  });
}
// 删除窗口
DesktopWindow.prototype.removeWindow = function(options, de = true) {
  options.remove &&
    options.remove({
      el: "#" + this.elemId,
      element: this.$windowElem,
      ...this.data,
    });
  // 解除绑定的事件
  this.$windowMinElem.off("click", function() {});
  this.$windowfullScreenElem.off("click", function() {});
  this.$windowCloseElem.off("click", function() {});
  this.$windowRefreshElem.off("click", function() {});
  this.$windowNavbarInfoElem.off("mousedown", function() {});
  this.$windowTopElem.off("mousedown", function() {});
  this.$windowBottomElem.off("mousedown", function() {});
  this.$windowLeftElem.off("mousedown", function() {});
  this.$windowRightElem.off("mousedown", function() {});
  this.$body.off("mousemove", function() {});
  this.$body.off("mouseup", function() {});
  this.$bottomBarElem.off("click", function() {});
  this.$bottomBarElem.off("contextmenu", function() {});
  // 删除当前窗口
  this.$windowElem.remove();
  // 底部菜单
  this.$bottomBarElem.remove();
  if (de) {
    desktopWindowList.forEach((item, index) => {
      if (this.elemId == item.elemId) {
        desktopWindowList.splice(index, 1);
      }
    });
  }
};
// 显示窗口
DesktopWindow.prototype.showWindow = function() {
  if (this.zIndex !== windowZIndex) {
    this.$windowElem.css("z-index", windowZIndex);
    this.zIndex = windowZIndex;
    windowZIndex++;
  }
  this.$windowElem.show();
  desktopWindowList.forEach((item) => {
    if (item.elemId == this.elemId) {
      item.$windowElem.addClass("twin_desktop_window_active");
      item.$bottomBarElem.addClass("twin_desktop_bottom_bar_active");
      item.minimize = false;
      item.zIndex = this.zIndex;
    } else {
      item.$windowElem.removeClass("twin_desktop_window_active");
      item.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
    }
  });
  this.minimize = false;
  this.callback.onShow && this.callback.onShow();
};
// 最小化
DesktopWindow.prototype.onMinimize = function () {
  this.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
  this.$windowElem.removeClass("twin_desktop_window_active");
  this.$windowElem.hide();
  this.minimize = true;
  this.callback.onHide && this.callback.onHide();
};
// 底部菜单
DesktopWindow.prototype.BottomBar = function(options) {
  let _this = this;
  // 底部导航创建
  this.$bottomBarElem = $(`<div class="twin_desktop_bottom_bar_item twin_desktop_bottom_bar_active" data-id="${this.elemId}">
        <i class="twin_desktop_bottom_bar_icon" style="background-image: url(${this.data.icon});"></i>
        <span class="twin_desktop_bottom_bar_text">${this.data.title}</span>
    </div>`);
  options.$bottomBarContainer.append(this.$bottomBarElem);
  // 底部菜单点击
  this.$bottomBarElem.on("click", this.showWindow.bind(this));
  // 底部菜单拖动
  this.$bottomBarElem.on("mousedown", function (e) { 
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "bottomBarDrag";
    startClientX = e.clientX;
    startClientY = e.clientY;
  });
  
  // 底部菜单右键点击
  this.$bottomBarElem.on("contextmenu", function(e) {
    DesktopClickMenu(options, {
      clientX: e.clientX,
      clientY: e.clientY,
      dataList: [
        {
          elem: `<div class="twin_desktop_click_menu_item">
                        <i class="twin_desktop_icon_garden_close"></i>
                        <span>关闭全部</span>   
                    </div>`,
          click: function() {
            desktopWindowList.forEach((item) => {
              item.onRemove(options, false);
            });
            desktopWindowList = [];
          },
        },
        {
          elem: `<div class="twin_desktop_click_menu_item">
                        <i class="twin_desktop_icon_garden_close"></i>
                        <span>关闭其他</span>
                    </div>`,
          click: function() {
            desktopWindowList = desktopWindowList.filter((item) => {
              if (item.elemId == _this.elemId) {
                return true;
              } else {
                item.onRemove.bind(_this)(options, false);
                return false;
              }
            });
            _this.highlight();
          },
        },
        {
          elem: `<div class="twin_desktop_click_menu_item">
                        <i class="twin_desktop_icon_close"></i>
                        <span>关闭窗口</span>
                    </div>`,
          click: function() {
            _this.removeWindow(options);
          },
        },
      ],
    });
    e.returnValue = false;
    e.stopPropagation();
  });
};
// 下一个窗口高亮
DesktopWindow.prototype.highlight = function(elemId) {
  let len = desktopWindowList.length;
  let maxZIndex = 0;
  let maxIndex = 0;
  for (let index = len - 1; index >= 0; index--) {
    const element = desktopWindowList[index];
    if (elemId && elemId == element.elemId) {
      element.minimize = true;
    } else {
      element.$windowElem.removeClass("twin_desktop_window_active");
      element.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
      if (!element.minimize) { 
        if (maxZIndex == 0) {
          maxZIndex = element.zIndex;
          maxIndex = index;
        } else if (maxZIndex < element.zIndex) {
          maxZIndex = element.zIndex;
          maxIndex = index;
        }        
      }
    }
  }
  setTimeout(() => {
    if (maxZIndex != 0) {
      let openItem = desktopWindowList[maxIndex];
      openItem.$windowElem.addClass("twin_desktop_window_active");
      openItem.$bottomBarElem.addClass("twin_desktop_bottom_bar_active");
    }
  },10);
};
// 窗口操作
DesktopWindow.prototype.operating = function(options) {
  let _this = this;
  // 窗口操作容器
  let $windowOperatingElem = $(
    `<div class="win_desktop_window_navbar_operating"></div>`
  );
  // 窗口最小化
  this.$windowMinElem = $(`<i class="twin_desktop_icon_min"></i>`);
  // 窗口全屏、窗口切换
  this.$windowfullScreenElem = $(
    `<i class="twin_desktop_icon_window_screen"></i>`
  );
  // 窗口刷新
  this.$windowRefreshElem = $(`<i class="twin_desktop_icon_refresh"></i>`);
  // 窗口关闭
  this.$windowCloseElem = $(`<i class="twin_desktop_icon_close"></i>`);
  $windowOperatingElem
    .append(this.$windowRefreshElem)
    .append(this.$windowMinElem)
    .append(this.$windowfullScreenElem)
    .append(this.$windowCloseElem);
  this.$windowNavbarElem.append($windowOperatingElem);
  // 窗口刷新
  this.$windowRefreshElem.on("click", function(e) {
    options.remove &&
      options.remove({
        el: "#" + _this.elemId,
        element: _this.$windowElem,
        ..._this.data,
      });
    setTimeout(() => {
      options.open({
        el: "#" + _this.elemId,
        element: _this.$windowElem,
        ..._this.data,
      });
    });
    e.stopPropagation();
  });
  // 窗口调整
  this.$windowfullScreenElem.on("click", function(e) {
    if (_this.$windowElem.hasClass("twin_desktop_window_full_screen")) {
      allowMouse = true;
      _this.$windowElem.removeClass("twin_desktop_window_full_screen");
    } else {
      allowMouse = false;
      _this.$windowElem.addClass("twin_desktop_window_full_screen");
    }
    e.stopPropagation(e);
  });
  // 窗口关闭
  this.$windowCloseElem.on("click", function(e) {
    _this.removeWindow(options);
    _this.highlight();
    e.stopPropagation();
  });
  // 窗口最小化
  this.$windowMinElem.on("click", function(e) {
    _this.onMinimize();
    _this.highlight(_this.elemId);
    e.stopPropagation();
  });
  // 窗口点击
  this.$windowElem.on("click", function() {
    if (_this.zIndex !== windowZIndex) {
      _this.$windowElem.css("z-index", windowZIndex);
      _this.zIndex = windowZIndex;
      windowZIndex++;
    }
    desktopWindowList.forEach((item) => {
      if (item.elemId == _this.elemId) {
        item.$windowElem.addClass("twin_desktop_window_active");
        item.$bottomBarElem.addClass("twin_desktop_bottom_bar_active");
        item.minimize = false;
        item.zIndex = _this.zIndex;
      } else {
        item.$windowElem.removeClass("twin_desktop_window_active");
        item.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
      }
    });
  });
};
// 窗口拖动
DesktopWindow.prototype.drag = function(options) {
  let _this = this;
  // 窗口变大-上
  this.$windowTopElem = $(`<div class="twin_desktop_window_top"></div>`);
  this.$windowLeftElem = $(`<div class="twin_desktop_window_left"></div>`);
  this.$windowRightElem = $(`<div class="twin_desktop_window_right"></div>`);
  this.$windowBottomElem = $(`<div class="twin_desktop_window_bottom"></div>`);
  this.$windowElem
    .append(this.$windowTopElem)
    .append(this.$windowLeftElem)
    .append(this.$windowRightElem)
    .append(this.$windowBottomElem);
  this.$body = $(document.body);
  

  this.$body.on("mousemove", function(e) {
    if (!allowMouse) {
      return false;
    }
    if (_this.windowMouseType == "drag") {
      let windowTop = e.clientY - startClientY;
      let windowLeft = e.clientX - startClientX;
      let windowBottom = _this.bottom - windowTop;
      if (windowBottom > options.clientHeight - 40) {
        windowBottom = options.clientHeight - 40;
      }
      _this.$windowElem
        .css("top", _this.top + windowTop + "px")
        .css("left", _this.left + windowLeft + "px")
        .css("right", _this.right - windowLeft + "px")
        .css("bottom", windowBottom + "px");
      let top = "0px";
      let left = "0px";
      let right = "0px";
      let bottom = "40px";
      if (e.clientY < 30) {
        top = "0px";
        bottom = "50%";
      } else if (e.clientY > options.clientHeight - 70) {
        top = "50%";
        bottom = "40px";
      }
      if (e.clientX < 30) {
        left = "0px";
        right = "50%";
      } else if (e.clientX > options.clientWidth - 30) {
        left = "50%";
        right = "0px";
      }
      if (top == "0px" && bottom == "40px" && left == "0px" && right == "0px") {
        options.$positionFrame
          .css("top", "initial")
          .css("bottom", "initial")
          .css("left", "initial")
          .css("right", "initial");
      } else {
        options.$positionFrame
          .css("top", top)
          .css("bottom", bottom)
          .css("left", left)
          .css("right", right);
      }
    } else if (_this.windowMouseType == "sizeTop") {
      let distance = e.clientY - startClientY;
      if (distance > 0) {
        distance = -distance;
      } else {
        distance = Math.abs(distance);
      }
      _this.$windowElem.css("top", _this.top - distance + "px");
    } else if (_this.windowMouseType == "sizeBottom") {
      let distance = e.clientY - startClientY;
      _this.$windowElem.css("bottom", _this.bottom - distance + "px");
    } else if (_this.windowMouseType == "sizeLeft") {
      let distance = e.clientX - startClientX;
      if (distance > 0) {
        distance = -distance;
      } else {
        distance = Math.abs(distance);
      }
      let left = _this.left - distance;
      _this.$windowElem.css("left", left + "px");
    } else if (_this.windowMouseType == "sizeRight") {
      let distance = e.clientX - startClientX;
      _this.$windowElem.css("right", _this.right - distance + "px");
    } else if (_this.windowMouseType == "bottomBarDrag") { 
      let distance = e.clientX - startClientX;
      _this.$bottomBarElem.css("position", "relative").css("left", distance + "px").css("opacity", 0.7);
      console.log(_this.$bottomBarElem[0].width);
    }
  });
  this.$body.on("mouseup", function(e) {
    if (!allowMouse) {
      return false;
    }
    if (_this.windowMouseType == "drag") {
      let top = 0;
      let left = 0;
      let right = 0;
      let bottom = 40;
      if (e.clientY < 30) {
        top = 0;
        bottom = (options.clientHeight - 40) / 2 + 40;
      } else if (e.clientY > options.clientHeight - 70) {
        top = (options.clientHeight - 40) / 2;
        bottom = 40;
      }
      if (e.clientX < 30) {
        left = 0;
        right = options.clientWidth / 2;
      } else if (e.clientX > options.clientWidth - 30) {
        left = options.clientWidth / 2;
        right = 0;
      }
      if (top == 0 && bottom == 40 && left == 0 && right == 0) {
        let windowTop = e.clientY - startClientY;
        let windowLeft = e.clientX - startClientX;
        _this.bottom = _this.bottom - windowTop;
        if (_this.bottom > options.clientHeight - 40) {
          _this.bottom = options.clientHeight - 40;
        }
        _this.top = _this.top + windowTop;
        _this.left = _this.left + windowLeft;
        _this.right = _this.right - windowLeft;
        _this.$windowElem
          .css("top", _this.top + "px")
          .css("left", _this.left + "px")
          .css("right", _this.right + "px")
          .css("bottom", _this.bottom + "px");
      } else {
        options.$positionFrame
          .css("top", "initial")
          .css("bottom", "initial")
          .css("left", "initial")
          .css("right", "initial");
        _this.top = top;
        _this.bottom = bottom;
        _this.left = left;
        _this.right = right;
        _this.$windowElem
          .css("top", top + "px")
          .css("bottom", bottom + "px")
          .css("left", left + "px")
          .css("right", right + "px");
      }
    } else if (_this.windowMouseType == "sizeTop") {
      let distance = e.clientY - startClientY;
      if (distance > 0) {
        distance = -distance;
      } else {
        distance = Math.abs(distance);
      }
      _this.top = _this.top - distance;
      _this.$windowElem.css("top", _this.top + "px");
    } else if (_this.windowMouseType == "sizeBottom") {
      let distance = e.clientY - startClientY;
      _this.bottom = _this.bottom - distance;
      _this.$windowElem.css("bottom", _this.bottom + "px");
    } else if (_this.windowMouseType == "sizeLeft") {
      let distance = e.clientX - startClientX;
      if (distance > 0) {
        distance = -distance;
      } else {
        distance = Math.abs(distance);
      }
      _this.left = _this.left - distance;
      _this.$windowElem.css("left", _this.left + "px");
    } else if (_this.windowMouseType == "sizeRight") {
      let distance = e.clientX - startClientX;
      _this.right = _this.right - distance;
      _this.$windowElem.css("right", _this.right + "px");
    }
    _this.windowMouseType = false;
    startClientX = 0;
    startClientY = 0;
  });
  this.$windowNavbarInfoElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "drag";
    startClientX = e.clientX;
    startClientY = e.clientY;
  });
  // 窗口向上变大
  this.$windowTopElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "sizeTop";
    startClientY = e.clientY;
  });
  // 窗口向下变大
  this.$windowBottomElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "sizeBottom";
    startClientY = e.clientY;
  });
  // 窗口向左变大
  this.$windowLeftElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "sizeLeft";
    startClientX = e.clientX;
  });
  // 窗口向右变大
  this.$windowRightElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "sizeRight";
    startClientX = e.clientX;
  });
};
// 最小化所有窗口
export function allMin() { 
  desktopWindowList.forEach((item) => {
    if (!item.minimize) {
      item.onMinimize();
      item.minimize = true;
    }
  });
}
// 展开所有窗口
export function allShow() {
  desktopWindowList.forEach((item) => {
    if (item.minimize) {
      item.onShow();
    }
  });
}
// 创建点击菜单
function DesktopClickMenu(options, data) {
  options.$clickMenu[0].innerHTML = "";
  data.dataList.forEach((item) => {
    let $element = $(item.elem);
    $element.on("click", function() {
      item.click();
      $element.off("click", function() {});
      options.$clickMenu.hide();
    });
    options.$clickMenu.append($element);
  });
  let top = data.clientY;
  let left = data.clientX;
  let height = data.dataList.length * 40;
  if (options.clientHeight - 43 < top + height) {
    top = options.clientHeight - 43 - height;
  }
  if (options.clientWidth < left + 190) {
    top = options.clientHeight - 190;
  }
  options.$clickMenu
    .css("top", top + "px")
    .css("left", left + "px")
    .show();
}
