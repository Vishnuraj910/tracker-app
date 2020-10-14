import { PinDialog } from '@ionic-native/pin-dialog/ngx';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login-page',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  loginObj = {
    username: '16536',
    password: '16536',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    public loadingController: LoadingController,
    private nativeStorage: NativeStorage,
    private alertController: AlertController
  ) {}

  async login() {
    console.log(this.loginObj.username);
    const self = this;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Logging In',
      duration: 20000,
    });
    await loading.present();

    this.authService.login(this.loginObj).then(
      async (userData) => {
        loading.dismiss();
        const alertDialog = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Enter OTP',
          message: 'Use the OTP received on your registered email',
          inputs: [
            {
              name: 'otp',
              type: 'number',
              placeholder: '******',
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              },
            },
            {
              text: 'OK',
              handler: (object) => {
                console.log(object);
                if (object.otp === userData.DeviceOTP) {
                  self.nativeStorage.setItem('userData', userData).then(
                    () => console.log('Stored item!'),
                    (error) => console.error('Error storing item', error)
                  );
                  self.router.navigate(['/home']);
                } else {
                  alert('Unable to verify OTP');
                  return false;
                }
              },
            },
          ],
        });

        await alertDialog.present();
      },
      async () => {
        await loading.dismiss();
        alert('Please check your credentials');
      }
    );
  }
}
