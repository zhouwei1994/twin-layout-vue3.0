import { $ } from "./../dom.js";
// 创建顶部导航
export default function DesktopTopBar(options) {
    let $topBar = $(`<div class="twin_desktop_top_bar"></div>`);
    let leftHtml = `<div class="twin_desktop_top_bar_left">`;
    if (!options.mobile) {
        if (options.logo) {
            leftHtml += `<img class="twin_desktop_top_bar_logo" src="${options.logo}"/>`;
        }
        leftHtml += `<span class="twin_desktop_top_bar_title">${options.title ||
            "双生布局"}</span>`;
    }
    leftHtml += `</div>`;
    let $leftInfo = $(leftHtml);
    let $switchLayout = $(`<div class="twin_desktop_top_bar_operating">
      <a class="twin_desktop_top_bar_operating_btn" title="切换布局">
        <i class="twin_desktop_icon_switch"></i>
      </a>
    </div>`);
    $switchLayout.on("click", function () {
        localStorage.setItem("twinLayout", "classic");
        window.location.reload();
    });
    $leftInfo.append($switchLayout);
    options.$rightInfo = $(`<div class="twin_desktop_top_bar_right"></div>`);
    let $notice = $(`<div class="twin_desktop_top_bar_operating">
      <a class="twin_desktop_top_bar_operating_btn" title="通知消息">
        <i class="twin_desktop_icon_notice"></i>
        <span class="twin_desktop_top_bar_operating_dot">+99</span>
      </a>
    </div>`);
    options.$rightInfo
        .append($notice);
    $topBar.append($leftInfo).append(options.$rightInfo);
    options.$loadContainer.append($topBar);
    if (!options.mobile) {
        let $browserScreen = $(`<div class="twin_desktop_top_bar_operating">
      <a class="twin_desktop_top_bar_operating_btn" title="全屏">
        <i class="twin_desktop_icon_browser_screen"></i>
      </a>
    </div>`);
        let $language = $(`<div class="twin_desktop_top_bar_operating">
      <a class="twin_desktop_top_bar_operating_btn" title="语言选择">
        <i class="twin_desktop_icon_language"></i>
        <i class="twin_desktop_icon_arrow"></i>
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
// 用户信息
export function DesktopGetUserInfo(options) {
    if (options.userInfo) {
        if (typeof options.userInfo === "function") {
            options.userInfo(function (data) {
                DesktopUserInfo(options, data);
            });
        } else if (typeof options.userInfo === "object") {
            DesktopUserInfo(options, options.userInfo);
        } else {
            console.error(
                "【twin-layout】userInfo数据类型不正确，应为function、object"
            );
        }
    } else {
        DesktopUserInfo(options, {
            avatar: "",
            nickname: "游客",
        });
    }
}
function DesktopUserInfo(options, data) {
    let html = `<div class="twin_desktop_top_bar_operating">
  <a class="twin_desktop_top_bar_user_info twin_desktop_top_bar_operating_btn" href="javascript:void(0)">
    <img class="twin_desktop_top_bar_avatar" src="${data.avatar}"/>
    <span class="twin_desktop_top_bar_nickname">${data.nickname}</span>
  <i class="twin_desktop_icon_arrow"></i></a></div>`;
    let $userInfoElem = $(html);
    options.$userInfoElemMenu = $(
        `<div class="twin_desktop_top_bar_operating_menu"></div>`
    );
    let $theme = $(`<div class="twin_desktop_click_menu_item">
    <i class="twin_desktop_icon_theme"></i>
    <span>主题</span>
  </div>`);
    options.$userInfoElemMenu.append($theme);
    if (options.mobile) {
        $userInfoElem.on("click", (e) => {
            if (options.userInfoElemShow) {
                options.$userInfoElemMenu.css("opacity", 0).css("transform", "scale(0)");
                options.userInfoElemShow = false;
            } else {
                options.$userInfoElemMenu.css("opacity", 1).css("transform", "scale(1)");
                options.userInfoElemShow = true;
            }
            e.stopPropagation();
            e.preventDefault();
        });
        let $browserScreen = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_desktop_icon_browser_screen"></i>
      <span>全屏</span>
    </div>`);
        let $language = $(`<div class="twin_desktop_click_menu_item">
        <i class="twin_desktop_icon_language"></i>
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
            let menuItemHtml = `<div class="twin_desktop_click_menu_item ${
                item.topLine ? "twin_desktop_click_menu_item_line" : ""
                }">`;
            if (item.type == "icon") {
                if (item.fontFamily) {
                    menuItemHtml += `<i style="font-family: '${item.fontFamily}';">${item.icon}</i>`;
                } else {
                    menuItemHtml += `<i>${item.icon}</i>`;
                }
            } else if (item.type == "image") {
                menuItemHtml += `<img class="twin_desktop_icon_garden_close" src="${item.icon}" />`;
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