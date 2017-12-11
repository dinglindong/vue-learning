import User from "../components/User.vue"
import Home from "../components/Home.vue"
import About from "../components/About.vue"

export default {
    routes:[
        {
            path: '/',
            redirect: '/home'
        },
        {
            path:"/home",
            component: Home
        },
        {
            path: "/about",
            component: About
        },
        /*新增user路径，配置了动态的id*/
        {
            path: "/user/:id",
            component: User
        }
    ]
}