import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/expand';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/concatMap';

import {GraphApiError} from './graph-api-error';

/*
 * The Service providing the Facebook API.
 */

interface GraphApiResponse {
    data?: any[];
    paging?: {
        cursors: {
            before: string,
            after: string
        },
        next?: string,
        previous?: string
    };
}

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

@Injectable()
export class FbService {

    private cache: {[id: string]: Promise<GraphApiResponse>;} = {};

    /*
     * Low-level API access.
     *
     * This function wraps FB.api() to make it typesafe.  It also returns 
     * a Promise, instead of accepting a callback.  The promise will return the 
     * result in the same way the callback would, in the case of an error, the 
     * Promise will be rejected with a GraphApiError.
     */
    api(
        path: string,
        method = HttpMethod.Get,
        params = {}
    ): Promise<GraphApiResponse> {

        // ID for cacheing.
        const id = btoa(path + ':' + method + ':' + JSON.stringify(params));

        /*
        if (this.cache[id]) {
            this.cache[id].then((graphApiResponse) =>
                console.log('Cache: ' + JSON.stringify(graphApiResponse)));
        }
        */

        return this.cache[id]
            || (this.cache[id] = new Promise((resolve, reject) =>
                FB.api(path, HttpMethod[method], params, (res) => {
                    console.log('GraphAPI: ' + JSON.stringify(res));
                    if (res.error) { reject(new GraphApiError(res.error)); }
                    resolve(res);
                })));
    }

    /*
     * High-level API access.
     *
     * This provides all the niceities of Observers.  Most notably it will 
     * abstract away pagination and instead observe the individual data entries.  
     * Non-paginated data will be passed as-is.
     */
    call(path: string, method = HttpMethod.Get, params = {}) {
        return Observable
            .fromPromise(this.api(path, method, params))
            .expand(res =>
                res.paging && res.paging.next
                    ? Observable.fromPromise(
                        this.api(
                            path,
                            method,
                            {...params, after: res.paging.cursors.after}))
                    : Observable.empty())
            .concatMap(res => res.data || [res])
    }
}

