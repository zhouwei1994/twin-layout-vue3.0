<template>
  <div>
      你好
      <span>{{ userInfo.token }}</span>
      <img src="../assets/icon_pendant.png" alt="">
  </div>
</template>
<script>
import { mapState } from 'vuex';
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
    
  },
}
</script>

<style lang="scss" scoped>

</style>