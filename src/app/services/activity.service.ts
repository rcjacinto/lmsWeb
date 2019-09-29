import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Activity } from '../models/activity.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activityCollection: AngularFirestoreCollection<Activity>;

  private activity: Observable<Activity[]>;

  constructor(db: AngularFirestore) {
    this.activityCollection = db.collection<Activity>('activity');

    this.activity = this.activityCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getactivity() {
    return this.activity;
  }

  getActivity(id) {
    return this.activityCollection.doc<Activity>(id).valueChanges();
  }

  updateActivity(activity: Activity, id: string) {
    return this.activityCollection.doc(id).update(activity);
  }

  addActivity(activity: Activity) {
    return this.activityCollection.add(activity);
  }

  removeActivity(id) {
    return this.activityCollection.doc(id).delete();
  }
}
