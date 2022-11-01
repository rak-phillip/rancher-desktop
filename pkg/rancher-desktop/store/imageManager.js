export const state = () => ({ imageManagerState: false });

export const mutations = {
  SET_IMAGE_MANAGER_STATE(state, imageManagerState) {
    state.imageManagerState = imageManagerState;
  },
};

export const actions = {
  setImageManagerState({ commit }, imageManagerState) {
    commit('SET_IMAGE_MANAGER_STATE', imageManagerState);
  },
};

export const getters = {
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
