import { $ } from "./../dom.js";
let defaultBackground = "http://api.iehu.cn/Image.php?type=2";
// 桌面背景
export default function DesktopBg(options) {
  if (options.background) {
    if (typeof options.background === "function") {
      options.background(function(data) {
        DesktopBgContainer(options, data);
      });
    } else if (
      Array.isArray(options.background) &&
      options.background.length > 0
    ) {
      DesktopBgContainer(options, options.background);
    } else if (typeof options.background === "string") {
      DesktopBgContainer(options, [options.background]);
    } else {
      console.error(
        "【twin-layout】background数据类型不正确，应为function、array、string"
      );
    }
  } else {
    DesktopBgContainer(options, undefined);
  }
}
function DesktopBgContainer(options, background) {
  let backgroundUrl = defaultBackground;
  let backgroundLength = 2;
  let index = 0;
  if (background) {
    backgroundLength = background.length;
    index = Math.floor(Math.random() * backgroundLength);
    backgroundUrl = background[index];
  }

  let $bgElem = $(
    `<div class="twin_desktop_bg" style="background-image: url(${backgroundUrl});"></div>`
  );
  // let $bgImageElem = $(
  //   `<img class="twin_desktop_bg_image" src="${backgroundUrl}"/>`
  // );
  // $bgElem.append($bgImageElem);
  options.$loadContainer.append($bgElem);
  if (!options.mobile && backgroundLength > 1) {
    let $switchBgElem = $('<div class="twin_desktop_bg_switch" />');
    $bgElem.append($switchBgElem);
    $switchBgElem.on("click", function() {
      if (background) {
        index = Math.floor(Math.random() * backgroundLength);
        backgroundUrl = background[index];
      } else {
        backgroundUrl = defaultBackground + "?t=" + new Date().getTime();
      }
      let img = new Image();
      img.onload = function() {
        // $bgImageElem.attr("src", backgroundUrl);
        $bgElem.css(
          "background-image",
          "url('" + backgroundUrl + "');\"></div>"
        );
      };
      img.src = backgroundUrl;
    });
  }
}
