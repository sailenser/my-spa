<template>
  <button @click="onUpdate(value - 1)" :disabled="value <= min && disableNearMin || checkInProccess(id)" class="btn btn-danger">
    <AppIcon :icon="faMinus.icon" width="14px" />
  </button>
  <input ref="inp" :value="value" @change="onUpdate(+$event.target.value)" class="mx-2" :class="$style.inputCnt" type="text">
  <button @click="onUpdate(value + 1)" :disabled="value >= max && disableNearMax || checkInProccess(id)" class="btn btn-success">
    <AppIcon :icon="faPlus.icon" />
  </button>
</template>

<script>
import AppIcon from './../components/Icon.vue'
import { useShopStore } from '@/store/shop';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons' 

export default {
  components: {
    AppIcon
  },
  props: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    value: { type: Number, required: true },
    disableNearMin: { type: Boolean, default: true },
    disableNearMax: { type: Boolean, default: true },
    id: {type: Number}
  },
  emits: [ 'change' ],
  data(){
    return {
      faPlus,
      faMinus,
      shopStore: useShopStore()
    }
  },
  methods: {
    onUpdate(newCnt){
      const realCnt = isNaN(newCnt) ? this.min : Math.min(Math.max(newCnt, this.min), this.max);
      this.$emit('change', realCnt);

      this.$nextTick(() => {
        if(this.value.toString() != this.$refs.inp.value){
          this.$forceUpdate();
        }
      });
    },
    checkInProccess(id) {
      return this.shopStore.inProccess(id);
    },
  },
}
</script>

<style module>
  .inputCnt{
    width: 50px;
  }
</style>