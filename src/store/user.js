import { defineStore } from "pinia";
import {computed, ref} from 'vue'
import * as userApi from '@/api/user.js';
import { setTokens, cleanTokensData, getJWTPayload, getAccessToken } from '@/utils/tokens';

let readyResolver;
let readyPromise = new Promise(function(resolve){
    readyResolver = resolve;
});

export const useUserStore = defineStore('user', () => {
    const user = ref(null);
    const ready = computed(() => readyPromise);
    const isLogin = computed(() => user.value !== null);
    const checkRole = computed(() => allowedRoles => user.value !== null && allowedRoles.some(role => user.value.roles.includes(role)))

    async function login({login, password}){
        let { res, data } = await userApi.login(login, password);

        if(!res){
            return { errors: 'Нет связи' }
        }
        else if(data.res){
            setTokens(data.accessToken);
            let { login, name, roles } = getJWTPayload(data.accessToken);
            this.user = { login, name, roles };
        }

        return data;
    }

    async function autoLogin(){
        let { res } = await userApi.check();

        if(res){
            let { login, name, roles } = getJWTPayload(getAccessToken());
            user.value = { login, name, roles };
        }

        readyResolver();
    }

    async function logout(){
        let { res } = await userApi.logout();

        if(res){
            clean()
        }

        return res;
    }
    async function clean(){
        cleanTokensData();
        user.value = null;
    }

    return {
        user, login, autoLogin, ready, isLogin, checkRole, logout, clean
    }
})