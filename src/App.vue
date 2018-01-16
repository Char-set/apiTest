<template>
  <div id="app">
    <div class="apiBg">
      <img src="http://m.oudianyun.com/img/logo.png" alt="">
      api测试程序
    </div>
    <div class="">
      <div class="apiHost">
        <el-input v-model="apiHost" placeholder="apiHost"></el-input>
      </div>
      <!-- <div class="apiHost">
        <el-input v-model="companyId" placeholder="companyId"></el-input>
      </div> -->
      <div class="w600">
        <div class="btnDiv">
          <el-button type="warning" :disabled="apiHost == ''" @click="startTest()">加载文件</el-button>
        </div>
        <div class="btnDiv">
          <el-button type="success" :disabled="apiHost == ''" @click="dialogFormVisible = true">获取ut</el-button>
        </div>
        <div class="btnDiv">
          <el-button type="warning" :disabled="apiHost == ''" @click="getMpId()">获取mpId</el-button>
        </div>
        <div class="btnDiv">
          <el-button type="success" :disabled="apiHost == ''" @click="startTest()">开始测试</el-button>
        </div>
        <div class="btnDiv">
          <el-button type="info" @click="reset()">重置结果</el-button>
        </div>
      </div>
    </div>
    <div class="resultTable mgT20">
        <el-collapse v-model="activeNames">
          <el-collapse-item :name="item.title" v-for="item in showedArray" :key="item.title + '2'" v-if="item.apiList.length > 0">
            <template slot="title">
              <el-alert 
                :title="item.title"
                type="success"
                :closable="false" :key="item.title + '1'">
              </el-alert >
            </template>
            <el-table border="" :data="item.apiList" style="width: 100%" :row-class-name="tableRowClassName" :key="item.title">
              <el-table-column fixed prop="url" label="地址">
              </el-table-column>
              <el-table-column prop="params" label="基本参数" >
              </el-table-column>
              <!-- <el-table-column prop="needOrtherParams" label="其他参数">
              </el-table-column> -->
              <el-table-column prop="requestType" label="请求方式">
              </el-table-column>
              <el-table-column prop="status" label="状态" 
                :filters="[{ text: '成功', value: '2' }, { text: '失败', value: '3' },{ text: '待测试', value: '0' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    {{scope.row.status==0?'待测试':scope.row.status==2?'成功':'失败'}}
                  </template>
              </el-table-column>
              <el-table-column prop="simpleRespons" label="返回信息">
                <template slot-scope="scope">
                    {{scope.row.simpleRespons}}
                  </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button @click="showDetail(scope.row)" type="primary" :disabled="scope.row.status==0" size="small">查看</el-button>
                    <el-button type="info" size="small" @click="requestApi([scope.row])">重启</el-button>
                  </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span style="word-break: break-all;">{{showedReponse}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="登录" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="账号" :label-width="'120px'">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="'120px'">
          <el-input v-model="form.psw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="其他参数" :label-width="'120px'">
          <el-input v-model="form.params" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="login()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import NetUtil from './common/NetUtil';
import CommonUtils from './common/utils';
const apiList = require('./api.json');
export default {
  name: "app",
  data() {
    return {
      apiHost:'m.opplestore.com',
      apiList:[],
      status:0,//状态，0、未开始，1、进行中，2、已结束
      dialogVisible:false,
      showedReponse:'',
      ut:'09eaa50f84814bf5abb9dfb24d0752f9',
      mpId:'',
      typeCheck:'1',
      selectedOption:[],
      dialogFormVisible:false,
      form:{
        name:'',
        psw:'',
        params:''
      },//登录表单
      showedArray:[
        {
          title:'无需特殊参数的接口',
          apiList:[]
        },
        {
          title:'需要ut参数的接口',
          apiList:[]
        },
        {
          title:'需要mpId参数的接口',
          apiList:[]
        },
        {
          title:'需要orderCode参数的接口',
          apiList:[]
        },
      ],
      activeNames:[],//折叠面默认展开的子项
    };
  },
  methods: {
    //重启某个接口
    reStart:function(row){
      let url = 'http://' + this.apiHost +  row.url;
      let params = CommonUtils.paramsFormat(row.params?('?' + row.params):'');
    },
    //login,登录获取Ut
    login:function(){
      if(!this.form.name || !this.form.psw){
        this.$message({
          type: 'info',
          message: '别闹！'
        }); 
        return;
      }
      let url = 'http://' + this.apiHost +  '/ouser-web/api/user/login.do';
      let params = {
        mobile:this.form.name,
        password:this.form.psw
      }
      if(this.form.params != ''){
        for ( let i in this.form.params){
            params[i]=this.form.params[i];
        }
      }
      NetUtil.postForm(url,params,(res) => {
        this.$message({
          type: 'success',
          message: '登录成功！'
        });
      })
    },
    // 用搜索接口获取mpId
    getMpId:function(){
      let url = 'http://' + this.apiHost +  '/api/search/searchList?pageNo=1&pageSize=1&keyword=*****&isSubProduct=1';
      NetUtil.get(url,null,(res) => {
        if(res && res.data && res.data.productList){
          if(res.data.productList.length > 0){
            this.mpId = res.data.productList[0].mpId;
            this.$message({
              type: 'success',
              message: '获取商品Id成功'
            });
          } else{
            this.$message({
              type: 'info',
              message: '没有找到商品'
            })
          }
        } else{
          this.$message({
            type: 'info',
            message: '获取商品ID失败，需要mpId的接口将不会进行测试'
          });
        }
      },(res) => {
        this.$message({
          type: 'info',
          message: '获取商品ID失败，需要mpId的接口将不会进行测试'
        }); 
      });
    },
    //初始化、重置apilist
    reset:function(){
      this.showedArray = [
        {
          title:'无需特殊参数的接口',
          apiList:[]
        },
        {
          title:'需要ut参数的接口',
          apiList:[]
        },
        {
          title:'需要mpId参数的接口',
          apiList:[]
        },
        {
          title:'需要orderCode参数的接口',
          apiList:[]
        },
      ];
      this.showedArray.forEach(item => {
        this.activeNames.push(item.title);
      })
      if(apiList.urlList && apiList.urlList.length > 0){
        apiList.urlList.forEach(item => {
          item.status = 0;
          item.response = null;
          item.simpleRespons = '';
          let flag = true;
          if(item.needOrtherParams.ut != null){
            this.showedArray[1].apiList.push(item);
            flag = false;
          }
          if(item.needOrtherParams.mpId != null){
            this.showedArray[2].apiList.push(item);
            flag = false;
          }
          if(item.needOrtherParams.orderCode != null){
            this.showedArray[3].apiList.push(item);
            flag = false;
          }
          if(flag){
            this.showedArray[0].apiList.push(item);
          }
        });

        this.apiList = apiList.urlList;


        this.apiHost = 'm.opplestore.com';
        this.status = 0;
        this.dialogVisible = false;
        this.showedReponse = '';
      }
    },
    //查看详情
    showDetail: function(item) {
      // this.status = 1;
      this.showedReponse = JSON.stringify(item.response);
      this.dialogVisible = true;
    },
    filterTag(value, row) {
        return row.status == value;
    },
    tableRowClassName({row, rowIndex}) {
      if(row.status==3){
        return 'fail-bg';
      } else{
        return '';
      }
    },
    startTest:function(){
      this.requestApi(this.apiList);
    },
    //发起api请求
    requestApi:function(arr){
      if(!arr || !arr.length || arr.length == 0) return;
      //length 1,重启某个接口，先重置
      if(arr.length == 1){
        arr[0].status = 0;
        arr[0].response = null;
        arr[0].simpleRespons = '';
      }
      arr.forEach(item => {
        let url = 'http://' + this.apiHost +  item.url;
        let params = item.params.replace(/%{mpId}/i,this.mpId);
        params = CommonUtils.paramsFormat(params?('?' + params):'');
        for ( let i in item.needOrtherParams){
          if(this[i]){
            if(item.needOrtherParams[i]){
              params[item.needOrtherParams[i]]=this[i];
            }
          } else{
            return;
          }
        }
        switch (item.requestType) {
          case 'get':
            NetUtil.get(url,params,(res) => {
              item.status = 2;
              item.response = res;
              item.simpleRespons = JSON.stringify(res).substr(1,50);
            },(res) => {
              item.status = 3;
              item.response = res;
              item.simpleRespons = JSON.stringify(res).substr(1,50);
            })
            break;
          case 'post':
            NetUtil.post(url,params,(res) => {
              item.status = 2;
              item.response = res;
              item.simpleRespons = JSON.stringify(res).substr(1,50);
            },(res) => {
              item.status = 3;
              item.response = res;
              item.simpleRespons = JSON.stringify(res).substr(1,50);
            })
            break;
          case 'postForm':
            NetUtil.postForm(url,params,(res) => {
              item.status = 2;
              item.response = res;
              item.simpleRespons = JSON.stringify(res).substr(1,50);
            },(res) => {
              item.status = 3;
              item.response = res;
              item.simpleRespons = JSON.stringify(res).substr(1,50);
            })
            break;
          default:
            break;
        }
      });
    }
  },
  mounted:function(){
    this.reset();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  padding: 20px;
}
.apiHost{
  display: inline-block;
  width: 200px;
}
.w600{
  display: inline-block;
  width: 600px;
  text-align: center;
}
.btnDiv{
  display: inline-block;
  width: 100px;
}
.el-table .fail-bg{
  background: #f56c6c;
  color: #fff;
}
.el-table__body tr.hover-row > td{
  background:initial;
}
.el-dialog__body{
  max-height: 400px;
  overflow-y: scroll;
}
.el-collapse-item__header .el-alert{
  display: inline;
}
.el-collapse-item__wrap{
  border-bottom: none;
}
.apiBg{
  width: 100%;
  height: 200px;
  background: #f56c6c;
  margin-bottom: 20px;
  line-height: 200px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  position: relative;
}
.apiBg img{
  position: absolute;
  width: 110px;
  height: 30px;
  left: 0;
  top: 10px;
  background: #fff;
  padding: 20px;
}
</style>
