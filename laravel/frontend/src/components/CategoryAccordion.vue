<template>
  <div class="accordion">
    <div class="accordion-header" @click="toggleAccordion">
      カテゴリ一覧
      <span v-if="isOpen">▲</span>
      <span v-else>▼</span>
    </div>
    <div class="accordion-content" v-show="isOpen">
      <ul class="category-list">
        <li
          v-for="category in categories"
          :key="category.id"
          :class="{ selected: isSelected(category.id) }"
          @click="selectCategory(category.id)"
        >
          {{ category.category_name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: Array,
    modelValue: [Number, null]
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleAccordion() {
      this.isOpen = !this.isOpen;
    },
    isSelected(id) {
      return this.modelValue === id;
    },
    selectCategory(id) {
      const newValue = this.modelValue === id ? null : id;
      this.$emit('update:modelValue', newValue);
    },
    selectAll() {
      this.$emit('update:modelValue', null);
      this.$emit('all-load');
    }
  }
};
</script>

<style scoped>
.accordion {
  border: 1px solid #ccc;
  width: 200px;
}
.accordion-header {
  background-color: #f2f2f2;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
}
.accordion-content {
  background-color: #fff;
}
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.category-list li {
  padding: 8px 10px;
  cursor: pointer;
}
.category-list li:hover {
  background-color: #f0f0f0;
}
.category-list li.selected {
  background-color: #cce5ff;
  font-weight: bold;
}
</style>
