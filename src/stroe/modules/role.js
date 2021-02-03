import axios from 'axios';
import TYPES from '../types'

const state ={
    role:{}
}

const getters={
    role(state){
        return state.role;
    }
}

const actions={
    showRoleDetail({commit},row){
        commit(TYPES.ROLE_DETAIL,row);
    }
    
}

const mutations={
    [TYPES.ROLE_DETAIL](state,row){
        state.role=row;
    }
}

export default{
    state,
    getters,
    mutations,
    actions
}