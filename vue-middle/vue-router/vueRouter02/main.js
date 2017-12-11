/**
 * Create By DingLindong on 2017/12/8
 */
import Vue from "Vue"
import App from "./App"

import "static/js/third-party/flexible"

import VueRouter from "vue-router"
Vue.use(VueRouter);

import routes from "./router/router.config.js"
const router  = new VueRouter(routes);

new Vue({
    router,
    render:h => h(App)
}).$mount("#app");