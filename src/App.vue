<template>
  <div>
    <z-login v-if="!userInfo.token" @loginsuccess="onLoginSuccess"></z-login>
  </div>
</template>

<script>
import zLogin from "@/views/common/login.vue";
import twinInit from "@/plugins/twinConfig";
import { mapState, mapMutations } from "vuex";
export default {
  name: 'App',
  components: {
    zLogin,
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  created() {
    this.setCacheData();
    if (this.userInfo.token) {
      twinInit();
    }
  },
  methods: {
    ...mapMutations(["setUserInfo", "setCacheData"]),
    onLoginSuccess(data) {
      this.setUserInfo(data);
      twinInit();
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/iconfont.scss";
@import "@/styles/common.scss";
</style>
