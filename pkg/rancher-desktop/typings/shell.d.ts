declare module '@shell/core/types' {
  class IPlugin {
    name: any;
    metadata: any;
    addProduct: any;
    addRoutes: any;
    addDashboardStore: any;
    addStore: any;
    DSL: any;
  }

  export type VuexStoreObject = { [key: string]: any };

  export type CoreStoreSpecifics = {
    state: () => VuexStoreObject,
    getters: VuexStoreObject,
    mutations: VuexStoreObject,
    actions: VuexStoreObject
  };

  export type CoreStoreConfig = {
    namespace: string,
    baseUrl?: string,
    modelBaseClass?: string,
    supportsStream?: boolean,
    isClusterStore?: boolean
  };
}
