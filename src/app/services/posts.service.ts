import { Injectable } from '@angular/core';
import { Post } from '../models/posts.model';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private postsCollection: AngularFirestoreCollection<Post>;

  constructor(public db: AngularFirestore) {
    this.postsCollection = db.collection<Post>('posts');
  }

  getposts() {
    return this.postsCollection.valueChanges();
  }

  getPostsByClass(classId) {
    return this.db
      .collection<Post>('posts', ref =>
        ref.where('posted_to.id', '==', classId).orderBy('date.created', 'desc')
      )
      .valueChanges();
  }

  getPostsByClassInstructor(classId) {
    return this.db
      .collection<Post>('posts', ref =>
        ref
          .where('posted_to.instructor.id', '==', classId)
          .orderBy('date.created', 'desc')
      )
      .valueChanges();
  }

  getPostsByGroup(id) {
    return this.db
      .collection<Post>('posts', ref =>
        ref.where('group_id', '==', id).orderBy('date.created', 'desc')
      )
      .valueChanges();
  }

  getPost(id) {
    return this.postsCollection.doc<Post>(id).valueChanges();
  }

  updatePost(posts: Post) {
    return this.postsCollection.doc(posts.id).update(posts);
  }

  addPost(posts: Post) {
    return this.postsCollection.add(posts);
  }

  removePost(id) {
    return this.postsCollection.doc(id).delete();
  }
}
