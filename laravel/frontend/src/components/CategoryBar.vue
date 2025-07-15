<template>
  <div class="category-bar">
    <button
      v-for="category in categories"
      :key="category.id"
      :class="['category-btn', { active: category.id === modelValue }]"
      @click="$emit('update:modelValue', category.id)"
    >
      {{ category.category_name }}
    </button>
    <button @click="emitAllLoad" class="category-btn">全部</button>
  </div>
</template>

<script>
export default{
  props:{
  categories: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [Number, null],
    default: null
  },
},
methods:{
emitAllLoad(){
 this.$emit('update:modelValue', null);
  this.$emit('all-load');
}
}
};
</script>

<style scoped>
.category-bar {
  background-color: #df87d9;
  width: 20rem;
  display: flex;
  flex-direction: column; /* ← ここを縦並びに変えるポイント */
  gap: 8px;
  padding: 8px;
}

.category-btn {
  background-color: #df87d9;
  text-align: left;
  border: none;
  background: #eee;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.3rem;
}

.category-btn:hover {
  background: #e76fe5;
}

.category-btn.active {
  background: #007bff;
  color: white;
}
</style>
