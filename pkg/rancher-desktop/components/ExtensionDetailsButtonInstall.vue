<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapState } from 'vuex';

import LoadingIndicator from '@pkg/components/LoadingIndicator.vue';

interface VuexBindings {
  isInstalled: boolean;
}

export default (Vue as VueConstructor<Vue & VuexBindings>).extend({
  name:       'extension-details-button-install',
  components: { LoadingIndicator },
  data() {
    return { loading: false };
  },
  computed: {
    ...mapState('extensions', ['isInstalled']),
    installationAction(): string {
      return this.isInstalled ? 'uninstall' : 'install';
    },
    buttonLabel(): string {
      if (this.loading) {
        return this.isInstalled ? this.t('marketplace.sidebar.uninstallButton.loading') : this.t('marketplace.sidebar.installButton.loading');
      } else {
        return this.isInstalled ? this.t('marketplace.sidebar.uninstallButton.label') : this.t('marketplace.sidebar.installButton.label');
      }
    },
  },
});
</script>

<template>
  <button
    data-test="button-install"
    class="btn btn-xs role-primary"
    :disabled="loading"
    @click="appInstallation(installationAction)"
  >
    <span v-if="loading" name="loading" :is-loading="loading">
      <loading-indicator>{{ buttonLabel }}</loading-indicator>
    </span>

    <span v-if="!loading">{{ buttonLabel }}</span>
  </button>
</template>

<style lang="scss" scoped>
  .btn-xs {
    min-height: 2.25rem;
    max-height: 2.25rem;
    line-height: 0.25rem;
  }
</style>
