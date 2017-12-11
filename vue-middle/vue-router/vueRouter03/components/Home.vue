<template>
    <section>
        <h1>这是主页11111111111</h1>
        <!-- router-link 的to属性要注意，路由是先进入到home,然后才进入相应的子路由如 phone,所以书写时要把 home 带上 -->
        <ul>
            <router-link tag="li" to="/home/phone">手机</router-link>
            <router-link tag="li" to="/home/tablet">平板</router-link>
            <router-link tag="li" to="/home/computer">电脑</router-link>
        </ul>
        <router-view></router-view>
    </section>
</template>

<script>
    export default {}
</script>
