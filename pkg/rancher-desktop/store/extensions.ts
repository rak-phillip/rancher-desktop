import { response } from 'express';

import { ActionContext, MutationsType } from './ts-helpers';

import type { ServerState } from '@pkg/main/commandServer/httpCommandServer';

type Credentials = Omit<ServerState, 'pid'>;

interface ExtensionsState {
  isInstalled: boolean;
  extension: string;
  name: string;
  loading: boolean;
  error: string;
  response: string;
}

export const state: () => ExtensionsState = () => (
  {
    isInstalled: false,
    extension:   '',
    name:        '',
    loading:     false,
    error:       '',
    response:    '',
  }
);

export const mutations: MutationsType<ExtensionsState> = {
  SET_IS_INSTALLED(state, isInstalled) {
    state.isInstalled = isInstalled;
  },
  SET_EXTENSION(state, extension) {
    state.extension = extension;
  },
  SET_NAME(state, name) {
    state.name = name;
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_RESPONSE(state, response) {
    state.response = response;
  },
};

type ExtensionActionContext = ActionContext<ExtensionsState>;

export const actions = {
  setIsInstalled({ commit }: ExtensionActionContext, { isInstalled }: { isInstalled: boolean }) {
    commit('SET_IS_INSTALLED', isInstalled);
  },
  setExtension({ commit }: ExtensionActionContext, { extension, name }: { extension: string, name: string }) {
    commit('SET_EXTENSION', extension);
    commit('SET_NAME', name);
  },
  resetBanners({ commit }: ExtensionActionContext) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', '');
    commit('SET_RESPONSE', '');
  },
  resetState({ commit }: ExtensionActionContext) {
    commit('SET_EXTENSION', '');
    commit('SET_NAME', '');
    commit('SET_LOADING', false);
    commit('SET_ERROR', '');
    commit('SET_RESPONSE', '');
  },
  async manageExtension({
    commit, dispatch, rootState, state, rootGetters,
  }: ExtensionActionContext, { action }: { action: string }) {
    dispatch('extensions/resetBanners', { }, { root: true });

    const credentials = rootState.credentials.credentials as Credentials;
    const result = await fetch(
      `http://localhost:${ credentials?.port }/v1/extensions/${ action }?id=${ state.extension }`,
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
      commit('SET_ERROR', result.statusText);
      commit('SET_LOADING', false);

      return;
    }

    if (result.status === 201) {
      if (action === 'uninstall') {
        dispatch('extensions/setIsInstalled', { isInstalled: false }, { root: true });
      } else {
        dispatch('extensions/setIsInstalled', { isInstalled: true }, { root: true });
      }

      commit('SET_ERROR', '');
      commit('SET_LOADING', false);
    }

    commit(
      'SET_RESPONSE',
      rootGetters['i18n/t'](`marketplace.banners.${ action }`, { name: state.name }),
    );
  },
};
