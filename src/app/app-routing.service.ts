import {Injectable} from '@angular/core';
import {Router, NavigationEnd, Params} from '@angular/router';
import {Location} from '@angular/common';

import 'rxjs/add/operator/publishBehavior';

/*
 * The service providing routing for the app.
 *
 * This suits my usecase better than Angular's router.
 */

/*
 * The route parameter names in the order the parameters are encoded in the url.
 */
export const PARAMS = ['page', 'post'];

@Injectable()
export class AppRoutingService {
    constructor(
        private router: Router,
        private location: Location) {}

    events = this.router
        .events
        .filter(event => event instanceof NavigationEnd)
        .map((event: NavigationEnd) => this.parse(event.url))
        .publishBehavior(this.params)
        .refCount();

    /*
     * Parse the parameters from a path.
     */
    parse?(path: string): Params|null {
        return path
            .split('/')
            .slice(1)
            .map((v, i) =>
                PARAMS[i] ? (v ? {[PARAMS[i]]: v} : {}) : null)
            .reduce((o, e) => o && e ? Object.assign(o, e) : null, {});
    }

    /*
     * Get the current route parameters.
     */
    get params(): Params|null {
        return this.parse(this.location.path());
    }

    /*
     * Set any number of parameters.
     *
     * Any parameters not passed will be kept as is, any parameter that is set 
     * to a falsy value will become undefined.
     */
    set params(params: Params|null) {
        this.router.navigateByUrl(
            params
                ? PARAMS
                    .map(k =>
                        (params.hasOwnProperty(k) ? params[k] : this.params[k])
                            || '_')
                    .join('/')
                    .replace(/(_\/)*_$/, '')
                : '/');
    }
}
