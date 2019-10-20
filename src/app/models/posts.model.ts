import { Class } from './class.model';
import { Instructor } from './instructor.model';
import { Activity } from './activity.model';
import { Submit } from './submit.model';

export enum PostType {
  Post = 0,
  Anouncement = 1,
  Assignment = 2,
  Activity = 3,
  Submit = 4
}
export interface Post {
  id: string;
  posted_by: any;
  posted_to: Class;
  attachments: string[];
  message: string;
  type: number;
  date: {
    created: Date;
    modified: Date;
  };
  activity?: Activity;
  submit?: Submit;
}
