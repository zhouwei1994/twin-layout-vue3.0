import { $ } from "./../dom.js";
let windowZIndex = 50;
let windowNum = 0;
let allowMouse = true;

let desktopWindowList = [];
// 窗口
export default function DesktopWindow(options, data) {
  if (!data.openMore) {
    let prohibit = false;
    desktopWindowList.forEach((item) => {
      if (item.name == data.name) {
        item.onShow(options);
        prohibit = true;
      }
    });
    if (prohibit) {
      return;
    }
  }
  const _this = this;
  this.data = data;
  this.elemId = "twin_desktop_window" + windowNum;
  this.windowMouseType = false;
  this.minimize = false;
  this.zIndex = windowZIndex;
  if (options.mobile) {
    this.top = 0;
    this.left = 0;
    this.right = 0;
    this.bottom = 0;
  } else {
    let startTop = options.clientHeight * 0.1;
    let startLeft = options.clientWidth * 0.15;
    this.top = 40 * windowNum;
    this.left = 40 * windowNum;
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
  }

  // 窗口
  this.$windowElem = $(
    `<div class="twin_desktop_window twin_desktop_window_active" style="top: ${this.top}px;left: ${this.left}px;right: ${this.right}px;bottom: ${this.bottom}px;z-index:${this.zIndex};"></div>`
  );
  // 窗口导航栏
  this.$windowNavbarElem = $(`<div class="twin_desktop_window_navbar"></div>`);
  // 窗口导航栏信息
  let $NavbarInfoHtml = `<div class="win_desktop_window_navbar_info">`;
  if (data.meta.iconType == "image") {
    $NavbarInfoHtml += `<i class="twin_desktop_window_navbar_image" style="background-image: url(${data.meta.icon});"></i>`;
  } else if (data.meta.iconType == "icon") {
    $NavbarInfoHtml += `<i class="twin_desktop_window_navbar_icon" style="font-family: ${data.meta.fontFamily};color:${data.meta.color};">${data.meta.icon}</i>`;
  }
  this.$windowNavbarInfoElem = $(
    $NavbarInfoHtml +
      `<span class="twin_desktop_window_navbar_text">${data.meta.title}</span></div>`
  );
  // 窗口容器
  let windowContainerHtml = `<div class="twin_desktop_window_container" id="${this.elemId}">`
  if (data.type == "content") {
    windowContainerHtml += data.content;
  }
  let $windowContainerElem = $(windowContainerHtml + `</div>`);
  this.iframeWindow = {};
  if (data.type == "iframe") { 
    let iframeId = 'twin_desktop_window_iframe' + windowNum;
    this.$windowIframeElem = $(
      `<iframe class="twin_desktop_window_container_iframe" id="${iframeId}" name="${this.elemId}" src="${data.path}"></iframe>`
    );
    $windowContainerElem.append(this.$windowIframeElem);
    this.$windowIframeElem[0].onload = function () {
      let contentWindow = _this.$windowIframeElem[0].contentWindow;
      if (contentWindow && contentWindow.window) {
        _this.iframeWindow = contentWindow.window;
        _this.iframeWindow.iframeId = iframeId;
        _this.iframeWindow.layoutType = "desktop";
        _this.iframeWindow.iframeData = data;
        _this.iframeWindow.userInfo = options.userInfo;
        _this.iframeWindow.onLoad && _this.iframeWindow.onLoad(options.userInfo);
      }
    }
  }
  this.$windowNavbarElem.append(this.$windowNavbarInfoElem);
  this.$windowElem.append(this.$windowNavbarElem).append($windowContainerElem);
  options.$loadContainer.append(this.$windowElem);
  this.operating(options);
  let desktopWindowItem = {
    $windowElem: this.$windowElem,
    elemId: this.elemId,
    minimize: this.minimize,
    zIndex: this.zIndex,
    onRemove: this.removeWindow.bind(this),
    onShow: this.showWindow.bind(this),
    onMinimize: this.onMinimize.bind(this),
    ...data,
  };
  // 移除其他窗口状态
  desktopWindowList.forEach((item) => {
    item.$windowElem.removeClass("twin_desktop_window_active");
    if (!options.mobile) {
      item.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
    }
  });
  if (!options.mobile) {
    this.BottomBar(options);
    this.drag(options);
    desktopWindowItem.$bottomBarElem = this.$bottomBarElem;
  }
  // 添加到窗口列表
  desktopWindowList.push(desktopWindowItem);
  //创建完成后更新全局变量
  windowNum++;
  windowZIndex++;
  this.callback = {
    el: "#" + this.elemId,
    element: this.$windowElem,
    ...data,
    onHide: undefined,
    layoutType: "desktop"
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
  if (this.data.type == "iframe") {
    try {
      this.iframeWindow.onUnload && this.iframeWindow.onUnload();
    } catch (error) {
      console.error("iframe存在跨域问题，无法与iframe通信");
    }
  }
  // 解除绑定的事件
  this.$windowCloseElem.off("click", function() {});
  this.$windowRefreshElem.off("click", function() {});
  if (!options.mobile) {
    this.$windowMinElem.off("click", function() {});
    this.$windowfullScreenElem.off("click", function() {});
    this.$bottomBarElem.off("click", function() {});
    this.$bottomBarElem.off("mousedown", function() {});
    this.$bottomBarElem.off("contextmenu", function() {});
    this.$windowNavbarInfoElem.off("mousedown", function() {});
    this.$windowTopElem.off("mousedown", function() {});
    this.$windowBottomElem.off("mousedown", function() {});
    this.$windowLeftElem.off("mousedown", function() {});
    this.$windowRightElem.off("mousedown", function() {});
    options.$body.off("mousemove", function() {});
    options.$body.off("mouseup", function() {});
    // 底部菜单
    this.$bottomBarElem.remove();
  }
  // 删除当前窗口
  this.$windowElem.remove();
  if (de) {
    desktopWindowList.forEach((item, index) => {
      if (this.elemId == item.elemId) {
        desktopWindowList.splice(index, 1);
      }
    });
  }
};
// 显示窗口
DesktopWindow.prototype.showWindow = function(options) {
  if (this.zIndex !== windowZIndex) {
    this.$windowElem.css("z-index", windowZIndex);
    this.zIndex = windowZIndex;
    windowZIndex++;
  }
  this.$windowElem.show();
  desktopWindowList.forEach((item) => {
    if (item.elemId == this.elemId) {
      item.$windowElem.addClass("twin_desktop_window_active");
      if (!options.mobile) {
        item.$bottomBarElem.addClass("twin_desktop_bottom_bar_active");
      }
      item.minimize = false;
      item.zIndex = this.zIndex;
    } else {
      item.$windowElem.removeClass("twin_desktop_window_active");
      if (!options.mobile) {
        item.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
      }
    }
  });
  this.minimize = false;
  this.callback.onShow && this.callback.onShow();
  if (this.data.type == "iframe") { 
    try {
      this.iframeWindow.onShow && this.iframeWindow.onShow();
    } catch (error) {
      console.error("iframe存在跨域问题，无法与iframe通信");
    }
  }
};
// 最小化
DesktopWindow.prototype.onMinimize = function(options) {
  this.$windowElem.removeClass("twin_desktop_window_active");
  if (!options.mobile) {
    this.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
  }
  this.$windowElem.hide();
  this.minimize = true;
  this.callback.onHide && this.callback.onHide();
  if (this.data.type == "iframe") {
    try {
      this.iframeWindow.onHide && this.iframeWindow.onHide();
    } catch (error) {
      console.error("iframe存在跨域问题，无法与iframe通信");
    }
  }
};
// 底部菜单
DesktopWindow.prototype.BottomBar = function(options) {
  let _this = this;
  // 底部导航创建
  let $bottombarHtml = `<div class="twin_desktop_bottom_bar_item twin_desktop_bottom_bar_active" data-id="${this.elemId}">`;
  if (this.data.meta.iconType == "image") {
    $bottombarHtml += `<i class="twin_desktop_bottom_bar_image" style="background-image: url(${this.data.meta.icon});"></i>`;
  } else if (this.data.meta.iconType == "icon") {
    $bottombarHtml += `<i class="twin_desktop_bottom_bar_icon" style="font-family: ${this.data.meta.fontFamily};color:${this.data.meta.color};">${this.data.meta.icon}</i>`;
  }
  this.$bottomBarElem = $(
    $bottombarHtml +
      `<span class="twin_desktop_bottom_bar_text">${this.data.meta.title}</span></div>`
  );
  options.$bottomBarContainer.append(this.$bottomBarElem);
  // 底部菜单拖动
  this.$bottomBarElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    let bottomBarElem = _this.$bottomBarElem[0];
    _this.bottomBarElemWidth = bottomBarElem.offsetWidth;
    _this.bottomBarElemOffsetLeft = bottomBarElem.offsetLeft;
    options.$bottomBarContainer.childNodes().forEach((item, index) => {
      if (_this.$bottomBarElem.equal(item)) {
        _this.bottomBarElemIndex = index;
      }
    });
    _this.$bottomBarNewElem = _this.$bottomBarElem.clone(true);
    _this.$bottomBarNewElem
      .addClass("twin_desktop_bottom_bar_item_drag")
      .css("left", _this.bottomBarElemOffsetLeft + "px")
      .css("width", _this.bottomBarElemWidth + "px");
    options.$loadContainer.append(_this.$bottomBarNewElem);
    _this.$bottomBarElem.css("opacity", 0);
    _this.windowMouseType = "bottomBarDrag";
    _this.startClientX = e.clientX;
    _this.startClientY = e.clientY;
  });
  // 底部菜单右键点击
  this.$bottomBarElem.on("contextmenu", function(e) {
    DesktopClickMenu(options, {
      clientX: e.clientX,
      clientY: e.clientY,
      dataList: [
        {
          elem: `<div class="twin_desktop_click_menu_item">
                        <i class="twin_layout_icon_garden_close"></i>
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
                        <i class="twin_layout_icon_garden_close"></i>
                        <span>关闭其他</span>
                    </div>`,
          click: function() {
            desktopWindowList = desktopWindowList.filter((item) => {
              if (item.elemId == _this.elemId) {
                return true;
              } else {
                item.onRemove(options, false);
                return false;
              }
            });
            _this.highlight(undefined, options);
          },
        },
        {
          elem: `<div class="twin_desktop_click_menu_item">
                        <i class="twin_layout_icon_close"></i>
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
DesktopWindow.prototype.highlight = function(elemId, options) {
  let len = desktopWindowList.length;
  let maxZIndex = 0;
  let maxIndex = 0;
  for (let index = len - 1; index >= 0; index--) {
    const element = desktopWindowList[index];
    if (elemId && elemId == element.elemId) {
      element.minimize = true;
    } else {
      element.$windowElem.removeClass("twin_desktop_window_active");
      if (!options.mobile) {
        element.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
      }
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
      if (!options.mobile) {
        openItem.$bottomBarElem.addClass("twin_desktop_bottom_bar_active");
      }
    }
  }, 10);
};
// 窗口点击
DesktopWindow.prototype.windowClick = function(options) {
  if (this.zIndex !== windowZIndex) {
    this.$windowElem.css("z-index", windowZIndex);
    this.zIndex = windowZIndex;
    windowZIndex++;
    desktopWindowList.forEach((item) => {
      if (item.elemId == this.elemId) {
        item.$windowElem.addClass("twin_desktop_window_active");
        if (!options.mobile) {
          item.$bottomBarElem.addClass("twin_desktop_bottom_bar_active");
        }
        item.minimize = false;
        item.zIndex = this.zIndex;
      } else {
        item.$windowElem.removeClass("twin_desktop_window_active");
        if (!options.mobile) {
          item.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
        }
      }
    });
  }
};
// 窗口操作
DesktopWindow.prototype.operating = function(options) {
  let _this = this;
  // 窗口操作容器
  let $windowOperatingElem = $(
    `<div class="win_desktop_window_navbar_operating"></div>`
  );
  // 窗口刷新
  this.$windowRefreshElem = $(`<i class="twin_layout_icon_refresh"></i>`);

  // 窗口关闭
  this.$windowCloseElem = $(`<i class="twin_layout_icon_close"></i>`);
  $windowOperatingElem.append(this.$windowRefreshElem);
  if (!options.mobile) {
    // 窗口最小化
    this.$windowMinElem = $(`<i class="twin_layout_icon_min"></i>`);
    // 窗口全屏、窗口切换
    this.$windowfullScreenElem = $(
      `<i class="twin_layout_icon_window_screen"></i>`
    );
    $windowOperatingElem
      .append(this.$windowMinElem)
      .append(this.$windowfullScreenElem);
    // 窗口调整
    this.$windowfullScreenElem.on("click", function(e) {
      if (_this.$windowElem.hasClass("twin_desktop_window_full_screen")) {
        allowMouse = true;
        _this.$windowElem.removeClass("twin_desktop_window_full_screen");
      } else {
        allowMouse = false;
        _this.$windowElem.addClass("twin_desktop_window_full_screen");
      }
      _this.windowClick(options);
      e.stopPropagation(e);
    });
    // 窗口最小化
    this.$windowMinElem.on("click", function(e) {
      _this.onMinimize(options);
      _this.highlight(_this.elemId, options);
      e.stopPropagation();
    });
  }
  $windowOperatingElem.append(this.$windowCloseElem);
  this.$windowNavbarElem.append($windowOperatingElem);

  // 窗口刷新
  this.$windowRefreshElem.on("click", function(e) {
    _this.windowClick(options);
    if (_this.data.type == "iframe") {
      let url = _this.data.path;
      if (url.indexOf("?") != -1) { 
        url += "&t=" + new Date().getTime();
      } else {
        url += "?t=" + new Date().getTime();
      }
      _this.$windowIframeElem.attr('src', url);
    } else if (_this.data.type == "vue") { 
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
    }
    e.stopPropagation();
  });

  // 窗口关闭
  this.$windowCloseElem.on("click", function(e) {
    _this.removeWindow(options);
    _this.highlight(undefined, options);
    e.stopPropagation();
  });

  // 窗口点击
  this.$windowElem.on("click", function() {
    _this.windowClick(options);
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
  _this.startClientX = 0;
  _this.startClientY = 0;
  options.$body.on("mousemove", function(e) {
    if (!allowMouse) {
      return false;
    }
    if (_this.windowMouseType == "drag") {
      let windowTop = e.clientY - _this.startClientY;
      let windowLeft = e.clientX - _this.startClientX;
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
      let distance = e.clientY - _this.startClientY;
      if (distance > 0) {
        distance = -distance;
      } else {
        distance = Math.abs(distance);
      }
      _this.$windowElem.css("top", _this.top - distance + "px");
    } else if (_this.windowMouseType == "sizeBottom") {
      let distance = e.clientY - _this.startClientY;
      _this.$windowElem.css("bottom", _this.bottom - distance + "px");
    } else if (_this.windowMouseType == "sizeLeft") {
      let distance = e.clientX - _this.startClientX;
      if (distance > 0) {
        distance = -distance;
      } else {
        distance = Math.abs(distance);
      }
      let left = _this.left - distance;
      _this.$windowElem.css("left", left + "px");
    } else if (_this.windowMouseType == "sizeRight") {
      let distance = e.clientX - _this.startClientX;
      _this.$windowElem.css("right", _this.right - distance + "px");
    } else if (_this.windowMouseType == "bottomBarDrag") {
      let distance = e.clientX - _this.startClientX;
      let moves = Math.abs(distance) / _this.bottomBarElemWidth;
      let movesInt = parseInt(moves);
      _this.$bottomBarNewElem.css(
        "left",
        _this.bottomBarElemOffsetLeft + distance + "px"
      );
      if (moves >= 0.5) {
        let positionIndex = 0;
        if (distance > 0) {
          positionIndex = movesInt + _this.bottomBarElemIndex;
        } else {
          positionIndex = _this.bottomBarElemIndex - movesInt;
        }

        let $bottomBarContainerList = options.$bottomBarContainer[0].childNodes;
        if (
          positionIndex >= 0 &&
          positionIndex <= $bottomBarContainerList.length
        ) {
          let finallyIndex = positionIndex;
          if (moves - movesInt >= 0.5) {
            finallyIndex = positionIndex + 1;
          }
          options.$bottomBarContainer[0].insertBefore(
            _this.$bottomBarElem[0],
            $bottomBarContainerList[finallyIndex]
          );
          if (distance > 0) {
            _this.startClientX += movesInt * _this.bottomBarElemWidth;
            _this.bottomBarElemOffsetLeft +=
              movesInt * _this.bottomBarElemWidth;
          } else {
            _this.startClientX -= movesInt * _this.bottomBarElemWidth;
            _this.bottomBarElemOffsetLeft -=
              movesInt * _this.bottomBarElemWidth;
          }
          _this.bottomBarElemIndex = positionIndex;
        }
      }
    }
  });
  options.$body.on("mouseup", function(e) {
    if (!allowMouse) {
      return false;
    }
    if (_this.windowMouseType == "drag") {
      let top = 0;
      let left = 0;
      let right = 0;
      let bottom = 40;
      if (
        Math.abs(e.clientX - _this.startClientX) >= 5 ||
        Math.abs(e.clientY - _this.startClientY) >= 5
      ) {
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
          let windowTop = e.clientY - _this.startClientY;
          let windowLeft = e.clientX - _this.startClientX;
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
      }
    } else if (_this.windowMouseType == "sizeTop") {
      let distance = e.clientY - _this.startClientY;
      if (distance > 0) {
        distance = -distance;
      } else {
        distance = Math.abs(distance);
      }
      _this.top = _this.top - distance;
      _this.$windowElem.css("top", _this.top + "px");
    } else if (_this.windowMouseType == "sizeBottom") {
      let distance = e.clientY - _this.startClientY;
      _this.bottom = _this.bottom - distance;
      _this.$windowElem.css("bottom", _this.bottom + "px");
    } else if (_this.windowMouseType == "sizeLeft") {
      let distance = e.clientX - _this.startClientX;
      if (distance > 0) {
        distance = -distance;
      } else {
        distance = Math.abs(distance);
      }
      _this.left = _this.left - distance;
      _this.$windowElem.css("left", _this.left + "px");
    } else if (_this.windowMouseType == "sizeRight") {
      let distance = e.clientX - _this.startClientX;
      _this.right = _this.right - distance;
      _this.$windowElem.css("right", _this.right + "px");
    } else if (_this.windowMouseType == "bottomBarDrag") {
      _this.$bottomBarNewElem.remove();
      _this.$bottomBarElem.css("opacity", 1);
      let distanceX = e.clientX - _this.startClientX;
      let distanceY = e.clientY - _this.startClientY;
      if (Math.abs(distanceX) < 5 && Math.abs(distanceY) < 5) {
        _this.showWindow(options);
      }
    }
    _this.windowMouseType = false;
    _this.startClientX = 0;
    _this.startClientY = 0;
  });
  this.$windowNavbarInfoElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "drag";
    _this.startClientX = e.clientX;
    _this.startClientY = e.clientY;
  });
  // 窗口向上变大
  this.$windowTopElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "sizeTop";
    _this.startClientY = e.clientY;
  });
  // 窗口向下变大
  this.$windowBottomElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "sizeBottom";
    _this.startClientY = e.clientY;
  });
  // 窗口向左变大
  this.$windowLeftElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "sizeLeft";
    _this.startClientX = e.clientX;
  });
  // 窗口向右变大
  this.$windowRightElem.on("mousedown", function(e) {
    if (!allowMouse) {
      return false;
    }
    _this.windowMouseType = "sizeRight";
    _this.startClientX = e.clientX;
  });
};
// 最小化所有窗口
export function allMin(options) {
  desktopWindowList.forEach((item) => {
    if (!item.minimize) {
      item.onMinimize(options);
      item.minimize = true;
    }
  });
}
// 展开所有窗口
export function allShow(options) {
  desktopWindowList.forEach((item) => {
    if (item.minimize) {
      item.onShow(options);
    }
  });
}
// 删除所有
export function windowAllDelete(options) {
  desktopWindowList.forEach((item) => {
    item.onRemove(options, false);
  });
  desktopWindowList = [];
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
  let height = data.dataList.length * 36;
  console.log(options.clientHeight);
  if (options.clientHeight - 40 < top + height) {
    top = options.clientHeight - 40 - height;
  }
  if (options.clientWidth < left + 190) {
    left = options.clientHeight - 190;
  }
  options.$clickMenu
    .css("top", top + "px")
    .css("left", left + "px")
    .show();
}
