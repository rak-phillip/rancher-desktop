import { ActionContext, MutationsType } from './ts-helpers';

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
};
