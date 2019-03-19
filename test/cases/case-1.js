module.exports = [
    { path: '/', controller: 'home', action: 'index' },
    { path: '/api', directory: 'api', children: [
        { path: 'vpc', controller: 'vpc', children: [
            { path: '', action: 'getList' },
            { path: ':id', method: 'get', action: 'getOne' },
            { path: ':id', method: 'post', action: 'addOne' },
            { path: ':id', method: 'put', action: 'updateOne' },
            { path: 'snapshot', action: 'getSnapshot' },
        ] },
    ] },
];
