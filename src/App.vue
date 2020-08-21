<template>
  <div id="app">
  </div>
</template>

<script>
import twin from "@/twinLayout/index"
import Vue from 'vue'
export default {
  name: 'App',
  components: {
  },
  created(){ 
    let twinLayout = new twin("#twinLayout", {
      background: [
        "http://qn.kemean.cn/upload/202008/21/Image.png",
        "http://qn.kemean.cn/upload/202008/21/Image2.png",
        "http://qn.kemean.cn/upload/202008/21/Image3.png",
        "http://qn.kemean.cn/upload/202008/21/Image4.png",
        "http://qn.kemean.cn/upload/202008/21/Image5.png",
        "http://qn.kemean.cn/upload/202008/21/Image6.png",
        "http://qn.kemean.cn/upload/202008/21/Image7.png",
        "http://qn.kemean.cn/upload/202008/21/Image8.png",
        "http://qn.kemean.cn/upload/202008/21/Image9.png",
        "http://qn.kemean.cn/upload/202008/21/Image10.png",
        "http://qn.kemean.cn/upload/202008/21/Image11.png",
        "http://qn.kemean.cn/upload/202008/21/Image12.png",
        "http://qn.kemean.cn/upload/202008/21/Image13.png",
        "http://qn.kemean.cn/upload/202008/21/Image14.png",
        "http://qn.kemean.cn/upload/202008/21/Image15.png",
      ]
    });
    twinLayout.prototype.open = (data) => {
      let component = Vue.extend(data);
        console.log(component);
    };
    console.log(twinLayout);
    twinLayout.create();
    // twin.create();
  },
  mounted() {
    
  },
}
</script>

<style>

</style>
