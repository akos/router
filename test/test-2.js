const Router = require('../index');
const routes = require('./cases/case-1');

console.log(Router.parseRoute('get /test:id => ctrller#action'));
console.log(Router.parseRoute('/test:id => ctrller#action'));
console.log(Router.parseRoute('=> ctrller#action'));
console.log(Router.parseRoute('=> #action'));

