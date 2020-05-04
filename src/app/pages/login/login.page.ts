import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController , MenuController, NavController} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  constructor(private loadingCtrl: LoadingController,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
      // listen to the service worker promise in index.html to see if there has been a new update.
// condition: the service-worker.js needs to have some kind of change - e.g. increment CACHE_VERSION.
/* window['isUpdateAvailable']
.then(async (isAvailable) => {
  if (isAvailable) {
    const toast = await this.toastCtrl.create({
      message: 'New Update available! Please reload the app from the browser url to see the latest changes.',
      position: 'bottom',
      showCloseButton: true,
    });
await toast.present();
  }

}

);*/
this.loginForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email]), ] ,
        password: ['', Validators.compose([Validators.minLength(6),
        Validators.required])],
        });

     }

  ngOnInit() {
  }
   ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  async userLogin(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
    console.log(loginForm.value);
    } else {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'crescent',
      duration: 2000
    });
    loading.present();
    this.authService.userLogin(loginForm.value.email,
    loginForm.value.password).then(
    authService => {
    loading.dismiss().then(() => {
    const userid = this.authService.userId;
    this.navCtrl.navigateRoot(['/home', {userid}]);
    });
    },
    error => {
    loading.dismiss().then(async () => {
    const alert = await this.alertCtrl.create({
    message: error.message,
    buttons: [{ text: 'Ok', role: 'cancel' }],
    });
    alert.present();
    });
    }
    );
}
  }
} // EOF
