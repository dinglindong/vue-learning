<template>
    <section>
        <h1>这是跟组件~</h1>
        <ul>
            <router-link tag="li" to="/home">首页</router-link>
            <router-link tag="li" to="/discover">发现</router-link>
            <router-link tag="li" to="/personal">个人信息</router-link>
            <router-link tag="li" to="/about">关于我们</router-link>
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
        width:24.5%;
        float:left;
        heigh:1rem;
        line-height:1rem;
        background:#ff3b30;
        border:2px solid #FFFFFF;
        color:#ffffff;
    }
</style>