import { defineStore } from "pinia";
import { ref, computed, reactive } from 'vue'
import * as cartApi from "../api/cart";

export const useShopStore = defineStore('shop', () => {
    let products = reactive([]);

    let proccessId = reactive([]);
    const getProduct = (id) => products.find(pr => pr.id === id);

    function setProducts(items){
        products.splice(0, products.length - 1);
        products.push(...items);
    }

    const cart = reactive([]);
    const token = ref(null);

    const total = computed(() => {
        return cart.reduce((total, cartItem) => {
            return total + getProduct(cartItem.id).price * cartItem.cnt;
        }, 0);
    });

    const inProccess = (id) => proccessId.includes(id);

    const inCart = (id) => cart.some(item => item.id === id);
    const cartCnt = (id) => cart.find(item => item.id === id)?.cnt ?? 0;

    const hasAdd = (id) => !inCart(id) && !inProccess(id);
    const hasUpdate = (id) => inCart(id) && !inProccess(id);

    async function initCart(){
        // const oldToken = localStorage.getItem('CART_TOKEN');
        // const cartInfo = await cartApi.load(oldToken)
        //
        // if(cartInfo.needUpdate){
        //     localStorage.setItem('CART_TOKEN', cartInfo.token);
        // }
        //
        // token.value = cartInfo.token;
        // cart.push(...cartInfo.cart);

        let savedToken = localStorage.getItem('cartToken');
        let { data } = await cartApi.load(savedToken);

        if(data) {
            if(data.needUpdate){
                localStorage.setItem('cartToken', data.token);
            }

            cart.push(...data.cart);
            token.value  = data.token;
        }
    }

    async function add(id){
        if(hasAdd(id)){
            proccessId.push(id);

            const res = await cartApi.add(token.value, id);

            if(res){
                cart.push({ id, cnt: 1 });
            }

            proccessId.splice(0, proccessId.length, ...proccessId.filter(id => id !== id));
        }
    }

    async function remove(id){
        if(hasUpdate(id)){
            proccessId.push(id);

            const res = await cartApi.remove(token.value, id);

            if(res){
                const index = cart.findIndex(cartItem => cartItem.id === id);
                cart.splice(index, 1);
            }

            proccessId.splice(0, proccessId.length, ...proccessId.filter(id => id !== id));
        }
    }

    async function setCnt(id, cnt){
        if(hasUpdate(id)){
            proccessId.push(id);
            const res = await cartApi.change(token.value, id, cnt);

            if(res){
                const item = cart.find(cartItem => cartItem.id === id);
                item.cnt = cnt; // we can duplicate validation here
            }

            proccessId.splice(0, proccessId.length, ...proccessId.filter(id => id !== id));
        }
    }

    function productsDetailed() {
        return cart.map(valuesProduct => {
            let { title, price } = getProduct(valuesProduct.id);

            return {
                ...valuesProduct,
                title,
                price
            }
        });
    }

    return { products, getProduct, setProducts, cart, total, initCart, add, remove, setCnt, inCart, cartCnt, productsDetailed, proccessId, inProccess }
})