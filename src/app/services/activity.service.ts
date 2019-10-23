import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Activity } from '../models/activity.model';
import { Submit } from '../models/submit.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activityCollection: AngularFirestoreCollection<Activity>;
  private submitsCollection: AngularFirestoreCollection<Submit>;
  private performanceCollection: AngularFirestoreCollection<any>;

  private activity: Observable<Activity[]>;

  constructor(private db: AngularFirestore) {
    this.activityCollection = db.collection<Activity>('activity');
    this.submitsCollection = db.collection<Submit>('submits');
    this.performanceCollection = db.collection<Submit>('performance');
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

  getActivityByClass(classId) {
    return this.db
      .collection<Activity>('activity', ref =>
        ref.where('class.id', '==', classId).orderBy('date.modified', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getActivityByStatus(classId, status) {
    return this.db
      .collection<Activity>('activity', ref =>
        ref
          .where('class.id', '==', classId)
          .where('status', '==', status)
          .orderBy('date.modified', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getActivityByType(classId, type) {
    return this.db
      .collection<Activity>('activity', ref =>
        ref
          .where('class.id', '==', classId)
          .where('type', '==', type)
          .where('status', '==', 1)
          .orderBy('date.modified', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getActivityByTerm(classId, term) {
    return this.db
      .collection<Activity>('activity', ref =>
        ref
          .where('class.id', '==', classId)
          .where('term', '==', term)
          .where('status', '==', 1)
          .orderBy('date.modified', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  updateActivity(activity: Activity) {
    return this.activityCollection.doc(activity.id).update(activity);
  }

  addActivity(activity: Activity) {
    return this.activityCollection.add(activity);
  }

  removeActivity(id) {
    return this.activityCollection.doc(id).delete();
  }

  // Activity Submits

  getSubmit(studId, activityId) {
    return this.db
      .collection<Submit>('submits', ref =>
        ref
          .where('student.id', '==', studId)
          .where('activity.id', '==', activityId)
          .limit(1)
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getSubmits(studId, classId) {
    return this.db
      .collection<Submit>('submits', ref =>
        ref
          .where('student.id', '==', studId)
          .where('activity.class.id', '==', classId)
          .where('status', '==', 2)
          .orderBy('date.submitted', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getSubmitsByType(studId, classId, type, term) {
    return this.db
      .collection<Submit>('submits', ref =>
        ref
          .where('student.id', '==', studId)
          .where('activity.class.id', '==', classId)
          .where('activity.type', '==', type)
          .where('activity.term', '==', term)
          .where('status', '==', 2)
          .orderBy('date.submitted', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getSubmitByActivity(activityId) {
    return this.db
      .collection<Submit>('submits', ref =>
        ref
          .where('activity.id', '==', activityId)
          .where('status', '==', 2)
          .orderBy('date.submitted', 'asc')
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  addSubmit(submit: Submit) {
    return this.submitsCollection.add(submit);
  }

  updateSubmit(submit: Submit) {
    return this.submitsCollection.doc(submit.id).update(submit);
  }

  // Performance Grade

  getPerformanceByStudent(classId, studId, term) {
    return this.db
      .collection('performance', ref =>
        ref
          .where('class_id', '==', classId)
          .where('student_id', '==', studId)
          .where('term', '==', term)
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  addPerformance(grade) {
    return this.performanceCollection.add(grade);
  }

  updatePerformance(grade) {
    return this.performanceCollection.doc(grade.id).update(grade);
  }
}
