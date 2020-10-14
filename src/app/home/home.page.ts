import { DataService } from '../services/data.service';
import { VerifyPage } from '../modals/verify/verify.page';
import { OnInit, Component } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  projectList = [];
  timerObj;
  selectedTab = 1;
  verifyItems = {
    location: {
      status: 0,
      data: null
    }
  };
  constructor(private dataService: DataService,
              private modalController: ModalController,
              private toastCtr: ToastController,
              private location: Location,
              private geolocation: Geolocation,
              public alertController: AlertController) { }

  ngOnInit() {
    this.timerObj = new Date();
    // this.projectList = this.dataService.getList();
    this.geolocation.getCurrentPosition({timeout: 5000, enableHighAccuracy: true}).then((resp) => {
      this.dataService.getProjects().then((data) => {
        this.projectList = data;
        this.projectList.forEach((item) => {
          item.status =  1;
          item.isActive = 1,
          item.timeTaken = 0;
          item.distance = this.dataService.findDistance(resp.coords.altitude, resp.coords.longitude, item.Latitude, item.Longitude, 'K');
          item.timerRunning = false;
        });
      }, async () => {
        const toast = await this.toastCtr.create({
          message: 'Unable to fetch projects!',
          duration: 2000
        });
        toast.present();
      });
    }).catch(async (error) => {
      const toast = await this.toastCtr.create({
        message: 'Unable to fetch Location information. Please try again.',
        duration: 2000
      });
      toast.present();
      console.log('Error getting location', error);
    }); 
  }

  async startProject(index) {

    if (this.projectList[index].status === 1 && !this.projectList[index].timerRunning) {
      const isAnyRunning = this.projectList.find(item => item.timerRunning);
      console.log(isAnyRunning);
      if (isAnyRunning) {
        const toast = await this.toastCtr.create({
          message: '<b>' + isAnyRunning.title + '</b> is still active. Please stop it to start a new one',
          duration: 2000
        });
        toast.present();
      } else {
        this.presentModal(index);
      }

    } else {
      clearInterval(this.timerObj);
      this.projectList[index].timerRunning = false;
      this.projectList[index].endTime = Date.now();
    }



  }

  async presentModal(index) {
    const modal = await this.modalController.create({
      component: VerifyPage,
      cssClass: 'verify-class',
      componentProps: {
        project: this.projectList[index]
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if (data.verified) {
      this.startTimer(index);
    }
  }

  formatTime(currentTimer) {
    if (currentTimer >= 86400) {
      return new Date(87000 * 1000).toISOString().substr(8, 2) + ':' + new Date(currentTimer * 1000).toISOString().substr(11, 8);
    } else {
      return new Date(currentTimer * 1000).toISOString().substr(11, 8);
    }

  }


  startTimer(index) {
    const self = this;
    this.projectList[index].timerRunning = true;
    this.projectList[index].startTime ? this.projectList[index].startTime : Date.now();
    this.timerObj = setInterval(() => {
      self.projectList[index].timeTaken = Number(self.projectList[index].timeTaken) + 1;
    }, 1000);

  }

  tabSelected(selectedTab) {
    this.selectedTab = selectedTab;
    if (selectedTab === 1) {


    } else {

    }

  }

  getLocation() {
    // if (this.verifyItems.location.status != 1){
    this.geolocation.getCurrentPosition({timeout: 5000, enableHighAccuracy: true}).then((resp) => {
      console.log(resp);
      this.verifyItems.location.status = 1;
      this.verifyItems.location.data = resp;
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

  async logout() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Logout!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Logout',
          handler: () => {
            this.location.back();
          }
        }
      ]
    });

    await alert.present();

  }

  // startTimer(timeObj){
  //   var self = this;
  //   let countDownDate = new Date().getTime();
  //      // Update the count down every 1 second
  //      let x = setInterval(function () {

  //       // Get todays date and time
  //       let now = new Date().getTime();

  //       // Find the distance between now and the count down date
  //       let distance = now - countDownDate;
  //       // Time calculations for days, hours, minutes and seconds
  //       let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //       let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //       let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //       let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  //       console.log(timeObj);

  //       // Output the result in an element with id="demo"
  //       timeObj = hours + " : "
  //         + minutes + " : " + seconds ;

  //       // If the count down is over, write some text
  //       if (distance < 0) {
  //         clearInterval(x);
  //         timeObj = "EXPIRED";
  //       }
  //     }, 1000);
  // }

}
