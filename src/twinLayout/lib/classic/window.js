import { $ } from "./../dom.js";
import { openMenuBar } from "./leftBar.js";
// let windowZIndex = 50;
let windowNum = 0;
let classicWindowList = [];
export default function ClassicWindow(options, data, defaultPage) {
    if (windowSwitch(options, data.name,'name')) {
        return;
    }
    this.elemId = "twin_classic_window" + windowNum;
    this.$windowElem = $(`<div class="twin_classic_window_box" id="${this.elemId}"></div>`);
    let $windowTopBarHtml = `<div class="twin_classic_nav_bar_container_item twin_classic_nav_bar_container_item_active ${defaultPage ? 'twin_classic_default_page' : '' }">
            <div class="twin_classic_nav_bar_container_item_content">
                <span>${ data.meta.title}</span>`;
    if (!defaultPage) { 
        $windowTopBarHtml += `<i class="twin_classic_icon_garden_close"></i>`;
    }
    this.$windowTopBarElem = $($windowTopBarHtml + `</div></div>`);
    options.$windowContainer.append(this.$windowElem);
    options.$navBarContainer.append(this.$windowTopBarElem);
    let classicWindowItem = {
        $windowElem: this.$windowElem,
        $windowTopBarElem: this.$windowTopBarElem,
        elemId: this.elemId,
        onRemove: this.removeWindow.bind(this),
        onShow: this.showWindow.bind(this),
        onHide: this.hideWindow.bind(this),
        show: true,
        ...data,
    }
    classicWindowList.push(classicWindowItem);
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
    this.$windowTopBarElem.on("click", () => {
        windowSwitch(options, this.elemId);
        openMenuBar(options, data.level);
    });
}
// 删除窗口
ClassicWindow.prototype.removeWindow = function (options, de = true) {
    options.remove &&
        options.remove({
            el: "#" + this.elemId,
            element: this.$windowElem,
            ...this.data,
        });
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
ClassicWindow.prototype.showWindow = function () {
    this.$windowElem.show();
    this.$windowTopBarElem.addClass("twin_classic_nav_bar_container_item_active");
    this.callback.onShow && this.callback.onShow();
};
// 隐藏窗口
ClassicWindow.prototype.hideWindow = function () {
    this.$windowElem.hide();
    this.$windowTopBarElem.removeClass("twin_classic_nav_bar_container_item_active");
    this.callback.onHide && this.callback.onHide();
};
function windowSwitch(options, data, key = 'elemId') { 
    let prohibit = false;
    classicWindowList.forEach(item => {
        if (item[key] == data) {
            item.onShow();
            item.show = true;
            prohibit = true;
        } else if (item.show) {
            item.onHide();
            item.show = false;
        }
    });
    return prohibit;
}