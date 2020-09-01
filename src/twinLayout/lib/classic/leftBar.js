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
    ClassicMenuBar(options);
}
function ClassicMenuBar(options) { 
    let $menuBarElem = $(`<div class="twin_classic_menu"></div>`);
    let $menuBarItemHtml = `</div class="twin_classic_menu_item">`;
    $menuBarItemHtml += `<i class="twin_classic_menu_item_icon">&#xe60a;</i>`;
    $menuBarItemHtml += `<span class="twin_classic_menu_item_text">用户</span>`;
    $menuBarItemHtml += `<span class="twin_classic_menu_item_label">热门</span>`;
    $menuBarItemHtml += `<span class="twin_classic_menu_item_arrow"></span>`;
    $menuBarItemHtml += `</div>`;
    let $menuBarItemElem = $($menuBarItemHtml);
    $menuBarElem.append($menuBarItemElem);
    options.$leftMenuBar.append($menuBarElem);
}