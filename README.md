# akos-router

Akos Router

[![CircleCI][circleci-img]][circleci-url]
[![NPM Version][npm-img]][npm-url]
[![Dependencies][david-img]][david-url]
[![NPM Download][download-img]][download-url]

[circleci-img]: https://img.shields.io/circleci/project/github/akos/router.svg?style=flat-square
[circleci-url]: https://circleci.com/gh/akos/router
[npm-img]: http://img.shields.io/npm/v/akos-router.svg?style=flat-square
[npm-url]: http://npmjs.org/package/akos-router
[david-img]: http://img.shields.io/david/akos/router.svg?style=flat-square
[david-url]: https://david-dm.org/akos/router
[download-img]: https://img.shields.io/npm/dm/akos-router.svg?style=flat-square
[download-url]: https://npmjs.org/package/akos-router

## Example

``` js
const AkosRouter = require('akos-router');

const routes = [
    { path: '/', controller: 'home', action: 'index' },
    { path: '/api', directory: 'api', children: [
        { path: 'vpc', controller: 'vpc', children: [
            { path: '', action: 'getList' },
            { path: ':id', method: 'get', action: 'getOne' },
            { path: ':id', method: 'post', action: 'addOne' },
            { path: ':id', method: 'put', action: 'updateOne' },
            { path: 'snapshot', action: 'getSnapshot' },
            { path: 'volume', action: (ctx, next) => { /* something */ } },
        ] },
        { path: 'account', use: [...middlewares] },
    ] },
    { path: '/login', redirect: '/sign-in' },
];

const router = new AkosRouter(routes);
app.use(router.middleware());
```

``` js
const routes = [
    '/ => home#index',
    { path: '/api', directory: 'api', children: [
        { path: 'vpc', controller: 'vpc', children: [
            '=> getList',
            'get :id => #getOne',
            'post :id => #addOne',
            'put :id => #updateOne',
            'snapshot => getSnapshot',
        ] },
    ] },
];
```

## Changelog

See [Releases](https://github.com/akos/router/releases)

## Contributing

See [Contributing Guide](https://github.com/vusion/DOCUMENTATION/issues/8)

## License

[MIT](LICENSE)
