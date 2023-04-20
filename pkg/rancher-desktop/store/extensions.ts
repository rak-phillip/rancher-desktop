import { response } from 'express';

import { ActionContext, MutationsType } from './ts-helpers';

import type { ServerState } from '@pkg/main/commandServer/httpCommandServer';

type Credentials = Omit<ServerState, 'pid'>;

interface ExtensionsState {
  isInstalled: boolean;
}

export const state: () => ExtensionsState = () => (
  { isInstalled: false }
);

export const mutations: MutationsType<ExtensionsState> = {
  SET_IS_INSTALLED(state, isInstalled) {
    state.isInstalled = isInstalled;
  },
};

type ExtensionActionContext = ActionContext<ExtensionsState>;

export const actions = {
  setIsInstalled({ commit }: ExtensionActionContext, { isInstalled }: { isInstalled: boolean }) {
    commit('SET_IS_INSTALLED', isInstalled);
  },
  async manageExtension({ dispatch, rootState }: ExtensionActionContext, { action, extension }: { action: string, extension: string }) {
    const credentials = rootState.credentials.credentials as Credentials;
    const result = await fetch(
      `http://localhost:${ credentials?.port }/v1/extensions/${ action }?id=${ extension }`,
      {
        method:  'POST',
        headers: new Headers({
          Authorization: `Basic ${ window.btoa(
            `${ credentials?.user }:${ credentials?.password }`,
          ) }`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      },
    );

    if (!result.ok) {
      return {
        error:   result.statusText,
        loading: false,
      };
    }

    if (result.status === 201) {
      if (action === 'uninstall') {
        dispatch('extensions/setIsInstalled', { isInstalled: false }, { root: true });
      } else {
        dispatch('extensions/setIsInstalled', { isInstalled: true }, { root: true });
      }

      return {
        error:   '',
        loading: false,
      };
    }
  },
};
