// import Vue from "vue";
// import config from "../../env/config.js";
export default class utils  {
    /**
     * 获得主机名
     * 如果当前完整url是：http://pintuan.test.odianyun.com/my-center/home.html?p=1
     * 返回：http://pintuan.test.odianyun.com
     */
    static getHost () {
        //location.host = abc.com:8888
        //location.hostname = abc.com
        var url = location.protocol + "//" + location.host;
        return url;
    }
    /** 
     * 获得相对url
     * 如果当前完整url是：http://pintuan.test.odianyun.com/my-center/home.html?p=1
     * 返回：/my-center/home.html?p=1
     */
    static getRelatedUrl() {
        return location.pathname + (location.search || "") + (location.hash || "");
    }

    /**
     * url参数格式化
     * 例：?param=1 
     * 参数得到方式：paramsObj.param
     */
    static paramsFormat(url) {
        var qInd = url.indexOf("?");
        var sharpInd = url.indexOf("#"); //路由
        var search = "";
        var paramsList = [];
        var paramsObj = {};
        
        if (qInd >= 0) {
            if (sharpInd > 0) {
                search = url.substring(qInd + 1, sharpInd);
            } else {
                search = url.substring(qInd + 1);
            }
            paramsList = search.split("&");
            for (var ind in paramsList) {
                var param = paramsList[ind];
                var pind = param.indexOf("=");
                if (pind >= 0) {
                    paramsObj[param.substring(0, pind)] = param.substr(pind + 1);
                } else {
                    paramsObj[param] = "";
                }
            }
        }
        return paramsObj;
    }
    /**
     * 返回时间的天、时、分、秒
     * param : 秒
     */
    static getHhmmss(time) {
        time = parseInt(time);
        if(time <= 0) time = 0;
        var s = time >= 60 ? time%60 : time;
        var m = parseInt((time>=3600?time%3600:time)/60);
        var h = parseInt((time>=86400?time%86400:time)/3600);
        var d = parseInt(time/86400);
        h = h<10 ? "0"+h : h;
        m = m<10 ? "0"+m : m;
        s = s<10 ? "0"+s : s;

        return {
            d: d,
            h: h,
            m: m,
            s: s
        }
    }
    /**
     * 获取url hash的值
     * 例：/details.html?itemid=1#sort=asc&price=100
     * 返回: {sort: "asc", price: 100 }
     */
    static hashFormat(url) {
        var hashObj = {};
        var sind = url.indexOf('#');
        if (sind >= 0) {
            var hstr = url.substring(sind+1);
            var paramsList = hstr.split("&");
            for(var i=0; i<paramsList.length; i++) {
                var param = paramsList[i];
                var pind = param.indexOf("=");
                if (pind>=0) {
                    hashObj[param.substring(0, pind)] = param.substr(pind + 1);
                } else {
                    hashObj[param] = "";
                }
            }
        }

        return hashObj;
    }
    /**
     * 对象合并
     * 不支持深度合并
     */
    static mergeObj (...sources) {
        return Object.assign({}, ...sources);
    }
};
