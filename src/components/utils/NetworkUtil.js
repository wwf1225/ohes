/**
 * API 网络请求封装类
 */
import axios from 'axios'
var baseURL = "http://192.168.1.119:8088/";

// axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;



var instance = axios.create({
    baseURL: baseURL,
    timeout: 5000
});
instance.defaults.headers.common['token'] = getToken();
instance.defaults.params = { 'token': getToken() };


/**
 * 返回数据过滤  统一异常处理
 **/
instance.interceptors.response.use((res) => {
    if (res.data.status != 200) {
        //全局请求异常处理
        console.log("请求错误");
        console.log(res.data.body.msg);
        return Promise.reject(res);
    }
    return res.data;
}, (error) => {
    //全局网络异常处理
    console.log("网络错误");
    return Promise.reject(error);
});


/**
 * 获取本地token
 */
// export function getToken(){
//     return "8bd78e56d04efb380429cd8045ae6121";
// }

/**
 * Get请求
 * @param {请求地址} url 
 */
export function _getData(url) {
    return instance.get(baseURL + url);
}

/**
 * Post请求
 * @param {请求地址} url 
 * @param {数据} data 
 */
export function _postData(url, data) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
    return instance.post(baseURL + url, JSON.stringify(data));
}


/**
 * Api枚举
 */
export default {

    /**
     * 获取本地Token
     */
    getLocalToken() {
        return getToken();
    },

    /**
     * 用户列表
     * @param {*排序} order 
     * @param {*页码} page 
     * @param {*每页数据量} limit 
     * @param {*关键词} keyword 
     */
    User_list(order, page, limit, keyword) {
        var url = "sys/user/list?order=" + order + "&page=" + page + "&limit=" + limit + "&keyword=" + keyword;
        return _getData(url);
    },

    /**
     * 保存用户
     * @param {*Post数据} data 
     */
    User_save(data = {}) {},

    /**
     * 请求菜单列表
     */
    Menu_list() {
        var url = "sys/menu/list";
        return _getData(url);
    },

    /**
     * 删除菜单
     */
    Menu_delete(menuId) {
        var url = "sys/menu/delete?menuId=" + menuId;
        return _getData(url);
    },

    /**
     * 选择菜单
     */
    Menu_select(menuId) {
        var url = "sys/menu/select";
        return _getData(url);
    },

    /**
     * 保存菜单
     */
    Menu_save(data = {}) {
        var url = "sys/menu/save";
        return _postData(url, data);
    },
    /**
     * 更新菜单
     */
    Menu_update(data = {}) {
        var url = "sys/menu/update";
        return _postData(url, data);
    },
}