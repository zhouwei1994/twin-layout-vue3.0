import { $ } from "../dom.js";
import ClassicWindow from "./window.js";
export default function ClassicLeftBar(options) {
    let leftHtml = `<div class="twin_classic_left_bar"><div class="twin_classic_left_bar_info">`;
    if (options.logo) {
        leftHtml += `<img class="twin_classic_left_bar_logo" src="${options.logo}"/>`;
    }
    leftHtml += `<span class="twin_classic_left_bar_title">${options.title ||
        "双生布局"}</span>`;
    let $leftBarElem = $(leftHtml + `</div></div>`);
    options.$leftMenuBar = $(`<div class="twin_classic_left_bar_menus"></div>`);
    $leftBarElem.append(options.$leftMenuBar);
    options.$loadContainer.append($leftBarElem);
    options.menuBarList = [];
    ClassicAppMenus(options);
}
function ClassicAppMenus(options) {
    if (options.menus) {
        if (typeof options.menus === "function") {
            options.menus(function (data) {
                if (Array.isArray(data) && data.length > 0) { 
                    ClassicMenuBar(options,options.$leftMenuBar, data, 0);
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
    res.forEach((item,index) => {
        let $menuBarElem = $(`<div class="twin_classic_menu ${level == 0 ? 'twin_classic_menu_first' : ''}" style="max-height:50px;"></div>`);
        let $menuBarItemHtml = `<div class="twin_classic_menu_item" style="padding-left:${(level + 1) * 15}px"><div class="twin_classic_menu_item_left">`;
        item.meta = Object.assign({
            icon: "&#xe617;",
            fontFamily: "iconfont",
            iconType: "icon",
            title: "名称未定义"
        }, item.meta);
        // if (level == 0 && options.mode == "left") { 
        if (item.meta.iconType == "image") {
            $menuBarItemHtml += `<i class="twin_classic_menu_item_image" style="background-image: url(${item.meta.icon});"></i>`
        } else if (item.meta.iconType == "icon") {
            $menuBarItemHtml += `<i class="twin_classic_menu_item_icon" style="font-family: ${item.meta.fontFamily};">${item.meta.icon}</i>`
        }
        // }
        $menuBarItemHtml += `<span class="twin_classic_menu_item_title">${item.meta.title}</span></div><div class="twin_classic_menu_item_right">`;
        if (item.meta.label) { 
            $menuBarItemHtml += `<span class="twin_classic_menu_item_label">${item.meta.label }</span>`;
        }
        container.append($menuBarElem);
        if (item.children && Array.isArray(item.children)) {
            $menuBarItemHtml += `<span class="twin_classic_icon_flat_arrow"></span>`;
        }
        $menuBarItemHtml += `</div></div>`;
        let $menuBarItemElem = $($menuBarItemHtml);
        $menuBarElem.append($menuBarItemElem);
        let elemId = level == 0 ? String(index) : fatherId + "_" + index;
        item.level = elemId;
        if (item.children && Array.isArray(item.children)) {
            ClassicMenuBar(options, $menuBarElem, item.children, level + 1, elemId);
            options.menuBarList.push({
                dom: $menuBarElem,
                level: level,
                id: elemId,
                type: "father",
                openState: false,
                childrenHeight: item.children.length * 50 + 50
            });
            $menuBarItemElem.on('click', function () {
                openMenuBar(options, elemId, "father");
            });
        } else {
            options.menuBarList.push({
                dom: $menuBarItemElem,
                level: level,
                id: elemId,
                type: "menu"
            });
            if (defaultOpen) { 
                new ClassicWindow(options, item, true);
                defaultOpen = false;
                openMenuBar(options, elemId);
            }
            $menuBarItemElem.on('click', function () {
                new ClassicWindow(options, item);
                openMenuBar(options, elemId);
            });
        }
    });
}
export function openMenuBar(options, elemId, type = "menu") {
    options.menuBarList.forEach(childItem => {
        if (childItem.type == "father") {
            let verification = new RegExp("^" + childItem.id);
            if (verification.test(elemId)) {
                if (!childItem.openState) { 
                    childItem.dom.css("max-height", "3000px").addClass("twin_classic_menu_active");
                    childItem.openState = true;
                } else if (elemId == childItem.id){
                    childItem.dom.css("max-height", childItem.dom[0].clientHeight + "px");
                    setTimeout(() => {
                        childItem.dom.css("max-height", "50px").removeClass("twin_classic_menu_active");
                    }, 0);
                    childItem.openState = false;
                }
            } else {
                childItem.dom.css("max-height", childItem.dom[0].clientHeight + "px");
                setTimeout(() => {
                    childItem.dom.css("max-height", "50px").removeClass("twin_classic_menu_active");
                }, 0);
                childItem.openState = false;
            }
        } else if (childItem.type == "menu" && type != "father") {
            if (elemId == childItem.id) {
                childItem.dom.addClass("twin_classic_menu_item_active");
            } else {
                childItem.dom.removeClass("twin_classic_menu_item_active");
            }
        }
    });
}