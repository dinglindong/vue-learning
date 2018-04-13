/**
 * Create By Ding on 2017/12/8
 */
import home from "../components/Home.vue"
import discover from "../components/Discover.vue"
import about from "../components/Abount.vue"
import personal from "../components/Personal.vue"

import phone from "../components/Home/Phone.vue"
import tablet from "../components/Home/Tablet.vue"
import computer from "../components/Home/Computer.vue"

export default {
    routes:[
        {
            path:'/',
            redirect:'/home'
        },{
            path:'/home',
            component:home,
            children:[
                {
                    path:'phone',
                    component:phone
                },
                {
                    path:'tablet',
                    component:tablet
                },
                {
                    path:'computer',
                    component:computer
                },
                // 当进入到home时，下面的组件显示
                {
                    path: "",
                    component: phone
                }
            ]
        },{
            path:'/discover',
            component:discover
        },{
            path:'/about',
            component:about
        },{
            path:'/personal',
            component:personal
        }

    ]
}