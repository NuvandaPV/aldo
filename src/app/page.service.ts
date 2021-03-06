import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/pluck';

import {Page, DUMMY_PAGE_TYPE} from './page';
import {FbService, HttpMethod} from './fb.service';
import {GraphApiError} from './graph-api-error';
import {Ressource} from './app';
import {buildFields} from './util';

/*
 * The Service providing the Pages.
 */

@Injectable()
export class PageService {
    constructor(protected fbService: FbService) {}

    /*
     * Perform a GET-request for a Page on a given path.
     */
    get(path: string): Observable<Page> {
        return this.fbService.fetch(
            path,
            HttpMethod.Get,
            {fields: buildFields(DUMMY_PAGE_TYPE)},
            Page) as Observable<Page>;
    }

    /*
     * Get all Pages of the user.
     */
    pages() {
        return this.get('me/accounts');
    }

    /*
     * Get a Page by its ID.
     */
    page(id: string) {
        return this.get(id);
    }
}

