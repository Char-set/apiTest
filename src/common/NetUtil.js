/**
 * NetUtil 网络请求的实现
 * https://github.com/facebook/react-native
 */
// import React, { Component } from 'react';

// import utils from './ComUtils';

// import configureStore from '../store/index';
// import { user_logIn, user_logOut } from '../actions/user';
// let store = configureStore();
export default class NetUtil{
    /*
     *  get请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static get(url,params,sucCallback,failCallback){
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        //fetch请求
        fetch(url,{
            method: 'GET',
            // credentials: "include",
            headers:{
                'X-Requested-With': 'XMLHttpRequest'
            },
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            if (this.isSuccessful(responseJSON)) {
                if (typeof sucCallback == 'function') {
                    sucCallback(responseJSON);
                }
            } else if (typeof failCallback == 'function') {
                failCallback(responseJSON);
            } else {
                this._hanleError(responseJSON);
            }
        }) 
        .catch((error) => {
            if(typeof failCallback == 'function'){
                failCallback(error)
            } else{
                console.log(error)
            }
        });
    }
    /*
     *  post请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static post(url,params,headers,sucCallback,failCallback){
        //fetch请求
        fetch(url,{
            method: 'POST',
            headers:{
                'token': headers,
                'X-Requested-With': 'XMLHttpRequest'
            },
            // credentials: "include",
            body:JSON.stringify(params)
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            if (this.isSuccessful(responseJSON)) {
                if (typeof sucCallback == 'function') {
                    sucCallback(responseJSON);
                }
            } else if (typeof failCallback == 'function') {
                failCallback(responseJSON);
            } else {
                this._hanleError(responseJSON);
            }
        }) 
        .catch((error) => {
            if(typeof failCallback == 'function'){
                failCallback(error)
            } else{
                console.log(error)
            }
        });
    }
    /*
     *  postForm 表单请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static postForm(url,params,sucCallback,failCallback){
        //fetch请求
        fetch(url,{
            method: 'POST',
            // credentials: "include",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body:toQueryString(params)
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            if (this.isSuccessful(responseJSON)) {
                if (typeof sucCallback == 'function') {
                    sucCallback(responseJSON);
                }
            } else if (typeof failCallback == 'function') {
                failCallback(responseJSON);
            } else {
                this._hanleError(responseJSON);
            }
        }) 
        .catch((error) => {
            if(typeof failCallback == 'function'){
                failCallback(error)
            } else{
                console.log(error)
            }
        });
    }
    /**
     * 判断请求返回是成功还是失败
     */
    static isSuccessful(response) {
        var data = response;
        //JSON格式的数据
        if (data && (data.hasOwnProperty("code") || data.hasOwnProperty("Code"))) {
            if(data.code == "0"){
                return true;
            } else {
                // store.dispatch(user_logOut());
                return false;
            }
        }

        //非JSON数据
        if (response.status == 200) {
            return true;
        }

        return false;
    }
    /**
     * 提示错误信息
     */
    static _hanleError(response) {
        let msg = response && response.message ? response.message : "请求出错，请稍后再试";
        // utils.showTips(msg)
    }
}
function toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
        var val = obj[key];
        if (Array.isArray(val)) {
            return val.sort().map(function (val2) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
}