import { Injectable } from '@angular/core';

import { Evaluation } from '../models/evaluation.model';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private evalCollection: AngularFirestoreCollection<Evaluation>;
  constructor(public db: AngularFirestore) {
    this.evalCollection = db.collection<Evaluation>('evaluation');
  }
  getEval() {
    return this.evalCollection.valueChanges();
  }
  addQuestion(evaluation: Evaluation) {
    return this.evalCollection.add(evaluation);
  }
  updateEval(evaluation: Evaluation) {
    return this.evalCollection.doc(evaluation.id).update(evaluation);
  }
}
