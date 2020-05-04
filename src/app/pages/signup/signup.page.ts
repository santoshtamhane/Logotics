import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
@Component({
selector: 'app-signup',
templateUrl: './signup.page.html',
styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
public signupForm: FormGroup;
constructor(
public router: Router,
public loadingCtrl: LoadingController,
public alertCtrl: AlertController,
public formBuilder: FormBuilder,
public authService: AuthService
) {
this.signupForm = formBuilder.group({
email: ['', Validators.required],
password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
fullName: ['', Validators.compose([Validators.minLength(3), Validators.required])]
});
}
ngOnInit() {
}

async userSignup(signupForm: FormGroup): Promise<void> {
if (!signupForm.valid) {
console.log(signupForm.value);
} else {
const loading = await this.loadingCtrl.create();
loading.present();
this.authService
.userSignup(
signupForm.value.email,
signupForm.value.password,
signupForm.value.fullName
) .
then(
() => {
loading.dismiss().then(() => {
this.router.navigateByUrl('/home');
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
