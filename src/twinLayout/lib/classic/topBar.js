import { $ } from "./../dom.js";
export default function ClassicTopBar(options) {
    let $topBar = $(`<div class="twin_classic_top_bar"></div>`);
    ClassicHeader(options, $topBar);
    ClassicNavBar(options, $topBar);
    options.$loadContainer.append($topBar);
}
// 用户信息
export function ClassicGetUserInfo(options) {
    if (options.userInfo) {
        if (typeof options.userInfo === "function") {
            options.userInfo(function (data) {
                ClassicUserInfo(options, data);
            });
        } else if (typeof options.userInfo === "object") {
            ClassicUserInfo(options, options.userInfo);
        } else {
            console.error(
                "【twin-layout】userInfo数据类型不正确，应为function、object"
            );
        }
    } else {
        ClassicUserInfo(options, {
            avatar: "",
            nickname: "游客",
        });
    }
}
function ClassicUserInfo(options, data) {
    let html = `<div class="twin_classic_header_operating">
  <a class="twin_classic_header_user_info twin_classic_header_operating_btn" href="javascript:void(0)">
    <img class="twin_classic_header_avatar" src="${data.avatar}"/>
    <span class="twin_classic_header_nickname">${data.nickname}</span>
  <i class="twin_classic_icon_arrow"></i></a></div>`;
    let $userInfoElem = $(html);
    options.$userInfoElemMenu = $(
        `<div class="twin_classic_header_operating_menu"></div>`
    );
    let $theme = $(`<div class="twin_classic_click_menu_item">
    <i class="twin_classic_icon_theme"></i>
    <span>主题</span>
  </div>`);
    options.$userInfoElemMenu.append($theme);
    if (options.mobile) {
        let userInfoElemShow = false;
        $userInfoElem.children().get(0).on("click", (e) => {
            if (userInfoElemShow) {
                options.$userInfoElemMenu.css("opacity", 0).css("transform", "scale(0)");
                options.userInfoElemShow = false;
            } else {
                options.$userInfoElemMenu.css("opacity", 1).css("transform", "scale(1)");
                options.userInfoElemShow = true;
            }
            e.stopPropagation();
            e.preventDefault();
        });
        let $browserScreen = $(`<div class="twin_classic_click_menu_item">
      <i class="twin_classic_icon_browser_screen"></i>
      <span>全屏</span>
    </div>`);
        let $language = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_classic_icon_language"></i>
        <span>语言选择</span>
    </div>`);
        options.$userInfoElemMenu.append($browserScreen).append($language);
        // 是否全屏
        let fullScreen = false;
        let el = undefined;
        let rfs = undefined;
        let cfs = undefined;
        $browserScreen.on("click", function () {
            if (fullScreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                if (typeof cfs != "undefined" && cfs) {
                    cfs.call(el);
                }
                fullScreen = false;
            } else {
                el = document.documentElement;
                rfs =
                    el.requestFullScreen ||
                    el.webkitRequestFullScreen ||
                    el.mozRequestFullScreen ||
                    el.msRequestFullscreen;
                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                }
                fullScreen = true;
            }
        });
    }

    if (
        options.userMenus &&
        Array.isArray(options.userMenus) &&
        options.userMenus.length > 0
    ) {
        options.userMenus.forEach((item) => {
            let menuItemHtml = `<div class="twin_classic_click_menu_item ${
                item.topLine ? "twin_classic_click_menu_item_line" : ""
                }">`;
            if (item.type == "icon") {
                if (item.fontFamily) {
                    menuItemHtml += `<i style="font-family: '${item.fontFamily}';">${item.icon}</i>`;
                } else {
                    menuItemHtml += `<i>${item.icon}</i>`;
                }
            } else if (item.type == "image") {
                menuItemHtml += `<img class="twin_classic_icon_garden_close" src="${item.icon}" />`;
            }
            menuItemHtml += `<span>${item.name || "未定义"}</span></div>`;
            let $userInfoElemMenuItem = $(menuItemHtml);
            options.$userInfoElemMenu.append($userInfoElemMenuItem);
            $userInfoElemMenuItem.on("click", function () {
                item.onclick && item.onclick();
            });
        });
    }
    $userInfoElem.append(options.$userInfoElemMenu);
    options.$rightInfo.append($userInfoElem);
}
function ClassicHeader(options, $topBar) { 
    let $headerElem = $(`<div class="twin_classic_header"></div>`);
    let leftHtml = `<div class="twin_classic_header_left">`;
    leftHtml += `</div>`;
    let $leftInfo = $(leftHtml);
    let $switchLayout = $(`<div class="twin_classic_header_operating">
      <a class="twin_classic_header_operating_btn" title="切换布局">
        <i class="twin_classic_icon_switch"></i>
      </a>
    </div>`);
    $switchLayout.on("click", function () {
        localStorage.setItem("twinLayout", "desktop");
        window.location.reload();
    });
    $leftInfo.append($switchLayout);
    options.$rightInfo = $(`<div class="twin_classic_header_right"></div>`);
    let $notice = $(`<div class="twin_classic_header_operating">
      <a class="twin_classic_header_operating_btn" title="通知消息">
        <i class="twin_classic_icon_notice"></i>
        <span class="twin_classic_header_operating_dot">+99</span>
      </a>
    </div>`);
    options.$rightInfo
        .append($notice);
    $headerElem.append($leftInfo).append(options.$rightInfo);
    $topBar.append($headerElem);
    if (!options.mobile) {
        let $browserScreen = $(`<div class="twin_classic_header_operating">
      <a class="twin_classic_header_operating_btn" title="全屏">
        <i class="twin_classic_icon_browser_screen"></i>
      </a>
    </div>`);
        let $language = $(`<div class="twin_classic_header_operating">
      <a class="twin_classic_header_operating_btn" title="语言选择">
        <i class="twin_classic_icon_language"></i>
        <i class="twin_classic_icon_arrow"></i>
      </a>
    </div>`);
        options.$rightInfo.append($browserScreen)
            .append($language);
        // 是否全屏
        let fullScreen = false;
        let el = undefined;
        let rfs = undefined;
        let cfs = undefined;
        $browserScreen.on("click", function () {
            if (fullScreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                if (typeof cfs != "undefined" && cfs) {
                    cfs.call(el);
                }
                fullScreen = false;
            } else {
                el = document.documentElement;
                rfs =
                    el.requestFullScreen ||
                    el.webkitRequestFullScreen ||
                    el.mozRequestFullScreen ||
                    el.msRequestFullscreen;
                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                }
                fullScreen = true;
            }
        });
    }
}
function ClassicNavBar(options, $topBar) { 
    let $navBarElem = $(`<div class="twin_classic_nav_bar"></div>`);
    $topBar.append($navBarElem);
    // 导航栏上一页
    let $navBarPreviousPageElem = $(`<div class="twin_classic_nav_bar_previous_page">
        <i class="twin_classic_icon_previous_page"></i>
    </div>`);
    $navBarElem.append($navBarPreviousPageElem);
    // 导航栏容器
    let $navBarContainerView = $(`<div class="twin_classic_nav_bar_container_view"></div>`);
    $navBarElem.append($navBarContainerView);
    // 导航栏容器
    options.$navBarContainer = $(`<div class="twin_classic_nav_bar_container"></div>`);
    $navBarContainerView.append(options.$navBarContainer);
    // 导航栏下一页
    let $navBarNextPageElem = $(`<div class="twin_classic_nav_bar_next_page">
        <i class="twin_classic_icon_next_page"></i>
    </div>`);
    $navBarElem.append($navBarNextPageElem);
    // 更多操作
    let $navBarOperatingElem = $(`<div class="twin_classic_nav_bar_line"></div><div class="twin_classic_nav_bar_operating">
        <div class="twin_classic_nav_bar_operating_info">
            <span class="twin_classic_nav_bar_operating_info_text">关闭其他</span>
            <i class="twin_classic_icon_flat_arrow"></i>
        </div>
    </div>`);
    $navBarElem.append($navBarOperatingElem);
    // 弹窗容器
    let $navBarOperatingContainerElem = $(`<div class="twin_classic_header_operating_menu"></div>`);
    $navBarOperatingElem.append($navBarOperatingContainerElem);
    // 关闭其他
    let $navBarOperatingCloseOtherElem = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_classic_icon_garden_close"></i>
        <span>关闭其他</span>
    </div>`);
    $navBarOperatingContainerElem.append($navBarOperatingCloseOtherElem);
    // 关闭左边
    let $navBarOperatingCloseLeftElem = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_classic_icon_garden_close"></i>
        <span>关闭左边</span>
    </div>`);
    $navBarOperatingContainerElem.append($navBarOperatingCloseLeftElem);
    // 关闭右边
    let $navBarOperatingCloseRightElem = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_classic_icon_garden_close"></i>
        <span>关闭右边</span>
    </div>`);
    $navBarOperatingContainerElem.append($navBarOperatingCloseRightElem);
    // 关闭全部
    let $navBarOperatingCloseAllElem = $(`<div class="twin_classic_click_menu_item">
        <i class="twin_classic_icon_close"></i>
        <span>关闭右边</span>
    </div>`);
    $navBarOperatingContainerElem.append($navBarOperatingCloseAllElem);
    options.navBarOffset = 0;
    // 上一页
    $navBarPreviousPageElem.on("click", () => {
        console.log($navBarContainerView);
        let ViewWidth = $navBarContainerView[0].clientWidth;
        if (options.navBarOffset + ViewWidth/ 2 > 0) { 
            options.navBarOffset = 0;
        } else {
            options.navBarOffset = options.navBarOffset + ViewWidth / 2;
        }
        options.$navBarContainer.css("transform", "translateX(" + options.navBarOffset + "px)");
    });
    // 下一页
    $navBarNextPageElem.on("click", () => {
        let ViewWidth = $navBarContainerView[0].clientWidth;
        let containerWidth = options.$navBarContainer[0].clientWidth;
        console.log(ViewWidth, containerWidth);
        let maxNavBarOffset = containerWidth - ViewWidth;
        if (options.navBarOffset - ViewWidth / 2 < -maxNavBarOffset) {
            options.navBarOffset = -maxNavBarOffset;
        } else {
            options.navBarOffset = options.navBarOffset - ViewWidth / 2;
        }
        options.$navBarContainer.css("transform", "translateX(" + options.navBarOffset + "px)");
    });
}