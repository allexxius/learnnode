<script setup>
import { ref } from 'vue';
import Tabs from './components/Tabs.vue';
let titles = ref(['item1', 'item2', 'item3', 'item4']);
</script>

<template>
    <Tabs :items="titles"></Tabs>

</template>

<style></style>