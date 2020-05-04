import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';


// import * as startOfMonth from 'date-fns/start_of_month';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';


@Injectable({
  providedIn: 'root'
})
export class DashboardAllService {
  usid: string;
  userName: string;
  brandlistquery: string;
public db: firebase.firestore.Firestore;
  constructor(private afAuth: AngularFireAuth, private fireStore: AngularFirestore) {
    this.db = firebase.firestore();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.usid = user.uid;
        this.setuserDetails(user.uid);
        this.brandlistquery = `userProfile/${this.usid}`;
      }
    });
  }
/* getBrandList(eventid: string): AngularFirestoreCollection<any> {
    return this.fireStore.collection<any>(
        `Event/${eventid}/Brands`
        );
}*/
getBrandList(eventid: string, userid: string): AngularFirestoreCollection<any> {
  return this.fireStore.collection<any>(
    `userProfile/${userid}/Event/${eventid}/Brand`
      );
}
getBrandListArray(eventid: string, userid: string): string[] {
  const arr1 = [];
  this.fireStore.collection<any>(
    `userProfile/${userid}/Event/${eventid}/Brand`
      ).valueChanges().subscribe(data => {
        data.map(a =>
          arr1.push({
            EEI: a.EEI,
            Quality: a.Q,
            Prominence: a.P,
            Share: a.Share,
            Durn: a.Durn,
            Name: a.Name
          })
        );
});
  return arr1;
}
getVenuesList(eventid: string): AngularFirestoreCollection<any> {
  const brandarray = this.getBrandListArray(eventid, this.usid);
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Venues`,
    ref => ref.where('Name',  'in', brandarray)
     );
}

getAdUnitsList(eventid: string): AngularFirestoreCollection<any> {
  const brandarray = this.getBrandListArray(eventid, this.usid);
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Assets`,
    ref => ref.where('Name',  'in', brandarray)
    );
}

getAssetsbyBrand(eventid: string , brandid: string, asset: string): AngularFirestoreCollection<any> {
  const brandarray = this.getBrandListArray(eventid, this.usid);
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Assets`,
    ref => ref.where('Name',  'in', brandarray)
    .where('Category', '==', asset)
     );
}

getAllBrandsbyEvent(eventid: string , brandid: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Dates`,
     ref => ref.where('Name', '==', brandid)
     );
}

getBrandInfo(eventid: string , brand: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));
  // console.log('brandinfoquery=', `/Event/${eventid}/Brands ref => ref.where('Name', '==', ${brand}) ` );
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Brands`,
     ref => ref.where('Name', '==', brand )
     );
}

getVenueInfo(eventid: string , brand: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Venues`,
     ref => ref.where('Name', '==', brand )
     );
}

getBrandVenueInfo(eventid: string , brand: string, venueid: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));
  const brandarray = this.getBrandListArray(eventid, this.usid);
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Venues/`,
     ref => ref.where('Name', 'in', brandarray )
     .where('venue', '==', venueid)
     );
}
getBrandAssetInfo(eventid: string , brand: string, venue: string): AngularFirestoreCollection<any> {
  return this.fireStore.collection<any>(
    `/Event/${eventid}/AssetVenue/`,
     ref => ref.where('Name', '==', brand )
     .where('venue', '==', venue)
     );
}
getAssetVenue(eventid: string , brand: string, venue: string, Category: string): AngularFirestoreCollection<any> {
  return this.fireStore.collection<any>(
    `/Event/${eventid}/AssetVenue/`,
     ref => ref.where('Name', '==', brand )
     .where('venue', '==', venue)
     .where('Category', '==', Category)
     );
}

getDateInfo(eventid: string , brand: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));

  return this.fireStore.collection<any>(
    `/Event/${eventid}/Dates`,
    ref => ref.where('Name', '==', brand )
     );
}

getAssetInfo(eventid: string , brand: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Assets`,
     ref => ref.where('Name', '==', brand )
     );
}
getAssetVenueInfo(eventid: string , brand: string, venue: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));
  return this.fireStore.collection<any>(
    `/Event/${eventid}/AssetVenue`,
     ref => ref.where('Name', '==', brand )
     .where('venue', '==', venue )
     );
}

getVenuesbyAsset(eventid: string , brand: string, asset: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));
  return this.fireStore.collection<any>(
    `/Event/${eventid}/AssetVenue`,
     ref => ref.where('Name', '==', brand )
     .where('Category', '==', asset )
     );
}

getMatchbyDates(eventid: string , brand: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Dates`,
     ref => ref.where('Name', '==', brand )
     .orderBy('Dt', 'desc')
     );
}
getLast7MatchbyDates(eventid: string , brand: string, eventDt): AngularFirestoreCollection<any> {
  const mthstart = startOfMonth(new Date(eventDt));
  const mthend = endOfMonth(new Date(eventDt));
  return this.fireStore.collection<any>(
    `/Event/${eventid}/Dates`,
     ref => ref.where('Name', '==', brand )
     .orderBy('Dt', 'desc').limit(7)
     );
}
setuserDetails(uid: string) {
  firebase.firestore().doc(`userProfile/${uid}`)
  .get().then(userdoc => {
    this.userName = userdoc.data().fullName ;
           });
}
} // EOF
