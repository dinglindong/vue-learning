/**
 * Create By Ding on 2017/12/4
 */
import Introduce from "../components/Introduce"
import Column from "../components/Column"
import Detail from "../components/Detail"

export default {
    routes :[
        {
            path:'*',
            redirect:'/introduce',
        },
        {
            path:'/introduce',
            component:Introduce,
        },
        {
            path:'/column',
            component:Column,
        },
        {
            path:'/detail',
            component:Detail,
        }
    ]
}