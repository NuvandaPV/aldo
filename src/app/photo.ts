import {Story, StoryType, DUMMY_STORY_TYPE} from './story';

/*
 * Classes related to Facebook photos.
 */

/*
 * A Facebook photo as returned by the Facebook API.
 */
export interface PhotoType extends StoryType {
    name: string;
    images: {
        height: number;
        source: string;
        width: number;
    }[];
}

/*
 * A Facebook photo as used internally.
 */
export class Photo extends Story {}
export interface Photo extends PhotoType {}

/*
 * The simplest valid Photo.
 *
 * This exists, so the PhotoService can use it to check which fields to request 
 * from Facebook, thus allowing adding a field to Photo without changing 
 * PhotoService.
 */
export const DUMMY_PHOTO_TYPE: PhotoType = {
    ...DUMMY_STORY_TYPE,
    name: '',
    images: [{
        height: 0,
        source: '',
        widh: 0
    }]
};

