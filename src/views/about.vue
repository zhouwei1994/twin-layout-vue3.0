<template>
  <div class="container">
    你好
    <span>{{ userInfo.token }}</span>
    <img src="../assets/icon_pendant.png" alt="" />
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
    console.log("-----423423", this.userInfo);
  },
  mounted() {
    setTimeout(() => {
      this.setUserInfo({ token: 2222222222222 });
    }, 6000);
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  height: 100%;
}
</style>
