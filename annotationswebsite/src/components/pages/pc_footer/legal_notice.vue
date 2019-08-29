<template>
  <div id="legal-notice">
    <div class="contract-container">
      <p class="contract-title">法律声明</p>
      <p class="one-1">1.成都向己科技有限公司（品牌名称：菁准数据），旗下产品包括菁准数据平台，主要业务为人工智能领域的数据采集、数据标注、数据质检服务。服务范围具体包括：各种语言采集、语言转写、人脸识别、语音采集、语音识别、语义分割等。</p>
      <p class="one-1">2.菁准数据利用的基础数据均由个人用户或渠道用户提供，标注处理后的数据样本全部符合客户要求。服务过程中所涉数据均为菁准数
        据所有的商业秘密信息。如第三方恶意破坏、篡改数据或实施其他违法犯罪行为，导致客户隐私信息泄露或利用客户隐私信息谋取商业利益，
        菁准数据将积极采用法律手段维护企业合法权益。 </p>
      <p class="legal-footer">成都向己科技有限公司对本声明内容保留最终解释权。</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },

  }
</script>

<style scoped>
  #legal-notice{
    background-color: #f2f2f2;
  }
  .contract-container{
    width: 1080px;
    height: 750px;
    margin: 100px  auto;
    clear: both;
    font-size: 16px;
  }
  .contract-title{
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }

  .one-1{
    text-indent: 2em;
    line-height: 36px;
    margin-top: 40px;
  }
  .legal-footer{
    text-align: center;
    margin-top: 60px;
    color: #ff5b5b;
  }
</style>
