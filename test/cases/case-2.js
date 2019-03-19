module.exports = [
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
