<script setup>

import { computed, ref } from 'vue';
import ItemList from './ItemList.vue';

let message = ref('');
let i = 1;
let items = ref([
    {id: i++, name: 'piim', isDone: false },
    {id: i++, name: 'leib', isDone: false },
    {id: i++, name: 'kommid', isDone: false },
    {id: i++, name: 'krõpsud', isDone: false },
]);

function addItem() {
    if (message.value.trim() !== '') {
        items.value.push({id: i++, name: message.value.trim(), isDone: false});
    }
    message.value = '';
}

let doneItems = computed(() => items.value.filter(item => item.isDone));
let toDoItems = computed(() => items.value.filter(item => !item.isDone));

</script>

<template>
    <div class="container mt-2">
        <div class="field has-addons">
            <div class="control">
                <input class="input" type="text" v-model="message" @keypress.enter="addItem">
            </div>
            <div class="control">
                <button class="button is-info" @click="addItem">
                    Add Item
                </button>
            </div>
        </div>
        <div class="content">
            <ItemList :items="items" title="All Items"></ItemList>
            <ItemList :items="doneItems" title="Done Items"></ItemList>
            <ItemList :items="toDoItems" title="ToDo Items"></ItemList>
        </div>
    </div>
</template>

<style></style>/