<template>
    <section>
            <ul>
                <router-link tag="li" to="/home">主页</router-link>
                <router-link tag="li" to="/about">关于我们</router-link>
                <!--  增加两个到user组件的导航，可以看到这里使用了不同的to属性 -->
                <router-link tag="li" to="/user/login">登陆</router-link>
                <router-link tag="li" to="/user/register">注册</router-link>
            </ul>
        <router-view></router-view>
    </section>
</template>

<script>
    export default {}
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base";
    ul{
        width:100%;
    }
    ul li{
        float:left;
        width:24.5%;
        height:1rem;
        line-height: 1REM;
        text-align:center;
        background:#f70044;
        color:#FFFFFF;
        border:2px solid #FFFFFF;
    }
    section{
        border:2px solid #0a83e0;
        width:100%;
        height:5rem;
    }
</style>