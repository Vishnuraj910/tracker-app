import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {

  verifyItems = {
    location : {
      status : 0,
      data : null
    },
    selfie : {
      status : 0,
      data : null
    },
    finger : {
      status : 0,
      data : null
    }
   }

  constructor(private geolocation: Geolocation, private modalCtrl: ModalController, private faio: FingerprintAIO) { }

  ngOnInit() {
   
    this.getLocation();

  }
  getLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.verifyItems.location.status = 1;
      this.fingerPrintAuth();
     }).catch((error) => {
      this.verifyItems.location.status = 2;
       console.log('Error getting location', error);
     });
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  checkIn(){
    if(this.verifyItems.location.status == 1 && this.verifyItems.finger.status == 1)
    {
      this.dismiss();
    } else {
      alert("Complete verification to proceed!")
    }
    //this.dismiss();

  }
  fingerPrintAuth(){

    this.faio.show({
      title: 'Biometric Authentication', // (Android Only) | optional | Default: "<APP_NAME> Biometric Sign On"
      subtitle: 'Coolest Plugin ever', // (Android Only) | optional | Default: null
      description: 'Please authenticate', // optional | Default: null
      fallbackButtonTitle: 'Use Backup', // optional | When disableBackup is false defaults to "Use Pin".
      disableBackup:true,  // optional | default: false
  })
  .then((result: any) => {
    this.verifyItems.location.status = 1;
  })
  .catch((error: any) => {
    this.verifyItems.location.status = 2;
  });

  }

}
