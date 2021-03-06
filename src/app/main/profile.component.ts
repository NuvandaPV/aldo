import {Component, Input} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {Profile} from '../profile';
import {Page} from '../page';
import {GraphApiResponse} from '../graph-api-response';
import {Post} from '../post';
import {AppUxService} from '../app-ux.service';
import {User} from '../user';
import {Group} from '../group';
import {Event} from '../event';

/*
 * The Component showing a single Profile in detail.
 */

@Component({
    selector: 'profile',
    templateUrl: './_profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
    constructor(protected appUxService: AppUxService) {}

    protected _profile?: Profile;

    /*
     * Feed of this Profile, if any.
     */
    feed?: Observable<GraphApiResponse<Post>>;

    /*
     * The Profile currently shown.
     */
    @Input()
    set profile(profile: Profile|undefined) {
        if (profile) {
            this._profile = profile;
            this.feed = profile.feed;
        }
    }
    get profile() {
        return this._profile;
    }

    get isPage() {
        return this.profile instanceof Page;
    }

    get isUser() {
        return this.profile instanceof User;
    }

    get isGroup() {
        return this.profile instanceof Group;
    }

    get isEvent() {
        return this.profile instanceof Event;
    }
}

