import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {User, DUMMY_USER_TYPE} from './user';
import {FbService, HttpMethod} from './fb.service';
import {buildFields} from './util';

/*
 * The Service providing the Users.
 */

@Injectable()
export class UserService {
    constructor(protected fbService: FbService) {}

    /*
     * Get a User by his ID.
     */
    user(id: string) {
        return this.fbService.fetch(
            id,
            HttpMethod.Get,
            {fields: buildFields(DUMMY_USER_TYPE)},
            User) as Observable<User>;
    }
}

