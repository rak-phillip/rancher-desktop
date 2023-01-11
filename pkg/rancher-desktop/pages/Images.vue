<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { defaultSettings } from '@pkg/config/settings';
import { ipcRenderer } from '@pkg/utils/ipcRenderer';

export default {
  data() {
    return {
      settings:           defaultSettings,
      supportsNamespaces: true,
    };
  },

  computed: {
    ...mapGetters('k8sManager', { k8sState: 'getK8sState' }),
    ...mapGetters('imageManager', { imageManagerState: 'getImageManagerState' }),
  },

  watch: {
    imageManagerState: {
      handler(state) {
        this.$store.dispatch(
          'page/setHeader',
          { title: this.t('images.title') },
        );

        if (!state) {
          return;
        }

        this.$store.dispatch(
          'page/setAction',
          { action: 'images-button-add' },
        );
      },
      immediate: true,
    },
  },

  mounted() {
    ipcRenderer.on('images-check-state', (event, state) => {
      this.$store.dispatch('imageManager/setImageManagerState', state);
    });

    ipcRenderer.invoke('images-check-state').then((state) => {
      this.$store.dispatch('imageManager/setImageManagerState', state);
    });

    ipcRenderer.on('settings-update', (event, settings) => {
      // TODO: put in a status bar
      this.$data.settings = settings;
      this.checkSelectedNamespace();
    });

    ipcRenderer.send('images-namespaces-read');
    ipcRenderer.on('settings-read', (event, settings) => {
      this.$data.settings = settings;
    });
    ipcRenderer.send('settings-read');
  },
  beforeDestroy() {
    ipcRenderer.invoke('images-mounted', false);
    ipcRenderer.removeAllListeners('images-mounted');
    ipcRenderer.removeAllListeners('images-changed');
  },

  methods: {
    onShowAllImagesChanged(value) {
      if (value !== this.settings.images.showAll) {
        ipcRenderer.invoke('settings-write',
          { images: { showAll: value } } );
      }
    },
    onChangeNamespace(value) {
      if (value !== this.settings.images.namespace) {
        ipcRenderer.invoke('settings-write',
          { images: { namespace: value } } );
      }
    },
  },
};
</script>
