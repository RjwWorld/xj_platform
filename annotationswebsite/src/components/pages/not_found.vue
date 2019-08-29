<template>
  <div class="not-container">
    <div class="not-box">
      <p>404</p>
      <p>这个页面到火星去了</p>
      <p><img :src="notFoundLogo" alt="NotFound"></p>
      <p @click="goto('/')">回到首页</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        notFoundLogo:require('../../assets/images/500/500.png'),
      }
    },
    methods: {
      goto (path) {
        this.$router.push({path:path})
      },
    },
  }
</script>

<style scoped>
  .not-container{
    width: 100%;
    position: relative;
  }
  .not-box{
    width: 6.00rem;
    height: 4.00rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 2.00rem 0 0 -3.00rem;
    text-align: center;
  }
  .not-box>p:first-child{
    font-size: .80rem;
    color: #434343;
    font-weight: bold;
  }
  .not-box>p:nth-child(2){
    font-size: .40rem;
    color: #434343;
    margin-top: .48rem;
  }
  .not-box>p:nth-child(3){
    margin-top: .48rem;
  }
  .not-box>p:nth-child(3)>img{
    width: 1.00rem;
  }
  .not-box>p:last-child{
    margin: 0 auto;
    width: 2.36rem;
    height: .58rem;
    cursor: pointer;
    background-color: #ddd;
    line-height: .58rem;
    border-radius: .20rem;
    font-size: .30rem;
    color: #434343;
    margin-top: .63rem;
    transition: all 0.3s;
  }
  .not-box>p:last-child:hover{
    transform: scale(1.1,1.1);
  }
</style>
