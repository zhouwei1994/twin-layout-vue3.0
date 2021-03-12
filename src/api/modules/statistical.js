/**
 * @copyright zhouwei 465081029@qq.com
 * @description 统计相关的API
 */
import request from "@/plugins/request";
// 获取用户新增记录和活跃记录
export async function getUserNewActiveLogs() {
  return request({
    url: "/manage/v1/user_new_active_logs",
    method: "get",
  });
}
