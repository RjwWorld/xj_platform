<template>
  <div>
    <nav>
      <ul class="pagination">
        <li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(current - 1)"> « </a></li>
        <li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(1)"> 首页 </a></li>
        <li v-for="p in grouplist" :class="{'active': current == p.val}">
          <a href="javascript:;" @click="setCurrent(p.val)"> {{ p.text }} </a>
        </li>
        <li :class="{'disabled': current == page}"><a href="javascript:;" @click="setCurrent(page)"> 尾页 </a></li>
        <li :class="{'disabled': current == page}"><a href="javascript:;" @click="setCurrent(current + 1)"> »</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        current: this.currentPage
      }
    },
    props: {
      total: {// 数据总条数
        type: Number,
        default: 0
      },
      display: {// 每页显示条数
        type: Number,
        default: 9
      },
      currentPage: {// 当前页码
        type: Number,
        default: 1
      },
      pagegroup: {// 分页条数
        type: Number,
        default: 9,
        coerce: function (v) {
          v = v > 0 ? v : 9;
          return v % 2 === 1 ? v : v + 1;
        }
      }
    },
    computed: {
      page: function () { // 总页数
        return Math.ceil(this.total / this.display);
      },
      grouplist: function () { // 获取分页页码
        var len = this.page, temp = [], list = [], count = Math.floor(this.pagegroup / 2), center = this.current;
        if (len <= this.pagegroup) {
          while (len--) {
            temp.push({text: this.page - len, val: this.page - len});
          }
          ;
          return temp;
        }
        while (len--) {
          temp.push(this.page - len);
        }
        ;
        var idx = temp.indexOf(center);
        (idx < count) && ( center = center + count - idx);
        (this.current > this.page - count) && ( center = this.page - count);
        temp = temp.splice(center - count - 1, this.pagegroup);
        do {
          var t = temp.shift();
          list.push({
            text: t,
            val: t
          });
        } while (temp.length);
        if (this.page > this.pagegroup) {
          (this.current > count + 1) && list.unshift({text: '...', val: list[0].val - 1});
          (this.current < this.page - count) && list.push({text: '...', val: list[list.length - 1].val + 1});
        }
        return list;
      }
    },
    methods: {
      setCurrent: function (idx) {
        if (this.current != idx && idx > 0 && idx < this.page + 1) {
          this.current = idx;
          this.$emit('pagechange', this.current);
        }
      }
    }
  }
</script>

<style scoped>
  .pagination {
    overflow: hidden;
    display: table;
    margin: .25rem auto;
    /*width: 100%;*/
    height: .50rem;
  }
  li {
    float: left;
    height: .30rem;
    border-radius: 0.05rem;
    margin: 0.03rem;
    color: #666;
    border: solid 0.01rem #eaeaea;
    background-color: #fff;
  }
  li:focus{
    background-color: #5cb4fc;
  }
  a {
    display: block;
    width: .40rem;
    height: .30rem;
    text-align: center;
    line-height: .30rem;
    font-size: .12rem;
    border-radius: 0.05rem;
    text-decoration: none;
    color: #434343;
  }
  a:hover{
    color: #fff;
    background-color: #5cb4fc;
  }
  a:active{
    background-color: #5cb4fc;
  }
</style>
