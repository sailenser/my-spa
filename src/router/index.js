import { createRouter, createWebHistory } from 'vue-router'

import ProductsList from '@/views/ProductsList.vue';
import Product from '@/views/Product.vue';
import Cart from '@/views/Cart.vue';
import Checkout from '@/views/Checkout.vue';
import OfficeBase from '@/views/office/OfficeBase.vue';
import OfficeIndex from '@/views/office/Index.vue';
import OfficeOrders from '@/views/office/OfficeOrders.vue';
import E404 from '@/views/E404.vue';
import Login from '@/views/Login.vue';
import { useUserStore } from '@/store/user'


const routes = [
    {
        path: '/',
        name: 'products',
        component: ProductsList
    },
    {
        path: '/products/:id',
        name: 'products-item',
        component: Product
    },
    {
        path: '/cart',
        name: 'cart',
        component: Cart
    },
    {
        path: '/order',
        name: 'checkout',
        component: Checkout
    },
    {
        path: '/office',
        name: 'base',
        meta: { auth: true },
        component: OfficeBase,
        children: [
            {
                path: '',
                component: OfficeIndex,
                name: 'office'
            },
            {
                path: 'orders',
                component: OfficeOrders,
                name: 'office-orders'
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        beforeEnter: (async (to, from, next) => {
            const storeUser = useUserStore();
            await storeUser.ready;
            storeUser.isLogin ? next({ name: 'office' }) : next();
        }),
    },
    {
        path: '/:any(.*)',
        component: E404
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

router.beforeEach(async (to, from, next) => {
    const storeUser = useUserStore();
    if(to.meta.auth){
        await storeUser.ready;
        storeUser.isLogin ? next() : next({ name: 'login' });
    }
    else{
        next();
    }
});
export default router;