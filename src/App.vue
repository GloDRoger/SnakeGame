<template>
  <component :is="is_mobile ? 'H5' : 'Pc'"></component>
</template>

<script>
import { defineComponent, ref } from "vue";
import Pc from "./components/pc.vue";
import H5 from "./components/h5.vue";

export default defineComponent({
  components: { Pc, H5 },
  setup() {
    const is_mobile =
      navigator.userAgent
        .toLowerCase()
        .match(
          /(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i
        ) != null;

    return {
      is_mobile,
    };
  },
});
</script>

<style lang="scss"></style>
