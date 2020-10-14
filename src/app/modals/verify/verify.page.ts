import { Component, OnInit, Input } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})

export class VerifyPage implements OnInit {

  @Input() project: any;

  verifyItems = {
    location: {
      status: 0,
      data: null
    },
    selfie: {
      status: 0,
      data: null
    },
    finger: {
      status: 0,
      data: null
    },
    remarks: null
  };


  constructor(private geolocation: Geolocation,
              private modalCtrl: ModalController,
              private faio: FingerprintAIO,
              private toastCtr: ToastController,
              public platform: Platform) { }

  ngOnInit() {

    this.getLocation();
    console.log(this.project);
    console.log(this.platform.platforms());

  }
  getLocation() {
    // if (this.verifyItems.location.status != 1){
    this.geolocation.getCurrentPosition({maximumAge: 0, timeout: 5000, enableHighAccuracy: true}).then((resp) => {
      console.log(resp);
      this.verifyItems.location.status = 1;
      this.verifyItems.location.data = resp;
      this.fingerPrintAuth();
    }).catch(async (error) => {
      this.verifyItems.location.status = 2;
      const toast = await this.toastCtr.create({
        message: 'Unable to fetch Location information. Please try again.',
        duration: 2000
      });
      toast.present();
      console.log('Error getting location', error);
    });
    // } else {
    //   this.toast = this.toastCtr.create({
    //     message: 'Location already captured.',
    //     duration: 2000
    //   });
    //   this.toast.present();
    // }

  }

  dismiss(verify = false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true,
      verifyItems: this.verifyItems,
      verified: verify
    });
  }
  async checkIn() {
    if (this.verifyItems.location.status == 1 && this.verifyItems.finger.status == 1) {
      this.dismiss(true);
    } else {
      const toast = await this.toastCtr.create({
        message: 'Complete all the verifications to proceed',
        duration: 2000
      });
      toast.present();
    }
    // this.dismiss();

  }
  fingerPrintAuth() {
    if (this.platform.platforms().indexOf('mobileweb') != -1)
    {
      this.verifyItems.finger.status = 1;
      this.project.bioVerified = 1;
    } else {
      this.faio.show({
        title: 'Authenticate with Finger or Face', // (Android Only) | optional | Default: "<APP_NAME> Biometric Sign On"
        subtitle: 'Project Tracker Demo App', // (Android Only) | optional | Default: null
        description: 'Please authenticate', // optional | Default: null
        fallbackButtonTitle: 'Use Backup', // optional | When disableBackup is false defaults to "Use Pin".
        disableBackup: true,  // optional | default: false
      })
        .then((result: any) => {
          this.verifyItems.finger.status = 1;
          this.verifyItems.finger.data = result;
          this.project.bioVerified = 1;
        })
        .catch(async (error: any) => {
          this.verifyItems.finger.status = 2;
          const toast = await this.toastCtr.create({
            message: 'Biometrics Authentication failed. Please try again.',
            duration: 2000
          });
          toast.present();
        });

    }


  }

}
