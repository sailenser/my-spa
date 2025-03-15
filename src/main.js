import { createApp } from 'vue'
import './scss/styles.scss'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia'
import { all } from './api/catalog'
import "bootstrap/dist/css/bootstrap.min.css";
import { useShopStore } from '@/store/shop'
import { useUserStore } from '@/store/user'
import { useAlertsStore } from "@/store/alerts";
import { addResponseHandler } from '@/api/http';

async function catalogLoader(){
    // TODO: нужно будет искать в store и если есть то сбрасывать запрос
    // if(window.appCatalog){
    //     return window.appCatalog;
    // }
    return await all();
}

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

const storeUser = useUserStore();
const storeShop = useShopStore();
const storeAlert = useAlertsStore();

//Интерсептор обраторки ошибок
addResponseHandler(
    function(response) {
        console.log("1111", response);
        if('errorAlert' in response.config) {
            let respond = response;
            respond.data = { res: true, data: response.data }
        }

        return response;
    },
    function(error){
        console.log("2222");
        let config = error.response.config;

        if(error.response.status == 401 && config.appSilence401 !== true){
            // clean user data & tokens
            storeUser.clean()

            router.push({name: 'login'}).then(() => {
                location.reload();
            });
            return;
        }

        if('errorAlert' in config){
            let { errorAlert } = config;

            if(typeof errorAlert === 'string'){
                errorAlert = { text: errorAlert };
            }

            storeAlert.add({
                text: 'Ошибка ответа от сервера ' + errorAlert.text,
                timeout: errorAlert.timeout ?? 5000,
                critical: errorAlert.critical ?? false
            });

            return { data: { res: false, data: null }};
        }

        return Promise.reject(error);
    }
);

storeUser.autoLogin().then(user => {
    if(user){
        // useUserStore().setUser(user);
    }
});

storeShop.initCart();

catalogLoader().then(products => storeShop.setProducts(products)).then(() => {
    app.use(router, VueAxios, axios);
    app.mount('#app');
})

import "bootstrap/dist/js/bootstrap.js";
