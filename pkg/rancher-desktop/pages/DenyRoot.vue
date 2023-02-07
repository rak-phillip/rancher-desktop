<template>
  <dialog-base>
    <h2>
      Cannot run as Root
    </h2>
    <p>
      Rancher Desktop cannot be run with root privileges.
      Please run again as a regular user.
    </p>
    <div class="button-area">
      <button
        data-test="accept-btn"
        class="role-primary"
        @click="close"
      >
        OK
      </button>
    </div>
  </dialog-base>
</template>

<script lang="ts">
import Vue from 'vue';

import DialogBase from '@pkg/pages/DialogBase.vue';
import { ipcRenderer } from '@pkg/utils/ipcRenderer';

export default Vue.extend({
  components: { DialogBase },
  layout:     'blank',
  mounted() {
    ipcRenderer.send('dialog/ready');
  },
  methods: {
    close() {
      window.close();
    },
  },
});
</script>

<style lang="scss" scoped>
  .button-area {
    align-self: flex-end;
  }
</style>
