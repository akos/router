const path = require('path');
const Router = require('koa-router');
const debug = require('debug')('akos-router');

const routeRE = /^(?:(get|put|post|delete|patch)\s+)?(.*?)\s*=>\s+([a-z][\w.-]*)?#([a-z][\w.-]*)$/i;

const parseStringRoute = (route) => {
    const cap = routeRE.exec(route);
    if (cap) {
        return {
            method: cap[1] && cap[1].toLowerCase(),
            path: cap[2],
            controller: cap[3],
            action: cap[4],
        };
    } else
        throw Error(`Invalid route format: '${route}'`);
};

const rootRoute = {
    method: 'get',
    path: '',
    directory: '',
};

function flattenRoutes(routes) {
    const flatRoutes = [];

    function _flattenRoutes(parent, routes) {
        routes.forEach((route) => {
            if (typeof route === 'string')
                route = parseStringRoute(route);

            const flatRoute = {
                method: route.method || parent.method,
                path: path.join(parent.path, route.path || '').replace(/\\/g, '/'),
                directory: path.join(parent.directory, route.directory || '').replace(/\\/g, '/'),
                controller: route.controller || parent.controller,
                action: route.action,
            };

            debug(`Parsed route ${JSON.stringify(flatRoute)}`);

            flatRoutes.push(flatRoute);
            route.children && _flattenRoutes(flatRoute, route.children);
        });
    }

    _flattenRoutes(rootRoute, routes);

    return flatRoutes;
}

class AkosRouter {
    constructor(routes, options) {
        this.router = new Router();
        this.options = Object.assign({
            controllersPath: options.controllersPath,
            prefix: '',
            allowedMethods: undefined,
        }, options);

        this.options.prefix && this.router.prefix(this.options.prefix);
        this.options.allowedMethods && this.router.allowedMethods(this.options.allowedMethods);

        this.routes = [];
        this.add(routes);
    }

    add(routes) {
        const flatRoutes = flattenRoutes(routes);

        flatRoutes.forEach((route) => {
            this.routes.push(route);

            let action = route.action;
            if (route.controller) {
                const controllerPath = path.join(route.directory, route.controller);

                let controller;
                try {
                    controller = require(path.join(this.options.controllersPath, controllerPath));
                } catch (error) {
                    console.error(`Load controller ${controllerPath} error! Please check route config.`);
                    throw error;
                }

                if (controller[route.action]) {
                    action = controller[route.action];
                    console.info(`Mapped: ${route.method} ${route.path} to ${controllerPath}.${route.action}`);
                } // else
                // console.warn(`Cannot find action ${route.action} in controller ${controllerPath}. Route '${JSON.stringify(route)}' is ignored.`);
            }

            if (action) {
                if (typeof action === 'function') {
                    if (route.name)
                        this.router[route.method](route.name, route.path, action);
                    else
                        this.router[route.method](route.path, action);
                } else
                    console.warn(`Action ${action} is not a function. Route '${JSON.stringify(route)}' is ignored.`);
            }

            if (route.redirect)
                this.router.redirect(route.path, route.redirect, route.code);

            if (route.use) {
                const middlewares = Array.isArray(route.use) ? route.use : [route.use];
                middlewares.forEach((mw) => this.router.use(route.path, mw));
            }
        });
    }

    middleware() { return this.router.middleware(); }

    route(name) { return this.router.route(name); }

    url(name, params, options) { return this.router.url(name, params, options); }

    param(param, middleware) { return this.router.param(param, middleware); }

    static url(path, params) { return Router.url(path, params); }
}

AkosRouter.flattenRoutes = flattenRoutes;
AkosRouter.parseStringRoute = parseStringRoute;

module.exports = AkosRouter;
