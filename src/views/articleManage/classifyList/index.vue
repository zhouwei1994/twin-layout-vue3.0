<template>
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="用户名">
            <a-input placeholder="请输入用户名" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="手机号">
            <a-input placeholder="请输入手机号" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="邮箱">
            <a-input placeholder="请输入邮箱" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'right' }">
          <a-button type="primary" @click="onSearch">
            搜索
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            清空
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
      <!-- <a slot="action" slot-scope="text">{{text}}</a> -->
    </a-table>
  </div>
</template>
<script>
const columns = [
  { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
  { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
  { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
  { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
  { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
  { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
  { title: 'Column 5', dataIndex: 'address', key: '5', width: 150 },
  { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
  { title: 'Column 7', dataIndex: 'address', key: '7', width: 150 },
  { title: 'Column 8', dataIndex: 'address', key: '8' },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' },
  },
];
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
export default {
  data() {
    return {
      data,
      columns,
      form: {},
    };
  },
  created() {
  },
  updated() {
    console.log('updated');
  },
  methods: {
    onSearch(e) {
      e.preventDefault();
    },
    handleReset() {
      this.form = {};
    },
  },
};
</script>
<style>
.ant-advanced-search-form {
  padding-bottom: 24px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
</style>