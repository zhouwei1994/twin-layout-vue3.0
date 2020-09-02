import { $ } from "./../dom.js";
import DesktopWindow from "./window.js";
import { Object } from "core-js";
export default function DesktopAppMenus(options) {
    if (options.menus) {
        if (typeof options.menus === "function") {
            options.menus(function (data) {
                if (Array.isArray(data) && data.length > 0) {
                    DesktopApp(options, data);
                } else {
                    console.error("【twin-layout】menus返回的数据类型不正确，应为array");
                }
            });
        } else if (Array.isArray(options.menus) && options.menus.length > 0) {
            DesktopApp(options, options.menus);
        } else {
            console.error("【twin-layout】menus数据类型不正确，应为function、array");
        }
    } else {
        alert("【twin-layout】请添加菜单 menus");
    }
}
function randomColor(transparent = 1) {
    return `rgba(${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)}, ${transparent})`
}
// 桌面图标
function DesktopApp(options, res) {
    let appWidth = 100;
    let appInterval = 20;
    let column = 0;
    let row = 0;
    let currentIndex = 0;
    let maxHeight = options.clientHeight - 80;
    if (options.mobile) {
        maxHeight = options.clientHeight - 40;
        appWidth = options.clientWidth / 4;
        let maxRow = parseInt(maxHeight / appWidth);
        appInterval = (maxHeight - maxRow * appWidth) / maxRow;
    }
    
    let $appContainer = $(`<div class="twin_desktop_app_container"></div>`);
    let $appContainerView = $(`<div class="twin_desktop_app_container_view"></div>`);
    let $appContainerUl = $(`<div class="twin_desktop_app_container_ul"></div>`);
    if (res && Array.isArray(res) && res.length > 0) {
        let appList = DesktopAppData(res);
        appList.forEach((item) => {
            let top = 0;
            let left = 0;
            if (options.mobile) {
                top = row * appWidth + appInterval * row;
                left = currentIndex * appWidth;
            } else {
                top = appInterval * currentIndex + appWidth * currentIndex;
                left = appWidth * column;
            }
            item.meta = Object.assign({
                icon: "&#xe617;",
                fontFamily: "iconfont",
                iconType: "icon",
                title: "名称未定义",
                color: randomColor()
            }, item.meta);
            let $elemHtml = `<div class="twin_desktop_app_item" style="top:${top}px;left:${left}px;width:${appWidth}px;height:${appWidth}px;">`;
            if (item.meta.iconType == "image") {
                $elemHtml += `<i class="twin_desktop_app_item_image" style="background-image: url(${ item.meta.icon });"></i>`
            } else if (item.meta.iconType == "icon") { 
                $elemHtml += `<i class="twin_desktop_app_item_icon" style="font-family: ${item.meta.fontFamily};color:${item.meta.color};">${item.meta.icon}</i>`
            }
            let $elem = $($elemHtml + `<span class="twin_desktop_app_item_text">${item.meta.title}</span></div>`);
            currentIndex += 1;
            if (options.mobile) {
                $appContainerUl.append($elem);
                if (left + appWidth * 2 > options.clientWidth) {
                    currentIndex = 0;
                    row += 1;
                    if (top + (appWidth + appInterval) * 2 > maxHeight) {
                        column += 1;
                        row = 0;
                        $appContainerView.append($appContainerUl);
                        $appContainerUl = $(`<div class="twin_desktop_app_container_ul"></div>`);
                    }
                }
            } else {
                if (top + (appWidth + appInterval) * 2 > maxHeight) {
                    column += 1;
                    currentIndex = 0;
                }
                $appContainerUl.append($elem);
            }
            $elem.on("click", function () {
                new DesktopWindow(options, item);
            });
        });
        $appContainerView.append($appContainerUl);
        $appContainer.append($appContainerView);
        options.$loadContainer.append($appContainer);
        if (options.mobile) {
            let startX = 0;
            let translateX = 0;
            let maxWidth = column * options.clientWidth;
            //手指接触屏幕
            $appContainerView.on("touchstart", e => {
                startX = e.touches[0].pageX;
            });
            //手指滑动屏幕
            $appContainerView.on("touchmove", e => {
                let interval = e.touches[0].pageX - startX;
                let result = translateX + interval;
                if (translateX + interval > 0) {
                    result = 0;
                } else if (translateX + interval < -maxWidth) {
                    result = -maxWidth;
                }
                $appContainerView.css("transform", "translateX(" + result + "px)").css("transition", "all 0s");
            });
            //手指离开屏幕
            $appContainerView.on("touchend", e => {
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
                $appContainerView.css("transform", "translateX(" + translateX + "px)").css("transition", "all 0.4s");
            });
        }
    } else {
        alert("【twin-layout】至少要有一个菜单");
    }
}
function DesktopAppData(res) {
    let appList = [];
    res.forEach(function (item) {
        if (item.children && Array.isArray(item.children)) {
            appList = appList.concat(DesktopAppData(item.children));
        } else {
            appList.push(item);
        }
    });
    return appList;
}