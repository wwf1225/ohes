var config = {
    // xiongxi
    // apiHost: "http://localhost:8888/apis",

    // yangwei
    // apiHost: "http://192.168.4.25:8088",
    // apiHost: "http://192.168.4.66:8088",

    // online
    // apiHost: "http://eoc.sublimationlife.com/apis",
    apiHost: "apis",  
    apiUrl: "froms/",

    // 资料管理
    // datumUrl:"http://192.168.4.223:8099",
    datumUrl:"http://res.sublimationlife.com",
    // datumUrl:"http://192.168.4.66:8099",
    indexPagePath: "/home/home-page",
    systemKey:'test',
    canRequest:true,
    // token: "kRt4dXSpAPiwTq21ECIwT6lIbTc08GGN", 
    token: "", 
    hasPermission: function(permission) {
        // console.log(window.parent.permissions);
        if (window.parent.permissions == "" || window.parent.permissions == undefined) {
            return false;
        }
        if (window.parent.permissions.indexOf(permission) > -1) {
            return true;
        } else {
            return false;
        }
    }
};
module.exports = config;