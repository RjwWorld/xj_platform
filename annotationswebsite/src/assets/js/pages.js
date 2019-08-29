//产品列表
var type=1;//产品类型
var pageNum=1;//当前页码
var pageC=0;//总页数
function pList(type,pageNum){
  $.ajax({
    type:"post",
    url:"../data/product_list.php",
    data:{type:type,pageNum:pageNum},
    success:function(d){
      console.log(d);
      var liHtml="";
      //产品列表
      for(var p of d.data){
        liHtml+=`<div class="info-item">
          <p class="info-item-date">
            <span><img :src="bellIcon" alt="" class="bell-icon"></span>
            <span class="info-date">${p.infoDate}</span>
            <span>${p.infoDateH}</span>
            <span v-show="!isRead"><img :src="isReadIcon" alt="" class="read-icon"></span>
          </p>
          <p class="info-content" @click="goInfodetails()">${p.infoContent}</p>
        </div>
                </div>`;
        $(".my-info").html(liHtml);
      }

      //页码
      var pageHtml='<a href="prev">上一页</a>';
      pageC=d.pageCount;
      for(var i=1;i<pageC+1;i++){
        pageHtml+='<a href="'+i+'">'+i+'</a>';
      }
      pageHtml+='<a href="next">下一页</a>';
      $(".pages").html(pageHtml);
      if(pageNum==1){
        $(".pages a:first").addClass("default");
      }
      if(pageNum==pageC){
        $(".pages a:last").addClass("default");
      }
      $(".pages a").eq(pageNum).addClass("cur");
    }
  });
}
pList(1,1);

//页码点击事件
$(".pages").on('click','a',function(e){
  e.preventDefault();//清除a标记的默认行为
  var pageN=$(this).index();
  //console.log(pageN);
  if(pageN==0){//当点击的是“上一页”的时候
    if(pageNum==1) return;
    pageNum--;
  }else if(pageN==pageC+1){//当点击的是下一页”的时候
    if(pageNum==pageC) return;
    pageNum++;
  }else{
    pageNum=pageN;
  }
  //console.log(pageCur)
  pList(type,pageNum);
});
