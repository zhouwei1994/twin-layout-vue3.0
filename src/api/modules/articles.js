/**
 * @copyright zhouwei 465081029@qq.com
 * @description 文章相关的API
 */
import request from "@/plugins/request";
// 获取文章分类列表
export async function getArticleClassifysList(data) {
  return request({
    url: "/manage/v1/article_classifys_list",
    method: "POST",
    data: data,
  });
}
// 添加或删除文章分类
export async function addModifyArticleClassifys(data) {
  return request({
    url: "/manage/v1/add_modify_article_classifys",
    method: "POST",
    data: data,
    load: true,
  });
}
// 删除文章分类
export async function deleteArticleClassifys(data) {
  return request({
    url: "/manage/v1/delete_article_classifys",
    method: "GET",
    params: data,
    load: true,
  });
}
// 获取文章分类
export async function getArticleClassifys(data) {
  return request({
    url: "/manage/v1/get_article_classifys",
    method: "GET",
    params: data,
  });
}
// 获取文章列表
export async function getArticlesList(data) {
  return request({
    url: "/manage/v1/articles_list",
    method: "POST",
    data: data,
  });
}
// 添加或删除文章
export async function addModifyArticles(data) {
  return request({
    url: "/manage/v1/add_modify_articles",
    method: "POST",
    data: data,
    load: true,
  });
}
// 文章删除
export async function deleteArticle(data) {
  return request({
    url: "/manage/v1/delete_article",
    method: "GET",
    params: data,
    load: true,
  });
}
// 文章信息
export async function getArticleInfo(data) {
  return request({
    url: "/manage/v1/article_info",
    method: "GET",
    params: data,
    load: true,
  });
}
