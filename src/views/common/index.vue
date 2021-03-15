<template>
  <div class="home_page">
    <el-carousel indicator-position="none" class="carousel_tip" height="30px" direction="vertical">
      <el-carousel-item class="carousel_item twin_layout_content_color ">
        此项目后端是用egg.js框架搭建，暂未开源，客户端的代码<a class="twin_layout_content_color" href="https://ext.dcloud.net.cn/plugin?id=2009" target="_blank">点击这里</a>
      </el-carousel-item>
      <el-carousel-item class="carousel_item twin_layout_content_color">
        此框架UI即将开源，请耐心等待
      </el-carousel-item>
    </el-carousel>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>总用户量</span>
            </div>
          </template>
          <div class="statistics_number">
            {{ statisticsInfo.totalUserCount }}
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>总收益</span>
            </div>
          </template>
          <div class="statistics_number">0</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>昨日新增用户量</span>
            </div>
          </template>
          <div class="statistics_number">
            {{ statisticsInfo.yesterdayNewAdd }}
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>昨日在线用户量</span>
            </div>
          </template>
          <div class="statistics_number">
            {{ statisticsInfo.yesterdayActive }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>用户新增统计图</span>
            </div>
          </template>
          <span>用户活跃统计图</span>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>用户活跃统计图</span>
            </div>
          </template>
          <span>用户活跃统计图</span>
        </el-card>
      </el-col>
    </el-row>
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
  .el-card__body .echarts {
    width: 100%;
    height: 300px;
  }
  .card {
    margin-bottom: 20px;
  }
  .carousel_tip {
    margin-bottom: 15px;
  }

  .statistics_number {
    font-size: 32px;
    font-weight: bold;
    color: #666;
  }

  .carousel_item {
    height: 30px;
    line-height: 30px;
    a {
      text-decoration: underline;
    }
  }
}
</style>
