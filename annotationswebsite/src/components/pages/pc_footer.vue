<template>
  <div id="pc-footer">
    <div class="footer-item-box">
      <span @click="goto('/serviceContract')">服务协议</span>
      <span @click="goto('/privacyContract')">隐私声明</span>
      <span @click="goto('/legalNotice')">法律声明</span>
    </div>
    <p class="footer-last">版权所有 © 2018-2030 成都市向己科技有限公司 川ICP备09089247号-1 川公网安备 31011202002080号</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    methods:{
      goto (path) {
        this.$router.push({path:path})
      },
    }
  }
</script>

<style scoped>
  #pc-footer{
    width: 100%;
    height: 2.3rem;
    background-color: #0b0b0c;
    margin: 0 auto;
    position: relative;
    clear: both;
    background-size: cover;
  }
  .footer-item-box{
    width: 5rem;
    height: .3rem;
    position: absolute;
    top: 30%;
    left: 50%;
    margin: .15rem 0 0 -2.5rem;
  }
  .footer-item-box>span{
    color: #fff;
    font-size: .18rem;
    margin-right: 1.31rem;
    cursor: pointer;
    transition: all 0.5s;
  }
  .footer-item-box>span:hover{
    color: #5cb4fc;
  }
  .footer-last{
    color: #fff;
    width: 6.7rem;
    height: .2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: .3rem 0 0 -3.35rem;
    text-align: center;
    border-bottom: 0.01rem solid #fff;
    font-size: .14rem;
  }
</style>
