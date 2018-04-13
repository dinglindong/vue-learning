/**
 * Create By Ding on 2017/12/8
 */
import Vue from "Vue"
import App from "./App.vue"
import "static/js/third-party/flexible.js"

import VueRouter from "vue-router"
Vue.use(VueRouter);

import routes from "./router/router.config"
const router  = new VueRouter(routes);

new Vue({
    router,
    render:h => h(App)
}).$mount("#app");