import { CoreStoreSpecifics, CoreStoreConfig } from '@shell/core/types';

import { ActionContext, MutationsType } from './ts-helpers';

import type { ServerState } from '@pkg/main/commandServer/httpCommandServer';
import { ipcRenderer } from '@pkg/utils/ipcRenderer';

interface CredentialsState {
  credentials: ServerState;
}

const state: () => CredentialsState = () => (
  {
    credentials: {
      password: '',
      pid:      0,
      port:     0,
      user:     '',
    },
  }
);

const mutations: MutationsType<CredentialsState> = {
  SET_CREDENTIALS(state, credentials) {
    state.credentials = credentials;
  },
};

type CredActionContext = ActionContext<CredentialsState>;

const actions = {
  async fetchCredentials({ commit }: CredActionContext): Promise<ServerState> {
    const result = await ipcRenderer.invoke('api-get-credentials');

    commit('SET_CREDENTIALS', result);

    return result;
  },
};

const pluginStoreFactory = (): CoreStoreSpecifics => {
  return {
    state,
    getters: { },
    mutations,
    actions,
  };
};

const config: CoreStoreConfig = { namespace: 'credentials' };

export default {
  specifics: pluginStoreFactory(),
  config,
};
