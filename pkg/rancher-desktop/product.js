export const NAME = 'rancher-desktop';

export function init(plugin, store) {
  const { product } = plugin.DSL(store, NAME);

  store.dispatch(
    'setIsSingleProduct',
    {
      afterLoginRoute:     { name: 'General', params: {} },
      logo:                require(`./assets/images/logo.svg`),
      productNameKey:      'app.name',
      logoRoute:           { name: 'General', params: {} },
      disableSteveSockets: true,
    },
  );

  product({
    inStore:             'management',
    icon:                'rancher-desktop',
    label:               'Rancher Desktop',
    removable:           false,
    showClusterSwitcher: false,
    category:            'global',
    to:                  { name: 'General' },
  });
}
