<template>
  <div class="home_page">
    <a-row :gutter="16">
      <a-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <a-card title="总用户量" :bordered="false">
          <span class="statistics_number">{{ statisticsInfo.totalUserCount }}</span>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <a-card title="总收益" :bordered="false">
          <span class="statistics_number">0</span>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <a-card title="昨日新增用户量" :bordered="false">
          <span class="statistics_number">{{ statisticsInfo.yesterdayNewAdd }}</span>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <a-card title="昨日在线用户量" :bordered="false">
          <span class="statistics_number">{{ statisticsInfo.yesterdayActive }}</span>
        </a-card>
      </a-col>
    </a-row>
    <div class="interval"></div>
    <a-row :gutter="16">
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-card title="用户新增统计图" :bordered="false">
          用户新增统计图
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-card title="用户活跃统计图" :bordered="false">
          用户活跃统计图
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: "Index",
  data() {
    return {
      statisticsInfo: {},
    };
  },
  created() {
    this.fetchData();
    console.log("11111");
  },
  mounted() {
  },
  twinShow() {
    console.log("页面显示");
  },
  twinHide() {
    console.log("页面隐藏");
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      this.$api.statistical.getUserNewActiveLogs(this.queryForm).then((res) => {
        this.statisticsInfo = res.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home_page {
  background-color: transparent;
  margin: 0;
  .statistics_number {
    font-size: 32px;
    font-weight: bold;
    color: #666;
    line-height: 32px;
  }
  .interval {
    height: 16px;
  }
}
</style>
