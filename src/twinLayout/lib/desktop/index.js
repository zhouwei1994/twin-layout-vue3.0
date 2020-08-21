import { $ } from "./../dom.js"
import "./index.scss"
let config = {};
// 桌面背景
function DesktopBg(options) {
    let backgroundLength = options.config.background.length;
    let index = Math.floor(Math.random() * backgroundLength);
    let $elem = $('<div class="twin_desktop_bg" style="background-image: url(' + options.config.background[index] + ');"></div>');
    let $switchBgElem = $('<div class="twin_desktop_bg_switch" />');
    options.$loadContainer.append($elem);
    $elem.append($switchBgElem);
    $switchBgElem.on("click", function () {
        let index = Math.floor(Math.random() * backgroundLength);
        $elem.css("background-image", 'url(\'' + options.config.background[index] + '\');"></div>');
    });
}
// 窗口
function DesktopWindow(options) {
    let $elem = $('<div class="twin_desktop_window"></div>');
    options.$loadContainer.append($elem);
    let home = require("@/pages/home");
    console.log(home.default.render());
}
// 原型
DesktopBg.prototype = {
    constructor: DesktopBg,
}
function TwinDesktop(loadContainer, options) { 
    if (loadContainer == null) {
        // 没有传入任何参数，报错
        throw new Error("错误：初始化编辑器时候未传入任何参数，请查阅文档");
    }
    this.loadContainer = loadContainer;
    this.config = Object.assign({}, config, options);
}
// 修改原型
TwinDesktop.prototype = {
    constructor: TwinDesktop,
    // 初始化 DOM
    _initDom: function _initDom() { 
        // var _this = this;
        this.$loadContainer = $(this.loadContainer);
        // 添加背景
        DesktopBg(this);
        // 桌面窗口
        DesktopWindow(this);
    },
    // 创建编辑器
    create: function create() {
        // 初始化 DOM
        this._initDom();
    },
    // 解绑所有事件（暂时不对外开放）
    _offAllEvent: function _offAllEvent() {
        $.offAll();
    },
}
export default TwinDesktop;