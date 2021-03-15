<template>
  <div class="roleManagement-container">
    <el-form :inline="true" :model="queryForm">
      <el-form-item v-if="check('add')">
        <el-button icon="el-icon-plus" type="primary" @click="onAddEdit">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="queryForm.userId" type="number" placeholder="请输入发布人ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="queryForm.id" placeholder="请输入文章ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="queryForm.classifyId" placeholder="请输入分类ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border default-expand-all :element-loading-text="elementLoadingText">
      <el-table-column prop="id" label="文章ID"></el-table-column>
      <el-table-column prop="userId" label="发布人ID"></el-table-column>
      <el-table-column prop="classifyId" label="分类ID"></el-table-column>
      <el-table-column prop="pageviews" label="浏览量"></el-table-column>
      <el-table-column prop="likes" label="点赞数"></el-table-column>
      <el-table-column prop="title" label="文章标题"></el-table-column>
      <el-table-column v-if="check(['modify', 'delete'])" fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button v-if="check('modify')" type="text" @click="onAddEdit(scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="queryForm.pageNo" :page-size="queryForm.pageSize" :layout="layout" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "ArticleList",
  data() {
    return {
      list: [],
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      selectRows: "",
      elementLoadingText: "正在加载...",
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        id: "",
        classifyId: "",
        userId: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    onAddEdit(row) {
      if (row.id) {
        this.twin.$router.push({
          name: "ArticleAddModify",
          title: "修改文章",
          reload: true,
          query: {
            id: row.id
          }
        });
      } else {
        this.twin.$router.push({
          name: "ArticleAddModify",
          title: "添加文章",
        });
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val;
      this.fetchData();
    },
    queryData() {
      this.queryForm.pageNo = 1;
      this.fetchData();
    },
    fetchData() {
      this.$api.articles.getArticlesList(this.queryForm).then((res) => {
        this.list = res.data.data;
        this.total = res.data.count;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
