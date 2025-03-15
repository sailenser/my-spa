<template>
  <span>{{ data.price }}</span>
</template>

<script setup>
import * as catalogApi from './../../api/catalog'

const props = defineProps({
  id: { type: Number, required: true }
});

const { data } = await catalogApi.one(props.id);
</script>