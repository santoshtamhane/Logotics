import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
// import { Plugins } from '@capacitor/core';
import { AuthService} from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
// const { SplashScreen, StatusBar } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  userId: string;
  loggedIn = false;
  usrName: string;
  pages = [];
  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private router: Router,
    private authProvider: AuthService,
    private afAuth: AngularFireAuth
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      /* SplashScreen.hide().catch(error => {
        console.error(error);
        });
      StatusBar.hide().catch(error => {
        console.error(error);
        }); */
    });
  }
  ngOnInit() {

    this.checkLoginStatus();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.setuserDetails(user.uid);
        this.pages = [
      {
        title: 'By Event',
        url: `/home`,
        icon: 'home'
      },
      {
        title: 'By Brand',
        url: '/brand-list',
        icon: 'basketball'
      }
    ];
      }
    });
  }
      setuserDetails(uid: string) {
          firebase.firestore().doc(`userProfile/${uid}`)
          .get().then(userdoc => {
            this.usrName = userdoc.data().fullname ;
          });
        }
        checkLoginStatus() {
            return this.updateLoggedInStatus(this.authProvider.isLoggedIn());
        }
        updateLoggedInStatus(loggedIn: boolean) {
          setTimeout(() => {
            this.loggedIn = loggedIn;
          }, 300);
        }

        logout() {
          this.authProvider.userLogout().then(() => {
            return this.router.navigateByUrl('/login');
          });
        }
        gotoPage(url: string) {
          switch (url) {
            case '/home' : {
              const userid = this.authProvider.userId;
              this.navCtrl.navigateRoot([url, {userid}]);
              break;
            }
            case '/brand-list' : {
              const userid = this.authProvider.userId;
              this.navCtrl.navigateRoot([url, {userid}]);
              break;
            }
            default : {
              this.navCtrl.navigateRoot([url]);
              break;
            }
          }
        }
      } // EOF

