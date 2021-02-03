import axios from 'axios';
import TYPES from '../types';
var qs = require('qs');

const state = {
    mylist: [],
    navlist: []
}

const getters = {
    mylist(state) {
        return state.mylist;
    }
}

const actions = {
    // getList({commit}){
    //     axios.get('/api/sys/menu/nav').then(res=>{
    //         commit(TYPES.GET_LIST,res.data.goods);
    //     })
    // }

    //   新建axios实例
    getList() {
        var instance = axios.create({
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            }
        });
        instance.get('/sys/menu/nav?token=cb5cd6f20352b17f58f4f60eeaf8b6e8').then(function(res) {
            console.log(res.data);
            return res.data;
        });
    }

    /* getList(context){
         axios({
             method:'get',
             url:'http://192.168.1.88:8088/sys/menu/nav',
             headers: {'token':'8a2f50aea41fd1402ae672fa5aa60743'},
             data:context.state.mylist
         })
     }*/

    /*getList(){
        axios({
           method:'get',
           url:'http://192.168.1.88:8088/sys/menu/nav',
           headers:{
               'token':'8a2f50aea41fd1402ae672fa5aa60743'
           }
        }).then(function(res){
            console.log(res.data);
            return res.data;
        })
    }*/
}

const mutations = {
    [TYPES.GET_LIST](state, data) {
        state.mylist = data;
    },
    add_navs(state, data) {
        state.navlist = data;
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}