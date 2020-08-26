<template>
  <div>
    你好
    <span>{{ userInfo.token }}</span>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "About",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  created() {
    console.log("-----创建成功");
  },
  activated() {
    console.log("-----页面显示");
  },
  mounted() {
    setTimeout(() => {
      this.setUserInfo({ token: 33333333333333 });
    }, 4000);
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
  },
  unmounted() {
    console.log("-----卸载成功");
  },
  onShow() {
    console.log("-----显示");
  },
  onHide() {
    console.log("-----最小化");
  },
};
</script>

<style lang="scss" scoped></style>
