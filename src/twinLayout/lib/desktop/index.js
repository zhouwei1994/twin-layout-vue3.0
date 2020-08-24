import { $ } from "./../dom.js"
import DesktopWindow from "./window.js"
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
        let img = new Image();
        img.onload = function () { 
            $elem.css("background-image", 'url(\'' + options.background[index] + '\');"></div>');
        };
        img.src = options.background[index];
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
                    new DesktopWindow(options, item);
                });
            });
        } else {
            alert("至少要有一个菜单");
        }
    });
}
// let windowZIndex = 1;
// let windowNum = 0;
// let allowMouse = true;
// let desktopWindowList = [];
// // 窗口
// function DesktopWindow(options, data) {
//     if (!data.openMore) {
//         let prohibit = false;
//         desktopWindowList.forEach(item => {
//             if (item.name == data.name) { 
//                 item.show();
//                 prohibit = true;
//             }
//         });
//         if (prohibit) { 
//             return;
//         }
//     }

//     let elemId = 'twin_desktop_window' + windowNum;
//     let startTop = options.clientHeight * 0.10;
//     let startLeft = options.clientWidth * 0.15;
//     let top = 40 * windowNum;
//     let left = 40 * windowNum;
//     let width = options.clientWidth * 0.7;
//     let height = options.clientHeight * 0.7;
//     let zIndex = windowZIndex;
//     if (options.clientHeight * 0.2 < top) { 
//         top = startTop + Math.ceil(Math.random() * (startTop));
//     } else {
//         top += startTop;
//     }
//     if (startLeft < left) { 
//         left = startLeft + Math.ceil(Math.random() * (startLeft));
//     } else {
//         left += startLeft;
//     }
//     // 窗口
//     let $elem = $(`<div class="twin_desktop_window twin_desktop_window_active" style="top: ${top}px;left: ${left}px;height: ${height}px;width: ${width}px;z-index:${zIndex};"></div>`);
//     // 窗口导航栏
//     let $windowNavbarElem = $(`<div class="twin_desktop_window_navbar"></div>`);
//     // 窗口导航栏信息
//     let $windowNavbarInfoElem = $(`<div class="win_desktop_window_navbar_info">
//         <i class="twin_desktop_window_navbar_icon" style="background-image: url(${ data.icon });"></i>
//         <span class="twin_desktop_window_navbar_text">${ data.title }</span>
//     </div>`);
//     // 窗口容器
//     let $windowContainerElem = $(`<div class="twin_desktop_window_container" id="${elemId}"></div>`);
//     // 窗口操作容器
//     let $windowOperatingElem = $(`<div class="win_desktop_window_navbar_operating"></div>`);
//     // 窗口最小化
//     let $windowMinElem = $(`<i class="twin_desktop_window_operating_min"></i>`);
//     // 窗口全屏、窗口切换
//     let $windowfullScreenElem = $(`<i class="twin_desktop_window_operating_full_screen"></i>`);
//     // 窗口刷新
//     let $windowRefreshElem = $(`<i class="twin_desktop_window_operating_refresh"></i>`);
//     // 窗口关闭
//     let $windowCloseElem = $(`<i class="twin_desktop_window_operating_close"></i>`);
//     // 窗口变大-上
//     let $windowTopElem = $(`<div class="twin_desktop_window_top"></div>`);
//     let $windowLeftElem = $(`<div class="twin_desktop_window_left"></div>`);
//     let $windowRightElem = $(`<div class="twin_desktop_window_right"></div>`);
//     let $windowBottomElem = $(`<div class="twin_desktop_window_bottom"></div>`);
//     // 底部导航创建
//     let $bottomBarElem = $(`<div class="twin_desktop_bottom_bar_item twin_desktop_bottom_bar_active" data-id="${ elemId }">
//         <i class="twin_desktop_bottom_bar_icon" style="background-image: url(${ data.icon });"></i>
//         <span class="twin_desktop_bottom_bar_text">${ data.title }</span>
//     </div>`);

