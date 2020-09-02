import { $ } from "../dom.js";
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
let menuBarList = [];
function ClassicMenuBar(options, container, res, level = 0, fatherId = "") {
    res.forEach((item,index) => {
        let $menuBarElem = $(`<div class="twin_classic_menu ${level == 0 ? 'twin_classic_menu_first' : ''}" style="height:50px;"></div>`);
        let $menuBarItemHtml = `<div class="twin_classic_menu_item" style="padding-left:${(level + 1) * 15}px"><div class="twin_classic_menu_item_left">`;
        let metaData = Object.assign({
            icon: "&#xe617;",
            fontFamily: "iconfont",
            iconType: "icon",
            title: "名称未定义"
        }, item.meta);
        // if (level == 0 && options.mode == "left") { 
        if (metaData.iconType == "image") {
            $menuBarItemHtml += `<i class="twin_classic_menu_item_image" style="background-image: url(${metaData.icon});"></i>`
        } else if (metaData.iconType == "icon") {
            $menuBarItemHtml += `<i class="twin_classic_menu_item_icon" style="font-family: ${metaData.fontFamily};">${metaData.icon}</i>`
        }
        // }
        $menuBarItemHtml += `<span class="twin_classic_menu_item_title">${metaData.title}</span></div><div class="twin_classic_menu_item_right">`;
        if (metaData.label) { 
            $menuBarItemHtml += `<span class="twin_classic_menu_item_label">${metaData.label }</span>`;
        }
        container.append($menuBarElem);
        if (item.children && Array.isArray(item.children)) {
            $menuBarItemHtml += `<span class="twin_classic_icon_flat_arrow"></span>`;
        }
        $menuBarItemHtml += `</div></div>`;
        let $menuBarItemElem = $($menuBarItemHtml);
        $menuBarElem.append($menuBarItemElem);
        let elemId = level == 0 ? String(index) : fatherId + "_" + index;
        if (item.children && Array.isArray(item.children)) {
            ClassicMenuBar(options, $menuBarElem, item.children, level + 1, elemId);
            menuBarList.push({
                dom: $menuBarElem,
                level: level,
                id: elemId,
                type: "father",
                openState: false
            });
            let childrenHeight = item.children.length * 50 + 50;
            $menuBarItemElem.on('click', function () {
                menuBarList.forEach(item => {
                    if (item.type == "father") { 
                        let verification = new RegExp("^" + item.id);
                        if (elemId == item.id && !item.openState) {
                            item.dom.css("height", childrenHeight + "px").addClass("twin_classic_menu_active");
                            setTimeout(() => {
                                item.dom.css("height", "inherit");
                            }, 400);
                            item.openState = true;
                        } else if (!verification.test(elemId) || elemId == item.id) {
                            item.dom.css("height", item.dom[0].clientHeight + "px");
                            setTimeout(() => {
                                item.dom.css("height", "50px").removeClass("twin_classic_menu_active");
                            }, 0);
                            item.openState = false;
                        }
                    }
                });
            });
        } else {
            menuBarList.push({
                dom: $menuBarItemElem,
                level: level,
                id: elemId,
                type: "menu"
            });
            $menuBarItemElem.on('click', function () {
                console.log("打开了");
                menuBarList.forEach(item => {
                    if (item.type == "menu") {
                        if (elemId == item.id) { 
                            item.dom.addClass("twin_classic_menu_item_active");
                        } else {
                            item.dom.removeClass("twin_classic_menu_item_active");
                        }
                    }
                });
            });
        }
    });
}