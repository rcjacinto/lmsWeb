import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Class } from '../models/class.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from '../store';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  userData$ = this.store.pipe(select(selectUser));
  private classCollection: AngularFirestoreCollection<Class>;

  private classes: Observable<Class[]>;

  constructor(public db: AngularFirestore, public store: Store<RootState>) {
    this.classCollection = db.collection<Class>('class');

    this.classes = this.classCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAllclasses(user_id) {
    return this.db
      .collection<Class>('class', ref =>
        ref
          .where('instructor.id', '==', user_id)
          .orderBy('date.created', 'desc')
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

  getClass(id) {
    return this.classCollection.doc<Class>(id).valueChanges();
  }

  getClassByCode(code: string) {
    return this.db
      .collection<Class>('class', ref =>
        ref
          .where('code', '==', code)
          .orderBy('date.created', 'desc')
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

  getClassByStudentId(id) {
    return this.db
      .collection<Class>('class', ref =>
        ref
          .where('members', 'array-contains', id)
          .orderBy('date.created', 'desc')
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

  updateClass(classes: Class) {
    return this.classCollection.doc(classes.id).update(classes);
  }

  addClass(classes: Class) {
    return this.classCollection.add(classes);
  }

  removeClass(id) {
    return this.classCollection.doc(id).delete();
  }
}
