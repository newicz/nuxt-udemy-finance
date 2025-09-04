<template>
  <div>
    <div class="mb-4">
      <UFormField
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar :src="url" size="3xl" />
      </UFormField>
    </div>

    <div class="mb-4">
      <UFormField
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UFileUpload class="w-24 h-24" v-model="fileInput" />
      </UFormField>
    </div>

    <UButton
      type="submit"
      color="primary"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast();
const { url } = useAvatarUrl();

const uploading = ref(false);
const fileInput = ref(null); // Reference to an input with ref="fileInput" attribute

const saveAvatar = async () => {
  // 1. Get the uploaded file
  //    a) If no file uploaded, show toast error
  // 2. Generate the new filename
  if (!fileInput.value) {
    toastError("Select a file to upload first!");
    return;
  }

  const fileExt = fileInput.value.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;

  try {
    uploading.value = true;
    // 1. Grab the current avatar URL
    const currentAvatarUrl = user.value.user_metadata?.avatar_url;
    // 2. Upload the image to avatars bucket
    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, fileInput.value);

    if (error) throw error;
    // 3. Update the user metadata with the avatar URL
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });
    // 4. (OPTIONALLY) remove the old avatar file
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from("avatars")
        .remove([currentAvatarUrl]);
      if (error) throw error;
    }
    // 5. Reset the file input
    fileInput.value = null;

    toastSuccess("Avatar uploaded");
  } catch (error) {
    toastError("Error uploading avatar", error.message);
  } finally {
    uploading.value = false;
  }
};
</script>
