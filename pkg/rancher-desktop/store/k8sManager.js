import { ipcRenderer } from '@pkg/utils/ipcRenderer';

const state = () => ({ k8sState: ipcRenderer.sendSync('k8s-state') });

const mutations = {
  SET_K8S_STATE(state, k8sState) {
    state.k8sState = k8sState;
  },
};

const actions = {
  setK8sState({ commit }, k8sState) {
    commit('SET_K8S_STATE', k8sState);
  },
};

const getters = {
  getK8sState({ k8sState }) {
    return k8sState;
  },
};

const pluginStoreFactory = () => {
  return {
    state,
    getters,
    mutations,
    actions,
  };
};

const config = { namespace: 'k8sManager' };

export default {
  specifics: pluginStoreFactory(),
  config,
};
