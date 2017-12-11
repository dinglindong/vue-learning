<template>
    <section>
        <ul>
            <router-link tag="li" to="/introduce" active-class="active">介绍</router-link>
            <router-link tag="li" to="/column" active-class="active">栏目</router-link>
            <router-link tag="li" to="/detail" active-class="active">详情</router-link>
        </ul>
    </section>
</template>

<script>
    export default {}
</script>

<style scoped>
    ul li{
        height:30px;
        line-height:30px;
        list-style: none;
        font-size:30px;
        margin-top:30px;
    }
    .active{
        color:#0a83e0;
    }
</style>