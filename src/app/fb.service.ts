import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/fromPromise';

import {GraphApiError} from './graph-api-error';
import {GraphApiResponse, GraphApiResponseType} from './graph-api-response';
import {Page, PageType} from './page';
import {Post, PostType} from './post';

/*
 * The Service providing the Facebook API.
 */

/*
 * The HttpMethods used by Facebook.
 */
export enum HttpMethod {
    Get,
    Post,
    Delete
}

declare var FB: {
    init: (params: any) => void;
    api: (
        path: string,
        method: string,
        params: any,
        callback: (response: any) => void) => void;
    ui: (params: any, callback: (response: any) => void) => void;
};

let cache = {};

/*
 * API-wrapper.
 *
 * This function wraps FB.api() to make it typesafe.  It also returns a Promise, 
 * instead of accepting a callback.
 */
function api(path: string, method: HttpMethod, params: any): Promise<any> {
    // ID for cacheing.
    const id = btoa(path + ':' + method + ':' + JSON.stringify(params));

    return cache[id] || (cache[id] = new Promise((resolve, reject) =>
        FB.api(
            path,
            HttpMethod[method],
            params,
            (res) =>
                res.error
                    ? reject(new GraphApiError(res.error))
                    : resolve(res))));
}

@Injectable()
export class FbService {

    /*
     * Low-level API access.
     *
     * This function makes the API more useable, by normalizing the result to 
     * GraphApiResponseType and turning it into a much more workable 
     * Observable<GraphApiResponse<any>>.
     */
    api(
        path: string,
        method = HttpMethod.Get,
        params = {}
    ): Observable<GraphApiResponse<any>> {
        return Observable
            .fromPromise(api(path, method, params))
            .do(console.log)
            .map((res: {data?: any}): GraphApiResponseType<any> =>
                (res.data ? res : {data: [res]}) as GraphApiResponseType<any>)
            .map(res =>
                new GraphApiResponse(
                    res,
                    () =>
                        res.paging && res.paging.next
                            ? this.api(
                                path,
                                method,
                                {
                                    ...params,
                                    after: res.paging.cursors.after
                                })
                            : Observable.empty()));
    }

    /*
     * High-level API access.
     *
     * This will completely abstract away pagination and return an Observable, 
     * that will observe all results at the cost of being unable to fetch the 
     * whole set only when it turns out to be necessary.
     */
    call(path: string, method = HttpMethod.Get, params = {}) {
        return this.api(path, method, params).concatMap(res => res.expanded);
    }
}

