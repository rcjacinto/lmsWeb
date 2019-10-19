import { Injectable } from '@angular/core';
import { Parent } from '../models/parent.model';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private parentsCollection: AngularFirestoreCollection<Parent>;

  constructor(private db: AngularFirestore) {
    this.parentsCollection = this.db.collection<Parent>('parents');
  }

  getAllParents() {
    return this.parentsCollection;
  }

  getParentsByStudent(id) {
    return this.db
      .collection<Parent>('parents', ref => ref.where('student.id', '==', id))
      .valueChanges();
  }

  getParent(id) {
    return this.parentsCollection.doc<Parent>(id).valueChanges();
  }

  updateParent(parent: Parent) {
    return this.parentsCollection.doc(parent.id).update(parent);
  }

  addParent(parent: Parent) {
    return this.parentsCollection.add(parent);
  }

  removeParent(id) {
    return this.parentsCollection.doc(id).delete();
  }
}
