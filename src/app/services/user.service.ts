import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Student } from '../models/student.model';
import { Parent } from '../models/parent.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<User>;

  private users: Observable<User[]>;

  constructor(private db: AngularFirestore) {
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

  updateUser(user: User) {
    return this.usersCollection.doc(user.id).update(user);
  }

  addUser(user: User) {
    return this.usersCollection.doc(user.id).set(user);
  }

  removeUser(id) {
    return this.usersCollection.doc(id).delete();
  }

  // For students

  addStudent(student: Student) {
    return this.usersCollection.doc(student.id).set(student);
  }

  getAllStudents() {
    return this.db.collection<Student>('users');
  }

  // For Parent

  addParent(parent: Parent) {
    return this.usersCollection.doc(parent.id).set(parent);
  }

  // For instructors

  getAllInstructors() {
    return this.db
      .collection<Student>('users', ref =>
        ref.where('role', '==', 'instructor')
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

  getInstructorByStatus(status) {
    return this.db
      .collection<Student>('users', ref =>
        ref.where('role', '==', 'instructor').where('status', '>', status)
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

  getApprovedInstructor() {
    return this.db
      .collection<Student>('users', ref =>
        ref.where('role', '==', 'instructor').where('status', '>', 0)
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

  getUnapprovedInstructor() {
    return this.db
      .collection<Student>('users', ref =>
        ref.where('role', '==', 'instructor').where('status', '==', 0)
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
