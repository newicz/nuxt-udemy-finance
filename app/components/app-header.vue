<template>
  <header class="flex justify-between items-center mt-10">
    <NuxtLink to="/" class="text-xl font-bold">Finance</NuxtLink>
    <div>
      <!-- <UAvatar src="https://github.com/benjamincanac.png" alt="Greg" /> -->
      <UDropdownMenu
        :items="items"
        :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
        v-if="user"
      >
        <UAvatar src="https://github.com/benjamincanac.png" alt="Greg" />

        <template #account="{ item }">
          <div class="text-left">
            <p>Signed in as {{ user.user_metadata.full_name }}</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ user.email }}
            </p>
          </div>
        </template>
      </UDropdownMenu>
    </div>
  </header>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const items = [
  [
    {
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      onSelect: () => navigateTo("/settings/profile"),
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      onSelect: async () => {
        await supabase.auth.signOut();
        return navigateTo("/login");
      },
    },
  ],
];
</script>
