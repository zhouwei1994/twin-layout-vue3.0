<template>
  <div class="roleManagement-container">
    <el-form :inline="true" :model="queryForm">
      <el-form-item v-if="check('add')">
        <el-button icon="el-icon-plus" type="primary" @click="onAddEdit">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="queryForm.parentId" type="number" placeholder="请输入父Id" clearable />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData">查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border default-expand-all :element-loading-text="elementLoadingText">
      <el-table-column prop="id" label="文章分类ID"></el-table-column>
      <el-table-column prop="parentId" label="父ID"></el-table-column>
      <el-table-column prop="name" label="分类名称"></el-table-column>
      <el-table-column label="图标">
        <template #default="scope">
          <el-image v-if="scope.row.icon" :src="scope.row.icon" fit="cover" :preview-src-list="[scope.row.icon]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间"></el-table-column>
      <el-table-column v-if="check(['modify', 'delete'])" fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button v-if="check('modify')" type="text" @click="onAddEdit(scope.row)">编辑
          </el-button>
          <el-button v-if="check('delete')" type="text" @click="onDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="queryForm.pageNo" :page-size="queryForm.pageSize" :layout="layout" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
    <add-modify ref="addModify" @fetchData="fetchData"></add-modify>
  </div>
</template>

<script>
import addModify from "./addModify";
export default {
  name: "ClassifyList",
  components: {
    addModify,
  },
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
        parentId: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  mounted() { },
  methods: {
    onAddEdit(row) {
      if (row.id) {
        this.$refs["addModify"].show(row);
      } else {
        this.$refs["addModify"].show();
      }
    },
    onDelete(row) {
      this.$baseConfirm("你确定要删除当前项吗", null, () => {
        this.$api.articles
          .deleteArticleClassifys({ id: row.id })
          .then((res) => {
            this.$baseMessage(res.msg, "success");
            this.fetchData();
          });
      });
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
      this.$api.articles.getArticleClassifysList(this.queryForm).then((res) => {
        this.list = res.data.data;
        this.total = res.data.count;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
