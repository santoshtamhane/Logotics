import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  usid: string;
  userName: string;
  brandlistquery: string;
public db: firebase.firestore.Firestore;
  constructor(private afAuth: AngularFireAuth, private fireStore: AngularFirestore
              ) {
    this.db = firebase.firestore();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.usid = user.uid;
        this.setuserDetails(user.uid);
        this.brandlistquery = `userProfile/${user.uid}/Brand`;

      }
    });
  }

getBrandList(userid: string): AngularFirestoreCollection<any> {
    return this.fireStore.collection<any>(
   `userProfile/${userid}/Brand`,
       ref => ref
       .orderBy('Name')
      );
}

getBrandInfo(brandid: string): AngularFirestoreCollection<any> {
  return this.fireStore.collection<any>(
    'Brands',
    ref => ref.where('Name', '==', brandid)
  );
}

setuserDetails(uid: string) {
  firebase.firestore().doc(`userProfile/${uid}`)
  .get().then(userdoc => {
    this.userName = userdoc.data().fullame ;
           });

}
} // EOF
