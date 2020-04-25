import { Injectable } from '@angular/core';

import { Evaluated } from '../models/evaluated.model';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EvaluatedService {
  private evalCollection: AngularFirestoreCollection<Evaluated>;
  constructor(public db: AngularFirestore) {
    this.evalCollection = db.collection<Evaluated>('evaluated');
   }
   getEval() {
    return this.evalCollection.valueChanges();
  }
  addEval(evaluation: Evaluated) {
    return this.evalCollection.add(evaluation);
  }
  updateEval(evaluation: Evaluated) {
    return this.evalCollection.doc(evaluation.id).update(evaluation);
  }
  getEvalByInstructor(instructorId:any){
    return this.db.collection<Evaluated>('evaluated', ref=>
    ref
    .where('instructor_id', '==', instructorId)
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )
  }
  getEvalByInfo(studentId: any,classId:any) {
    return this.db
      .collection<Evaluated>('evaluated', ref =>
        ref
          .where('student_id', '==', studentId)
          .where('class_id', '==', classId)
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
}
