<template>
    <div>
      <div class="col col-auto">
        <button v-if="cartCnt > 0" @click="shopStore.remove(id)" :disabled="shopStore.inProccess(props.id)" class="btn btn-danger">Remove</button>
        <button v-else @click="shopStore.add(id)" :disabled="shopStore.inProccess(props.id)" class="btn btn-success">Add to cart</button>
      </div>
      <transition name="slide">
      <div class="col col-auto">
        <hr>
        <AppMinMax v-if="cartCnt > 0" :min="1" :max="product.rest" :value="tmpCartCnt" @change="onSetCnt" :id="props.id" />
      </div>
      </transition>
    </div>
</template>

<script setup>
import AppMinMax from './../MinMax.vue'
import { useShopStore } from '@/store/shop';
import { ref, computed, watch } from 'vue'

const props = defineProps({
  id: { type: Number, required: true }
});

const shopStore = useShopStore();
const product = computed(() => shopStore.getProduct(props.id));
const cartCnt = computed(() => shopStore.cartCnt(product.value.id));
const tmpCartCnt = ref(cartCnt.value);

watch(cartCnt, () => {
  tmpCartCnt.value = cartCnt.value;
})

let cntTimeout = null;

function onSetCnt(cnt){
  tmpCartCnt.value = cnt;

  clearTimeout(cntTimeout);
  cntTimeout = setTimeout(() => shopStore.setCnt(props.id, tmpCartCnt.value), 300)
}

</script>