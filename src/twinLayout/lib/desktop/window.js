import { $ } from "./../dom.js"
let windowZIndex = 1;
let windowNum = 0;
let allowMouse = true;
let desktopWindowList = [];
// 窗口
export default function DesktopWindow(options, data) {
    if (!data.openMore) {
        let prohibit = false;
        desktopWindowList.forEach(item => {
            if (item.name == data.name) {
                item.show();
                prohibit = true;
            }
        });
        if (prohibit) {
            return;
        }
    }
    this.data = data;
    this.elemId = 'twin_desktop_window' + windowNum;
    let startTop = options.clientHeight * 0.10;
    let startLeft = options.clientWidth * 0.15;
    this.top = 40 * windowNum;
    this.left = 40 * windowNum;
    this.minimize = false;
    this.width = options.clientWidth * 0.7;
    this.height = options.clientHeight * 0.7;
    this.zIndex = windowZIndex;
    if (options.clientHeight * 0.2 < this.top) {
        this.top = startTop + Math.ceil(Math.random() * (startTop));
    } else {
        this.top += startTop;
    }
    if (startLeft < this.left) {
        this.left = startLeft + Math.ceil(Math.random() * (startLeft));
    } else {
        this.left += startLeft;
    }
    // 窗口
    this.$windowElem = $(`<div class="twin_desktop_window twin_desktop_window_active" style="top: ${this.top}px;left: ${this.left}px;height: ${this.height}px;width: ${this.width}px;z-index:${this.zIndex};"></div>`);
    // 窗口导航栏
    this.$windowNavbarElem = $(`<div class="twin_desktop_window_navbar"></div>`);
    // 窗口导航栏信息
    this.$windowNavbarInfoElem = $(`<div class="win_desktop_window_navbar_info">
        <i class="twin_desktop_window_navbar_icon" style="background-image: url(${ data.icon});"></i>
        <span class="twin_desktop_window_navbar_text">${ data.title}</span>
    </div>`);
    // 窗口容器
    let $windowContainerElem = $(`<div class="twin_desktop_window_container" id="${this.elemId}"></div>`);
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
        minimize: this.minimize,
        remove: this.removeWindow,
        show: this.showWindow,
        ...data,
    });
    //创建完成后更新全局变量
    windowNum++;
    windowZIndex++;
    setTimeout(() => {
        options.open({
            el: "#" + this.elemId,
            element: this.$windowElem,
            ...data
        });
    });
}
// 删除窗口
DesktopWindow.prototype.removeWindow = function (options, de = true) { 
    options.remove && options.remove({
        el: "#" + this.elemId,
        element: this.$windowElem,
        ...this.data
    });
    // 解除绑定的事件
    this.$windowMinElem.off("click", function () { });
    this.$windowfullScreenElem.off("click", function () { });
    this.$windowCloseElem.off("click", function () { });
    this.$windowRefreshElem.off("click", function () { });
    this.$windowNavbarInfoElem.off("mousedown", function () { });
    this.$windowTopElem.off("mousedown", function () { });
    this.$windowBottomElem.off("mousedown", function () { });
    this.$windowLeftElem.off("mousedown", function () { });
    this.$windowRightElem.off("mousedown", function () { });
    this.$body.off("mousemove", function () { });
    this.$body.off("mouseup", function () { });
    this.$bottomBarElem.off("click", function () { });
    this.$bottomBarElem.off("contextmenu", function () { });
    // 删除当前窗口
    this.$windowElem.remove();
    // 底部菜单
    this.$bottomBarElem.remove();
    if (de) {
        desktopWindowList.forEach((item, index) => {
            if (this.elemId == item.el) {
                desktopWindowList.splice(index, 1);
            }
        });
        if (desktopWindowList.length >= 1) {
            desktopWindowList[desktopWindowList.length - 1].show();
        }
    }
}
// 显示窗口
DesktopWindow.prototype.showWindow = function () {
    let _this = this;
    if (this.zIndex !== windowZIndex) {
        this.$windowElem.css("z-index", windowZIndex);
        windowZIndex++;
    }
    this.$windowElem.show();
    desktopWindowList.forEach((item) => {
        item.$windowElem.removeClass("twin_desktop_window_active");
        item.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
    });
    setTimeout(function () {
        _this.$windowElem.addClass("twin_desktop_window_active");
        _this.$bottomBarElem.addClass("twin_desktop_bottom_bar_active");
    });
    this.minimize = false;
}
// 底部菜单
DesktopWindow.prototype.BottomBar = function (options) {
    let _this = this;
    // 底部导航创建
    this.$bottomBarElem = $(`<div class="twin_desktop_bottom_bar_item twin_desktop_bottom_bar_active" data-id="${this.elemId}">
        <i class="twin_desktop_bottom_bar_icon" style="background-image: url(${ this.data.icon});"></i>
        <span class="twin_desktop_bottom_bar_text">${ this.data.title}</span>
    </div>`);
    options.$bottomBarContainer.append(this.$bottomBarElem);
    // 底部菜单点击
    this.$bottomBarElem.on("click", this.showWindow.bind(this));
    // 底部菜单右键点击
    this.$bottomBarElem.on("contextmenu", function (e) {
        DesktopClickMenu(options, {
            clientX: e.clientX,
            clientY: e.clientY,
            dataList: [
                {
                    elem: `<div class="twin_desktop_click_menu_item">
                        <i class="twin_desktop_click_menu_all_close"></i>
                        <span>关闭全部</span>   
                    </div>`,
                    click: function () {
                        desktopWindowList.forEach(item => {
                            item.remove(options,false);
                        });
                        desktopWindowList = [];
                    }
                },
                {
                    elem: `<div class="twin_desktop_click_menu_item">
                        <i class="twin_desktop_click_menu_all_close"></i>
                        <span>关闭其他</span>
                    </div>`,
                    click: function () {
                        desktopWindowList = desktopWindowList.filter(item => {
                            if (item.el == _this.elemId) {
                                return true;
                            } else {
                                item.remove(options,false);
                                return false;
                            }
                        });
                        if (desktopWindowList.length >= 1) {
                            desktopWindowList[desktopWindowList.length - 1].show();
                        }
                    }
                },
                {
                    elem: `<div class="twin_desktop_click_menu_item">
                        <i class="twin_desktop_click_menu_close"></i>
                        <span>关闭当前</span>
                    </div>`,
                    click: function () {
                        _this.removeWindow(options);
                    }
                }
            ]
        });
        e.returnValue = false;
        e.stopPropagation();
    });
}
// 窗口操作
DesktopWindow.prototype.operating = function (options) {
    let _this = this;
    // 窗口操作容器
    let $windowOperatingElem = $(`<div class="win_desktop_window_navbar_operating"></div>`);
    // 窗口最小化
    this.$windowMinElem = $(`<i class="twin_desktop_window_operating_min"></i>`);
    // 窗口全屏、窗口切换
    this.$windowfullScreenElem = $(`<i class="twin_desktop_window_operating_full_screen"></i>`);
    // 窗口刷新
    this.$windowRefreshElem = $(`<i class="twin_desktop_window_operating_refresh"></i>`);
    // 窗口关闭
    this.$windowCloseElem = $(`<i class="twin_desktop_window_operating_close"></i>`);
    $windowOperatingElem.append(this.$windowRefreshElem).append(this.$windowMinElem).append(this.$windowfullScreenElem).append(this.$windowCloseElem);
    this.$windowNavbarElem.append($windowOperatingElem);
    // 窗口刷新
    this.$windowRefreshElem.on("click", function (e) {
        options.remove && options.remove({
            el: "#" + _this.elemId,
            element: _this.$windowElem,
            ..._this.data
        });
        setTimeout(() => {
            options.open({
                el: "#" + _this.elemId,
                element: _this.$windowElem,
                ..._this.data
            });
        });
        e.stopPropagation();
    });
    // 窗口调整
    this.$windowfullScreenElem.on("click", function (e) {
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
    this.$windowCloseElem.on("click", function (e) {
        _this.removeWindow(options);
        e.stopPropagation();
    });
    // 窗口最小化
    this.$windowMinElem.on("click", function (e) {
        _this.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
        _this.$windowElem.removeClass("twin_desktop_window_active");
        _this.$windowElem.hide();
        if (desktopWindowList.length >= 1) {
            desktopWindowList[desktopWindowList.length - 1].show();
        }
        _this.minimize = true;
        e.stopPropagation();
    });
    // 窗口点击
    this.$windowElem.on("click", function () {
        if (_this.zIndex !== windowZIndex) {
            _this.$windowElem.css("z-index", windowZIndex);
            windowZIndex++;
        }
        desktopWindowList.forEach((item) => {
            item.$windowElem.removeClass("twin_desktop_window_active");
            item.$bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
        });
        _this.$windowElem.addClass("twin_desktop_window_active");
        _this.$bottomBarElem.addClass("twin_desktop_bottom_bar_active");
    });
}
// 窗口拖动
DesktopWindow.prototype.drag = function () {
    let _this = this;
    // 窗口变大-上
    this.$windowTopElem = $(`<div class="twin_desktop_window_top"></div>`);
    this.$windowLeftElem = $(`<div class="twin_desktop_window_left"></div>`);
    this.$windowRightElem = $(`<div class="twin_desktop_window_right"></div>`);
    this.$windowBottomElem = $(`<div class="twin_desktop_window_bottom"></div>`);
    this.$windowElem.append(this.$windowTopElem)
        .append(this.$windowLeftElem).append(this.$windowRightElem).append(this.$windowBottomElem);
    this.$body = $(document.body);
    let windowMouseType = false;
    let startClientX = 0;
    let startClientY = 0;

    this.$body.on("mousemove", function (e) {
        if (!allowMouse) {
            return false;
        }
        if (windowMouseType == "drag") {
            _this.$windowElem.css("top", (_this.top + e.clientY - startClientY) + "px");
            _this.$windowElem.css("left", (_this.left + e.clientX - startClientX) + "px");
        } else if (windowMouseType == "sizeTop") {
            let distance = e.clientY - startClientY;
            if (distance > 0) {
                distance = -distance;
            } else {
                distance = Math.abs(distance);
            }
            _this.$windowElem.css("height", (_this.height + distance) + "px").css("top", (_this.top - distance) + "px");
        } else if (windowMouseType == "sizeBottom") {
            let distance = e.clientY - startClientY;
            _this.$windowElem.css("height", (_this.height + distance) + "px");
        } else if (windowMouseType == "sizeLeft") {
            let distance = e.clientX - startClientX;
            if (distance > 0) {
                distance = -distance;
            } else {
                distance = Math.abs(distance);
            }
            _this.$windowElem.css("width", (_this.width + distance) + "px").css("left", (_this.left - distance) + "px");
        } else if (windowMouseType == "sizeRight") {
            let distance = e.clientX - startClientX;
            _this.$windowElem.css("width", (_this.width + distance) + "px");
        }
    });
    this.$body.on("mouseup", function (e) {
        if (!allowMouse) {
            return false;
        }
        if (windowMouseType == "drag") {
            _this.top = _this.top + e.clientY - startClientY;
            _this.left = _this.left + e.clientX - startClientX;
            _this.$windowElem.css("top", _this.top + "px");
            _this.$windowElem.css("left", _this.left + "px");
        } else if (windowMouseType == "sizeTop") {
            let distance = e.clientY - startClientY;
            if (distance > 0) {
                distance = -distance;
            } else {
                distance = Math.abs(distance);
            }
            _this.top = _this.top - distance;
            _this.height = _this.height + distance;
            _this.$windowElem.css("height", _this.height + "px").css("top", _this.top + "px");
        } else if (windowMouseType == "sizeBottom") {
            let distance = e.clientY - startClientY;
            _this.height = _this.height + distance;
            _this.$windowElem.css("height", _this.height + "px");
        } else if (windowMouseType == "sizeLeft") {
            let distance = e.clientX - startClientX;
            if (distance > 0) {
                distance = -distance;
            } else {
                distance = Math.abs(distance);
            }
            _this.width = _this.width + distance;
            _this.left = _this.left - distance;
            _this.$windowElem.css("width", _this.width + "px").css("left", _this.left + "px");
        } else if (windowMouseType == "sizeRight") {
            let distance = e.clientX - startClientX;
            _this.width = _this.width + distance;
            _this.$windowElem.css("width", _this.width + "px");
        }
        windowMouseType = false;
        startClientX = 0;
        startClientY = 0;
    });
    this.$windowNavbarInfoElem.on("mousedown", function (e) {
        if (!allowMouse) {
            return false;
        }
        windowMouseType = "drag";
        startClientX = e.clientX;
        startClientY = e.clientY;
    });
    // 窗口向上变大
    this.$windowTopElem.on("mousedown", function (e) {
        if (!allowMouse) {
            return false;
        }
        windowMouseType = "sizeTop";
        startClientY = e.clientY;
    });
    // 窗口向下变大
    this.$windowBottomElem.on("mousedown", function (e) {
        if (!allowMouse) {
            return false;
        }
        windowMouseType = "sizeBottom";
        startClientY = e.clientY;
    });
    // 窗口向左变大
    this.$windowLeftElem.on("mousedown", function (e) {
        if (!allowMouse) {
            return false;
        }
        windowMouseType = "sizeLeft";
        startClientX = e.clientX;
    });
    // 窗口向右变大
    this.$windowRightElem.on("mousedown", function (e) {
        if (!allowMouse) {
            return false;
        }
        windowMouseType = "sizeRight";
        startClientX = e.clientX;
    });
}
// 创建点击菜单
function DesktopClickMenu(options, data) {
    options.$clickMenu[0].innerHTML = "";
    data.dataList.forEach(item => {
        let $element = $(item.elem);
        $element.on("click", function () {
            item.click();
            $element.off("click", function () { });
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
    options.$clickMenu.css("top", top + "px").css("left", left + "px").show();
}