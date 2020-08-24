<template>
  <div>
      你好
      <span>{{ userInfo.token }}</span>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'About',
  components: {
  },
  data (){
    return {}
  },
  computed: {
		...mapState(['userInfo'])
	},
  created(){ 
    console.log("-----423423",this.userInfo);
  },
  mounted() {
    setTimeout(() => {
      this.setUserInfo({ token: 33333333333333 });
    }, 4000);
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
  },
}
</script>

<style lang="scss" scoped>

</style>