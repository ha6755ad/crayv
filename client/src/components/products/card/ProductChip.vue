<template>
  <div>
    <q-chip v-bind="chipAttrs" clickable @click="$emit('input', value)" :removable="removable" @remove="$emit('remove', value)">
      <default-avatar :value="value" avatar-path="images" ></default-avatar>
      {{lget(value, 'name')}}
    </q-chip>
  </div>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  export default {
    name: 'ProductChip',
    components: { DefaultAvatar },
    props: {
      value: Object,
      removable: Boolean,
      avatarPath: { type: String, default: 'images' },
      chipAttrs: {
        type: Object,
        default: () => {
          return {};
        }
      }
    }
  };
</script>

<style scoped>

</style>
