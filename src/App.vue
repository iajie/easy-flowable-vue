<template>
    <div id="app">
        <img alt="Easy-Flowable LOGO" :height="100" src="./assets/logo.png">
        <EasyFlowable/>
    </div>
</template>

<script>
import EasyFlowable from './components/EasyFlowable'

export default {
    name: 'App',
    components: {
        EasyFlowable
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
