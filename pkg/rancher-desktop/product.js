export const NAME = 'rancher-desktop';

export function init(plugin, store) {
  const { product } = plugin.DSL(store, NAME);

  store.dispatch(
    'setIsSingleProduct',
    {
      afterLoginRoute: {
        name:   'General',
        params: { product: 'rancher-desktop' },
      },
      logoRoute: {
        name:   'General',
        params: { product: 'rancher-desktop' },
      },
      logo:                require(`./assets/images/logo.svg`),
      productNameKey:      'app.name',
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
    to:                  {
      name:   'General',
      params: { product: 'rancher-desktop' },
    },
  });
}
