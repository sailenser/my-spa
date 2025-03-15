<template>
  <div>
    <h1>Личный кабинет</h1>
    <hr>
    <button type="button" class="btn btn-danger" @click="makeLogout">Logout</button>
  </div>
</template>

<script setup>
import router from '@/router'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
async function makeLogout(){
  let res = await userStore.logout();
  if(res){
    router.push({name: 'login'}).then(() => {
      location.reload();
    });
  }
}
</script>