//     let $body = $(document.body);
//     $windowOperatingElem.append($windowRefreshElem).append($windowMinElem).append($windowfullScreenElem).append($windowCloseElem);
//     $windowNavbarElem.append($windowNavbarInfoElem).append($windowOperatingElem);
//     $elem.append($windowNavbarElem).append($windowContainerElem).append($windowTopElem)
//         .append($windowLeftElem).append($windowRightElem).append($windowBottomElem);
//     options.$bottomBarContainer.append($bottomBarElem);
//     options.$loadContainer.append($elem);
//     desktopWindowList.forEach((item) => {
//         item.windowView.removeClass("twin_desktop_window_active");
//         item.bottomBarView.removeClass("twin_desktop_bottom_bar_active");
//     });
//     // 删除当前窗口
//     function removeWindow(de = true) { 
//         options.remove && options.remove({
//             el: "#" + elemId,
//             element: $elem,
//             ...data
//         });
//         // 解除绑定的事件
//         $windowMinElem.off("click", function () { });
//         $windowfullScreenElem.off("click", function () { });
//         $windowCloseElem.off("click", function () { });
//         $windowRefreshElem.off("click", function () { });
//         $windowNavbarInfoElem.off("mousedown", function () { });
//         $windowTopElem.off("mousedown", function () { });
//         $windowBottomElem.off("mousedown", function () { });
//         $windowLeftElem.off("mousedown", function () { });
//         $windowRightElem.off("mousedown", function () { });
//         $body.off("mousemove", function () { });
//         $body.off("mouseup", function () { });
//         $bottomBarElem.off("click", function () { });
//         $bottomBarElem.off("contextmenu", function () { });
//         // 删除当前窗口
//         $elem.remove();
//         // 底部菜单
//         $bottomBarElem.remove();
//         if (de) { 
//             desktopWindowList.forEach((item, index) => {
//                 if (elemId == item.el) {
//                     desktopWindowList.splice(index, 1);
//                 }
//             });
//             if (desktopWindowList.length >= 1) {
//                 desktopWindowList[desktopWindowList.length - 1].show();
//             }
//         }
//     }
//     function showWindow() { 
//         if (zIndex !== windowZIndex) {
//             $elem.css("z-index", windowZIndex);
//             windowZIndex++;
//         }
//         $elem.show();
//         desktopWindowList.forEach((item) => {
//             item.windowView.removeClass("twin_desktop_window_active");
//             item.bottomBarView.removeClass("twin_desktop_bottom_bar_active");
//         });
//         setTimeout(function () { 
//             $elem.addClass("twin_desktop_window_active");
//             $bottomBarElem.addClass("twin_desktop_bottom_bar_active");
//         });
//     }
//     desktopWindowList.push({
//         windowView: $elem,
//         bottomBarView: $bottomBarElem,
//         el: elemId,
//         ...data,
//         remove: removeWindow,
//         show: showWindow,
//     });
//     windowNum++;
//     windowZIndex++;
//     // 底部菜单点击
//     $bottomBarElem.on("click", showWindow);
//     // 底部菜单右键点击
//     $bottomBarElem.on("contextmenu", function (e) {
//         DesktopClickMenu(options, {
//             clientX: e.clientX,
//             clientY: e.clientY,
//             dataList: [
//                 {
//                     elem: `<div class="twin_desktop_click_menu_item">
//                         <i class="twin_desktop_click_menu_all_close"></i>
//                         <span>关闭全部</span>   
//                     </div>`,
//                     click: function () {
//                         desktopWindowList.forEach(item => {
//                             item.remove(false);
//                         });
//                         desktopWindowList = [];
//                     }
//                 },
//                 {
//                     elem: `<div class="twin_desktop_click_menu_item">
//                         <i class="twin_desktop_click_menu_all_close"></i>
//                         <span>关闭其他</span>
//                     </div>`,
//                     click: function () {
//                         desktopWindowList = desktopWindowList.filter(item => {
//                             if (item.el == elemId) { 
//                                 return true;
//                             } else {
//                                 item.remove(false);
//                                 return false;
//                             }
//                         });
//                         if (desktopWindowList.length >= 1) {
//                             desktopWindowList[desktopWindowList.length - 1].show();
//                         }
//                     }
//                 },
//                 {
//                     elem: `<div class="twin_desktop_click_menu_item">
//                         <i class="twin_desktop_click_menu_close"></i>
//                         <span>关闭当前</span>
//                     </div>`,
//                     click: function () {
//                         removeWindow();
//                     }
//                 }
//             ]
//         });
//         e.returnValue = false;
//     });
//     // 窗口关闭
//     $windowCloseElem.on("click", function (e) {
//         removeWindow();
//         e.stopPropagation();
//     });
//     // 窗口最小化
//     $windowMinElem.on("click", function (e) {
//         $bottomBarElem.removeClass("twin_desktop_bottom_bar_active");
//         $elem.removeClass("twin_desktop_window_active");
//         $elem.hide();
//         e.stopPropagation();
//     });
//     // 窗口调整
//     $windowfullScreenElem.on("click", function (e) {
//         if ($elem.hasClass("twin_desktop_window_full_screen")) {
//             allowMouse = true;
//             $elem.removeClass("twin_desktop_window_full_screen");
//         } else {
//             allowMouse = false;
//             $elem.addClass("twin_desktop_window_full_screen");
//         }
//         e.stopPropagation(e);
//     });
//     // 窗口刷新
//     $windowRefreshElem.on("click", function (e) {
//         options.remove && options.remove({
//             el: "#" + elemId,
//             element: $elem,
//             ...data
//         });
//         setTimeout(() => {
//             options.open({
//                 el: "#" + elemId,
//                 element: $elem,
//                 ...data
//             });
//         });
//         e.stopPropagation();
//     });
//     // 窗口点击
//     $elem.on("click", function () {
//         if (zIndex !== windowZIndex) { 
//             $elem.css("z-index", windowZIndex);
//             windowZIndex++;
//         }
//         desktopWindowList.forEach((item) => {
//             item.windowView.removeClass("twin_desktop_window_active");
//             item.bottomBarView.removeClass("twin_desktop_bottom_bar_active");
//         });
//         $elem.addClass("twin_desktop_window_active");
//         $bottomBarElem.addClass("twin_desktop_bottom_bar_active");
//     });
//     // 窗口拖动
//     let windowMouseType = false;
//     let startClientX = 0;
//     let startClientY = 0;
    
