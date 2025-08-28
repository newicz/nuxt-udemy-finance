<template>
  <UModal v-model:open="isOpen" title="Add new transaction">
    <template #body>
      <USkeleton class="h-48 w-full" />
    </template>

    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        @click="isOpen = false"
      />
      <UButton label="Submit" color="neutral" />
    </template>
  </UModal>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
