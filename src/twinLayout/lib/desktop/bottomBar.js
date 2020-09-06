import { $ } from "./../dom.js";
import { allMin, allShow } from "./window.js";
// 创建底部菜单
export default function DesktopBottomBar(options) {
  let $bottomBar = $(`<div class="twin_desktop_bottom_bar"></div>`);
  let $leftOperation = $(
    `<div class="twin_desktop_bottom_bar_operation"></div>`
  );
  let $bottomBarDesktopLeft = $(`<div class="twin_desktop_bottom_bar_desktop">
    <i class="twin_layout_icon_desktop"></i>
    <span>桌面</span>
  </div>`);
  let $bottomBarDesktopMenuLeft = $(
    `<div class="twin_desktop_bottom_bar_operation_menu twin_desktop_bottom_bar_operation_menu_left"></div>`
  );
  let $bottomBarDesktopMenuMinLeft = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_layout_icon_min"></i>
      <span>全部最小化</span>   
  </div>`);
  let $bottomBarDesktopMenuShowLeft = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_layout_icon_unfold"></i>
      <span>全部展开</span>
  </div>`);
  $bottomBarDesktopMenuLeft
    .append($bottomBarDesktopMenuMinLeft)
    .append($bottomBarDesktopMenuShowLeft);
  $leftOperation
    .append($bottomBarDesktopLeft)
    .append($bottomBarDesktopMenuLeft);
  let $rightOperation = $(
    `<div class="twin_desktop_bottom_bar_operation"></div>`
  );
  let $bottomBarDesktopRight = $(`<div class="twin_desktop_bottom_bar_desktop">
    <i class="twin_layout_icon_desktop"></i>
    <span>桌面</span>
  </div>`);
  let $bottomBarDesktopMenuRight = $(
    `<div class="twin_desktop_bottom_bar_operation_menu twin_desktop_bottom_bar_operation_menu_right"></div>`
  );
  let $bottomBarDesktopMenuMinRight = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_layout_icon_min"></i>
      <span>全部最小化</span>   
  </div>`);
  let $bottomBarDesktopMenuShowRight = $(`<div class="twin_desktop_click_menu_item">
      <i class="twin_layout_icon_unfold"></i>
      <span>全部展开</span>
  </div>`);
  $bottomBarDesktopMenuRight
    .append($bottomBarDesktopMenuMinRight)
    .append($bottomBarDesktopMenuShowRight);
  $rightOperation
    .append($bottomBarDesktopRight)
    .append($bottomBarDesktopMenuRight);
  options.$bottomBarContainer = $(
    `<div class="twin_desktop_bottom_bar_container"></div>`
  );
  options.$clickMenu = $(
    `<div class="twin_desktop_click_menu" style="display:none;"></div>`
  );
  options.$positionFrame = $(`<div class="twin_desktop_position_frame"></div>`);
  $bottomBar
    .append($leftOperation)
    .append(options.$bottomBarContainer)
    .append($rightOperation);
  options.$loadContainer
    .append($bottomBar)
    .append(options.$clickMenu)
    .append(options.$positionFrame);
  $bottomBarDesktopRight.on("click", () => {
    allMin(options);
  });
  $bottomBarDesktopLeft.on("click", () => {
    allMin(options);
  });
  $bottomBarDesktopMenuMinRight.on("click", () => {
    allMin(options);
  });
  $bottomBarDesktopMenuMinLeft.on("click", () => {
    allMin(options);
  });
  $bottomBarDesktopMenuShowRight.on("click", () => {
    allShow(options);
  });
  $bottomBarDesktopMenuShowLeft.on("click", () => {
    allShow(options);
  });
}
