<template>
    <section>
        <my-switch></my-switch>
        <router-view></router-view>
    </section>

</template>

<script>
    import mySwitch from "./components/SwitchBar"
    export default {
        components:{
            mySwitch,
        }
    }
</script>

