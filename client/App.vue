<template>
  <button @click="ativar" :disabled="!!worker">
    Ativar Notificação
  </button>
  <button @click="notifyCheck" >
    Testar Notificação
  </button>
</template>

<script>
import { reactive } from '@vue/reactivity'
  import { sw, subscribeToPushNotifications, notifyCheck } from './plugins/notification'
  export default {

    setup() {
      let worker = reactive(sw)
      const ativar = () => {
        console.log("ativando", process?.env?.NODE_ENV)
        subscribeToPushNotifications()
      }

      return {
        ativar,
        worker,
        notifyCheck
      }

    }
  }
</script>

<style>
  * {
    margin:0;
    padding:0;
    outline: none;
    border: none;
  }

  button {
    padding: 10px 20px;
    cursor: pointer;
    background: rgb(25, 42, 61);
    color: #fff;
    font-weight: bold;
    border-radius: 10px;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    display: grid;
    place-items: center;
  }
</style>
