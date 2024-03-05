<script setup lang="ts">
import { useRouteStore } from '@/stores/route';

const { goto } = useRouteStore();
setTimeout(() => goto('input'), 3000);
</script>

<template>
  <p style="background: red">
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium alias
    vitae sit et, non voluptates repudiandae numquam neque, dolore quae esse?
    Pariatur impedit deserunt minus delectus. Voluptas illum assumenda qui.
  </p>
</template>
