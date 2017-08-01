import {Component, OnInit, Input} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/mergeScan';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/observable/concat';

import {Expandable} from './expandable';

/*
 * The Component showing the list of pages.
 */

@Component({
    selector: 'endless-list',
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ['dist/endless-list.component.css']
})
export class EndlessListComponent<InType extends Expandable<OutType>, OutType>
        implements OnInit {

    @Input()
    input: Observable<InType>;

    /*
     * Controller for the output.
     */
    private controller: Subject<null>;

    /*
     * Content for the endless list.
     */
    output: Observable<OutType>;

    ngOnInit() {
        this.controller = new Subject<null>();
        this.output = Observable
            .concat(
                this.input,
                this.controller
                    .mergeScan(acc =>
                        acc.map((page) => page.next()), this.input, 1)
                    .concatAll())
            .do(() => this.load())
            .concatMap(resultSet => resultSet.data);
    }

    /*
     * Fetch more content if necessary.
     */
    load() {
        if (true) {
            this.controller.next();
        }
    }
}

