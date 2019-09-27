import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;

  private users: Observable<User[]>;

  constructor(db: AngularFirestore) {
    this.usersCollection = db.collection<User>('users');

    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getusers() {
    return this.users;
  }

  getUser(id) {
    return this.usersCollection.doc<User>(id).valueChanges();
  }

  updateUser(user: User, id: string) {
    return this.usersCollection.doc(id).update(user);
  }

  addUser(user: User) {
    return this.usersCollection.add(user);
  }

  removeUser(id) {
    return this.usersCollection.doc(id).delete();
  }
}
