<script setup lang="ts">
import { AES, enc } from 'crypto-js';
import { computed, ref } from 'vue';

const input = ref('');
const secret = ref('');
const output = computed(() =>
  AES.encrypt(input.value, secret.value).toString()
);
const decode = computed(() =>
  AES.decrypt(output.value, secret.value).toString(enc.Utf8)
);
</script>

<template>
  <div>
    <textarea cols="30" rows="10" v-model="input"></textarea>
    <input type="text" v-model="secret" />
    <p>"{{ output }}"</p>
    <p>"{{ decode }}"</p>
  </div>
</template>

<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}
</style>
