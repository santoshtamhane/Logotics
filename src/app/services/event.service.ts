import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  usid: string;
  userName: string;
  eventlistquery: string;
public db: firebase.firestore.Firestore;
  constructor(private afAuth: AngularFireAuth, private fireStore: AngularFirestore
              ) {
    this.db = firebase.firestore();
    this.afAuth.authState.subscribe(user => {
      console.log('user=', user);
      if (user) {
        this.usid = user.uid;
        this.setuserDetails(user.uid);
        this.eventlistquery = `userProfile/${user.uid}/Event`;

      }
    });
  }
  /*getEventList(): AngularFirestoreCollection<any> {
    return this.fireStore.collection<any>(
        `Event/`,
         ref => ref
         .orderBy('Date', 'desc')
        );
}*/
getEventList(userid: string): AngularFirestoreCollection<any> {
    return this.fireStore.collection<any>(
   `userProfile/${userid}/Event`,
       ref => ref
       .orderBy('Date', 'desc')
      );
}

setuserDetails(uid: string) {
  firebase.firestore().doc(`userProfile/${uid}`)
  .get().then(userdoc => {
    this.userName = userdoc.data().fullame ;
           });

}
} // EOF
