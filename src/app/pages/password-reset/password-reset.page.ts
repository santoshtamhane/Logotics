import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
@Component({
selector: 'app-password-reset',
templateUrl: './password-reset.page.html',
styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {
public passwordResetForm: FormGroup;
constructor(
public router: Router,
public alertCtrl: AlertController,
public formBuilder: FormBuilder,
public authService: AuthService
) {
this.passwordResetForm = formBuilder.group({
email: ['', Validators.required],
});
}
ngOnInit() {}


async passwordReset(passwordResetForm: FormGroup): Promise<any> {
if (!passwordResetForm.valid) {
console.log(passwordResetForm.value);
} else {
this.authService.passwordReset(passwordResetForm.value.email).then(
async () => {
const alert = await this.alertCtrl.create({
message: 'We just sent you a reset link to your email',
buttons: [
{
text: 'Ok',
role: 'cancel',
handler: () => {
this.router.navigateByUrl('/login');
},
},
],
});
alert.present();
},
async error => {
const alert = await this.alertCtrl.create({
message: error.message,
buttons: [{ text: 'Ok', role: 'cancel' }],
});
alert.present();
}
);
}
}

} // EOF