//     $body.on("mousemove", function (e) {
//         if (!allowMouse) { 
//             return false;
//         }
//         if (windowMouseType == "drag") { 
//             $elem.css("top", (top + e.clientY - startClientY) + "px");
//             $elem.css("left", (left + e.clientX - startClientX) + "px");
//         } else if (windowMouseType == "sizeTop"){
//             let distance = e.clientY - startClientY;
//             if (distance > 0) { 
//                 distance = -distance;
//             } else {
//                 distance = Math.abs(distance);
//             }
//             $elem.css("height", (height + distance) + "px").css("top", (top - distance) + "px");
//         } else if (windowMouseType == "sizeBottom"){
//             let distance = e.clientY - startClientY;
//             $elem.css("height", (height + distance) + "px");
//         } else if (windowMouseType == "sizeLeft"){
//             let distance = e.clientX - startClientX;
//             if (distance > 0) { 
//                 distance = -distance;
//             } else {
//                 distance = Math.abs(distance);
//             }
//             $elem.css("width", (width + distance) + "px").css("left", (left - distance) + "px");
//         } else if (windowMouseType == "sizeRight"){
//             let distance = e.clientX - startClientX;
//             $elem.css("width", (width + distance) + "px");
//         }
//     });
//     $body.on("mouseup", function (e) {
//         if (!allowMouse) {
//             return false;
//         }
//         if (windowMouseType == "drag") { 
//             top = top + e.clientY - startClientY;
//             left = left + e.clientX - startClientX;
//             $elem.css("top", top + "px");
//             $elem.css("left", left + "px");
//         } else if (windowMouseType == "sizeTop"){
//             let distance = e.clientY - startClientY;
//             if (distance > 0) { 
//                 distance = -distance;
//             } else {
//                 distance = Math.abs(distance);
//             }
//             top = top - distance;
//             height = height + distance;
//             $elem.css("height", height + "px").css("top", top + "px");
//         } else if (windowMouseType == "sizeBottom"){
//             let distance = e.clientY - startClientY;
//             height = height + distance;
//             $elem.css("height", height + "px");
//         } else if (windowMouseType == "sizeLeft"){
//             let distance = e.clientX - startClientX;
//             if (distance > 0) { 
//                 distance = -distance;
//             } else {
//                 distance = Math.abs(distance);
//             }
//             width = width + distance;
//             left = left - distance;
//             $elem.css("width", width + "px").css("left", left + "px");
//         } else if (windowMouseType == "sizeRight"){
//             let distance = e.clientX - startClientX;
//             width = width + distance;
//             $elem.css("width", width + "px");
//         }
//         windowMouseType = false;
//         startClientX = 0;
//         startClientY = 0;
//     });
//     $windowNavbarInfoElem.on("mousedown", function (e) {
//         if (!allowMouse) {
//             return false;
//         }
//         windowMouseType = "drag";
//         startClientX = e.clientX;
//         startClientY = e.clientY;
//     });
//     // 窗口向上变大
//     $windowTopElem.on("mousedown", function (e) {
//         if (!allowMouse) {
//             return false;
//         }
//         windowMouseType = "sizeTop";
//         startClientY = e.clientY;
//     });
//     // 窗口向下变大
//     $windowBottomElem.on("mousedown", function (e) {
//         if (!allowMouse) {
//             return false;
//         }
//         windowMouseType = "sizeBottom";
//         startClientY = e.clientY;
//     });
//     // 窗口向左变大
//     $windowLeftElem.on("mousedown", function (e) {
//         if (!allowMouse) {
//             return false;
//         }
//         windowMouseType = "sizeLeft";
//         startClientX = e.clientX;
//     });
//     // 窗口向右变大
//     $windowRightElem.on("mousedown", function (e) {
//         if (!allowMouse) {
//             return false;
//         }
//         windowMouseType = "sizeRight";
//         startClientX = e.clientX;
//     });
//     setTimeout(() => {
//         options.open({
//             el: "#" + elemId,
//             element: $elem,
//             ...data
//         });
//     });
// }
// // 创建点击菜单
// function DesktopClickMenu(options, data) { 
//     options.$clickMenu[0].innerHTML = "";
//     data.dataList.forEach(item => {
//         let $element = $(item.elem);
//         $element.on("click", function () { 
//             item.click();
//             $element.off("click", function(){});
//             options.$clickMenu.hide();
//         });
//         options.$clickMenu.append($element);
//     });
//     let top = data.clientY;
//     let left = data.clientX;
//     let height = data.dataList.length * 40;
//     if (options.clientHeight - 43 < top + height) { 
//         top = options.clientHeight - 43 - height;
//     }
//     if (options.clientWidth < left + 190) {
//         top = options.clientHeight - 190;
//     }
//     options.$clickMenu.css("top", top + "px").css("left", left + "px").show();
// }
// 创建底部菜单
function DesktopBottomBar(options) {
    let $bottomBar = $(`<div class="twin_desktop_bottom_bar"></div>`);
    let $otherOperation = $(`<div class="twin_desktop_bottom_bar_operation"></div>`);
    options.$bottomBarContainer = $(`<div class="twin_desktop_bottom_bar_container"></div>`);
    options.$clickMenu = $(`<div class="twin_desktop_click_menu" style="display:none;"></div>`);
    $bottomBar.append($otherOperation).append(options.$bottomBarContainer).append($otherOperation);
    options.$loadContainer.append($bottomBar).append(options.$clickMenu);
    // 关闭点击菜单
    document.body.onclick = function () { 
        options.$clickMenu.hide();
    }
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
    // 添加底部菜单
    DesktopBottomBar(this);
    // 桌面APP
    DesktopApp(this);
    
}
export default create;