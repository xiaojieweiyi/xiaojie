<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>Goods</nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilerPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)"  v-bind:class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All</a></dd>
              <dd v-for="(price ,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div  class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                加载中...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登录，否则无法加入到购物车中！
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m btnG" href="javascript:;" @click="mdShow=false" >关闭</a>
      </div>
    </Modal>

    <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功！</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m btnC" href="javascript:;" @click="mdShowCart=false" >继续购物</a>
        <router-link class="btn btn--m btnC" to="/cart">查看购物车</router-link>
      </div>
    </Modal>
    <nav-footer></nav-footer>
  </div>
</template>
<style scoped>
  .btnG{
    margin-left:100px;
    padding:0 100px;
  }
  .btnC{
    margin-left:80px;

    padding:0 20px;
  }
</style>
<script>
  import './../assets/css/base.css';
  import './../assets/css/product.css'
  import NavHeader from '@/components/NavHeader'
  import NavFooter from '@/components/NavFooter'
  import NavBread from '@/components/NavBread'
  import Modal from './../components/Model'
  import axios  from "axios"
  export default{
    data(){
      return{
          goodsList:[],
          priceFilter:[
            {
              startPrice:'0.00',
              endPrice:'100.00'
            },
            {
              startPrice:'100.00',
              endPrice:'500.00'
            },
            {
              startPrice:'500.00',
              endPrice:'1000.00'
            },
            {
              startPrice:'1000.00',
              endPrice:'5000.00'
            }
          ],
        priceChecked:'all',
        filterBy:false,
        overLayFlag:false,
        sortFlag:true,
        page:1,
        pageSize:8,
        busy:true,
        loading:false,
        mdShow:false,
        mdShowCart:false
      }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    mounted:function(){
      this.getGoodsList();
    },
    methods:{
      getGoodsList(flag){
        var param={
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag?1:-1,
          priceLevel:this.priceChecked
        };
        this.loading=true;
          axios.get("/goods/list",{
            params:param
          }).then(
            (response)=>{
              let res=response.data;
              this.loading=false;
              if(res.status=="0"){
                  if(flag){
                    this.goodsList=this.goodsList.concat(res.result.list);
                   if(res.result.count==0){
                      this.busy=true;
                    }else{
                      this.busy=false;
                    }
                  }else{
                    this.goodsList=res.result.list;
                    this.busy=false;
                  }
              }else{
                this.goodsList=[];
              }

        })
      },
      showFilerPop(){
        this.filterBy=true;
        this.overLayFlag=true;
      },
      closePop(){
        this.filterBy=false;
        this.overLayFlag=false;
      },
      setPriceFilter(index){
        this.priceChecked=index;
        this.page=1;
        this.closePop();
        this.getGoodsList(false);
      },
      sortGoods(){
        this.sortFlag=!this.sortFlag;
        this.page=1;
        this.getGoodsList(false);
      },
      addCart(productId){
        axios.post("/goods/addCart", {
          productId: productId
        }).then((response)=> {
          //var test=res.request.response
         // console.log(test.status);
          let res=response.data;
          if (res.status=="0") {
            this.mdShowCart=true;
            this.$store.commit("updateCartCount",1);
          } else {
              this.mdShow=true;
          }

        })
      },
      loadMore(){
        this.busy=true;
        setTimeout(()=>{
          this.page++;
          this.getGoodsList(true);
        },500)
      },
      closeModal(){
        this.mdShow=false;
        this.mdShowCart=false;
      }
    }
  }
</script>
