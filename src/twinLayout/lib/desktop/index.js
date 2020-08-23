import { $ } from "./../dom.js"
import "./index.scss"
let config = {};
// 桌面背景
function DesktopBg(options) {
    let backgroundLength = options.background.length;
    let index = Math.floor(Math.random() * backgroundLength);
    let $elem = $('<div class="twin_desktop_bg" style="background-image: url(' + options.background[index] + ');"></div>');
    let $switchBgElem = $('<div class="twin_desktop_bg_switch" />');
    options.$loadContainer.append($elem);
    $elem.append($switchBgElem);
    $switchBgElem.on("click", function () {
        let index = Math.floor(Math.random() * backgroundLength);
        $elem.css("background-image", 'url(\'' + options.background[index] + '\');"></div>');
    });
}
// 桌面图标
function DesktopApp(options) {
    let appWidth = 100;
    let appHeight = 100;
    let appInterval = 20;
    let column = 0;
    options.menus().then(res => {
        if (res && Array.isArray(res) && res.length > 0) { 
            res.forEach((item, index) => {
                let currentIndex = index + 1;
                let top = appInterval * currentIndex + appHeight * index;
                let $elem = $(`<div class="twin_desktop_app_item" style="top:${ top }px;left:${  appWidth * column }px;">
                                <i class="twin_desktop_app_item_icon" style="background-image: url(${ item.icon });"></i>
                                <span class="twin_desktop_app_item_text">${ item.title }</span>
                            </div>`);
                options.$loadContainer.append($elem);
                if (top + appHeight + appInterval > options.clientHeight) { 
                    column += 1;
                }
                $elem.on("click", function () {
                    DesktopWindow(options, item);
                });
            });
        } else {
            alert("至少要有一个菜单");
        }
    });
}
let windowNum = 0;
// 窗口
function DesktopWindow(options, data) {
    let elemId = 'twin_desktop_window' + windowNum;
    let startTop = options.clientHeight * 0.15;
    let startLeft = options.clientWidth * 0.15;
    let top = 40 * windowNum;
    let left = 40 * windowNum;
    let width = options.clientWidth * 0.7;
    let height = options.clientHeight * 0.7;
    if (startTop < top) { 
        top = Math.ceil(Math.random() * (startTop));
    } else {
        top += startTop;
    }
    if (startLeft < left) { 
        left = Math.ceil(Math.random() * (startLeft));
    } else {
        left += startLeft;
    }
    // 窗口
    let $elem = $(`<div class="twin_desktop_window" style="top: ${ top }px;left: ${ left }px;height: ${ height }px;width: ${ width }px;"></div>`);
    // 窗口导航栏
    let $windowNavbarElem = $(`<div class="twin_desktop_window_navbar"></div>`);
    // 窗口导航栏信息
    let $windowNavbarInfoElem = $(`<div class="win_desktop_window_navbar_info">
        <i class="twin_desktop_window_navbar_icon" style="background-image: url(${ data.icon });"></i>
        <span class="twin_desktop_window_navbar_text">${ data.title }</span>
    </div>`);
    // 窗口容器
    let $windowContainerElem = $(`<div class="twin_desktop_window_container" id="${elemId}"></div>`);
    // 窗口操作容器
    let $windowOperatingElem = $(`<div class="win_desktop_window_navbar_operating"></div>`);
    // 窗口最小化
    let $windowMinElem = $(`<i class="twin_desktop_window_operating_min"></i>`);
    // 窗口全屏、窗口切换
    let $windowfullScreenElem = $(`<i class="twin_desktop_window_operating_full_screen"></i>`);
    // 窗口刷新
    let $windowRefreshElem = $(`<i class="twin_desktop_window_operating_refresh"></i>`);
    // 窗口关闭
    let $windowCloseElem = $(`<i class="twin_desktop_window_operating_close"></i>`);
    // 窗口变大-上
    let $windowTopElem = $(`<div class="twin_desktop_window_top"></div>`);
    let $windowLeftElem = $(`<div class="twin_desktop_window_left"></div>`);
    let $windowRightElem = $(`<div class="twin_desktop_window_right"></div>`);
    let $windowBottomElem = $(`<div class="twin_desktop_window_bottom"></div>`);
    $windowOperatingElem.append($windowRefreshElem).append($windowMinElem).append($windowfullScreenElem).append($windowCloseElem);
    $windowNavbarElem.append($windowNavbarInfoElem).append($windowOperatingElem);
    $elem.append($windowNavbarElem).append($windowContainerElem).append($windowTopElem)
        .append($windowLeftElem).append($windowRightElem).append($windowBottomElem);
    options.$loadContainer.append($elem);
    windowNum++;
    // 窗口关闭
    $windowCloseElem.on("click", function () {
        options.remove && options.remove({
            el: "#" + elemId,
            element: $elem,
            ...data
        });
        // 解除绑定的事件
        $windowMinElem.off("click", function () { });
        $windowfullScreenElem.off("click", function () { });
        $windowCloseElem.off("click", function () { });
        $windowRefreshElem.off("click", function () { });
        $windowNavbarInfoElem.off("mousedown", function () { });
        $windowNavbarInfoElem.off("mousemove", function () { });
        $windowNavbarInfoElem.off("mouseup", function () { });
        $windowNavbarInfoElem.off("mouseout", function () { });
        // 删除当前窗口
        $elem.remove();
    });
    // 窗口最小化
    $windowMinElem.on("click", function () {
        $elem.hide();
    });
    // 窗口最小化
    $windowfullScreenElem.on("click", function () {
        if ($elem.hasClass("twin_desktop_window_full_screen")) {
            $elem.removeClass("twin_desktop_window_full_screen");
        } else {
            $elem.addClass("twin_desktop_window_full_screen");
        }
    });
    // 窗口刷新
    $windowRefreshElem.on("click", function () {
        options.remove && options.remove({
            el: "#" + elemId,
            element: $elem,
            ...data
        });
        setTimeout(() => {
            options.open({
                el: "#" + elemId,
                element: $elem,
                ...data
            });
        });
    });
    // 窗口拖动
    let windowMouseType = false;
    let startClientX = 0;
    let startClientY = 0;
    let $body = $(document.body);
    $windowNavbarInfoElem.on("mousedown", function (e) {
        windowMouseType = "drag";
        startClientX = e.clientX;
        startClientY = e.clientY;
    });
    $body.on("mousemove", function (e) {
        if (windowMouseType == "drag") { 
            $elem.css("top", (top + e.clientY - startClientY) + "px");
            $elem.css("left", (left + e.clientX - startClientX) + "px");
        } else if (windowMouseType == "sizeTop"){
            let distance = e.clientY - startClientY;
            if (distance > 0) { 
                distance = -distance;
            } else {
                distance = Math.abs(distance);
            }
            $elem.css("height", (height + distance) + "px").css("top", (top - distance) + "px");
        } else if (windowMouseType == "sizeBottom"){
            let distance = e.clientY - startClientY;
            $elem.css("height", (height + distance) + "px");
        } else if (windowMouseType == "sizeLeft"){
            let distance = e.clientX - startClientX;
            if (distance > 0) { 
                distance = -distance;
            } else {
                distance = Math.abs(distance);
            }
            $elem.css("width", (width + distance) + "px").css("left", (left - distance) + "px");
        } else if (windowMouseType == "sizeRight"){
            let distance = e.clientX - startClientX;
            $elem.css("width", (width + distance) + "px");
        }
    });
    $body.on("mouseup", function (e) {
        if (windowMouseType == "drag") { 
            top = top + e.clientY - startClientY;
            left = left + e.clientX - startClientX;
            $elem.css("top", top + "px");
            $elem.css("left", left + "px");
        } else if (windowMouseType == "sizeTop"){
            let distance = e.clientY - startClientY;
            if (distance > 0) { 
                distance = -distance;
            } else {
                distance = Math.abs(distance);
            }
            top = top - distance;
            height = height + distance;
            $elem.css("height", height + "px").css("top", top + "px");
        } else if (windowMouseType == "sizeBottom"){
            let distance = e.clientY - startClientY;
            height = height + distance;
            $elem.css("height", height + "px");
        } else if (windowMouseType == "sizeLeft"){
            let distance = e.clientX - startClientX;
            if (distance > 0) { 
                distance = -distance;
            } else {
                distance = Math.abs(distance);
            }
            width = width + distance;
            left = left - distance;
            $elem.css("width", width + "px").css("left", left + "px");
        } else if (windowMouseType == "sizeRight"){
            let distance = e.clientX - startClientX;
            width = width + distance;
            $elem.css("width", width + "px");
        }
        windowMouseType = false;
        startClientX = 0;
        startClientY = 0;
    });
    // 窗口向上变大
    $windowTopElem.on("mousedown", function (e) {
        windowMouseType = "sizeTop";
        startClientY = e.clientY;
    });
    // 窗口向下变大
    $windowBottomElem.on("mousedown", function (e) {
        windowMouseType = "sizeBottom";
        startClientY = e.clientY;
    });
    // 窗口向左变大
    $windowLeftElem.on("mousedown", function (e) {
        windowMouseType = "sizeLeft";
        startClientX = e.clientX;
    });
    // 窗口向右变大
    $windowRightElem.on("mousedown", function (e) {
        windowMouseType = "sizeRight";
        startClientX = e.clientX;
    });
    setTimeout(() => {
        options.open({
            el: "#" + elemId,
            element: $elem,
            ...data
        });
    });
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
    // 添加背景
    DesktopBg(this);
    // 桌面APP
    DesktopApp(this);
    
}
export default create;