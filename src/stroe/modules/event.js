import axios from 'axios';
import TYPES from '../types'

const state = {
    event: {},
    eventId: null,
    isnums: '',
    isType: null,
    deptId: null,
    isNode: null,
    location: '/home/survey-update/new-research',
    nowTab: 'xiankuang',
}

const getters = {
    event(state) {
        return state.event;
    },
    eventId(state) {
        return state.eventId;
    },
    isnums(state) {
        return state.isnums;
    },
    isType(state) {
        return state.isType;
    },
    deptId(state) {
        return state.deptId;
    },
    isNode(state) {
        return state.isNode;
    },
    location(state) {
        return state.location;
    },
    nowTab(state) {
        return state.nowTab;
    }
}

const actions = {
    showEventDetail({ commit }, row) {
        commit(TYPES.EVENT_DETAIL, row);
    },
    showEventId({ commit }, id) {
        commit(TYPES.EVENT_ID, id);
    },
    refNum({ commit }, id) {
        commit(TYPES.REF_NUM, id);
    },
    refType({ commit }, id) {
        commit(TYPES.REF_TYPE, id);
    },
    dept({ commit }, id) {
        commit(TYPES.DEPT, id);
    },
    refNode({ commit }, id) {
        commit(TYPES.REF_NODE)
    },
    remeberLocation({ commit }, locat) {
        commit(TYPES.REMEBER_LOCATION, locat)
    },
    nowTab({ commit }, name) {
        commit(TYPES.NOW_TAB, name)
    }

}

const mutations = {
    [TYPES.EVENT_DETAIL](state, row) {
        state.event = row;
    },
    [TYPES.EVENT_ID](state, id) {
        state.eventId = id;
    },
    [TYPES.REF_NUM](state, id) {
        state.isnums = id;
    },
    [TYPES.REF_TYPE](state, id) {
        state.isType = id;
    },
    [TYPES.DEPT](state, id) {
        state.deptId = id;
    },
    [TYPES.REF_NODE](state, id) {
        state.isNode = id;
    },
    [TYPES.REMEBER_LOCATION](state, locat) {
        state.location = locat;
    },
    [TYPES.NOW_TAB](state, name) {
        state.nowTab = name;
    }

}

export default {
    state,
    getters,
    mutations,
    actions
}