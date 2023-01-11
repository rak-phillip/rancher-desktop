const state = () => ({ imageManagerState: false });

const mutations = {
  SET_IMAGE_MANAGER_STATE(state, imageManagerState) {
    state.imageManagerState = imageManagerState;
  },
};

const actions = {
  setImageManagerState({ commit }, imageManagerState) {
    commit('SET_IMAGE_MANAGER_STATE', imageManagerState);
  },
};

const getters = {
  getImageManagerState({ imageManagerState }) {
    return imageManagerState;
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

const config = { namespace: 'imageManager' };

export default {
  specifics: pluginStoreFactory(),
  config,
};
