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
  searchString = '';
  isLoading = true;
  constructor(private dataService: DataService,
              private modalController: ModalController,
              private toastCtr: ToastController,
              private location: Location,
              private geolocation: Geolocation,
              public alertController: AlertController) { }

  ngOnInit(event = null) {
    // this.timerObj = new Date();
    this.isLoading = true;
    // if (event !== null) {
    //   clearInterval(this.timerObj);
    // }
    // this.projectList = this.dataService.getList();
    this.geolocation.getCurrentPosition({timeout: 5000, enableHighAccuracy: true}).then((resp) => {
      this.dataService.getProjects(resp.coords, this.searchString).then((data) => {
        this.projectList = data;
        this.projectList.forEach((item, index) => {
        item.distance = this.dataService.findDistance(resp.coords.latitude, resp.coords.longitude, item.Latitude, item.Longitude, 'K');
        });
        this.projectList.sort((a, b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0));
        this.projectList.forEach((item, index) => {
          item.status =  1;
          item.isActive = 1;
          if (item.WorkedSeconds.length === 0) {
            item.WorkedSeconds = 0;
          }
          item.timeTaken = parseInt(item.WorkedSeconds, 10);
          if (item.WorkStartTime.length !== 0 && item.WorkEndTime.length === 0) {
            this.startTimer(index);
            this.projectList[index].status = 1;
          } else if (item.WorkStartTime.length !== 0 && item.WorkEndTime.length !== 0){
            this.projectList[index].status = 2;
            item.timerRunning = false;
          } else {
            this.projectList[index].status = 1;
            item.timerRunning = false;
          }
        });
        this.isLoading = false;
        if (event !== null) {
        setTimeout(() => {
          console.log('Async operation has ended');
          event.target.complete();
        }, 1000);
      }
      }, async () => {
        const toast = await this.toastCtr.create({
          message: 'Unable to fetch projects!',
          duration: 2000
        });
        toast.present();
        this.isLoading = false;
      });
    }).catch(async (error) => {
      const toast = await this.toastCtr.create({
        message: 'Unable to fetch Location information. Loading all available projects',
        duration: 2000
      });
      toast.present();
      this.isLoading = false;
      console.log('Error getting location', error);
    });
  }

  async startProject(index) {

    if (!this.projectList[index].timerRunning) {
      this.projectList[index].status = 1;
      const isAnyRunning = this.projectList.find(item => item.timerRunning);
      console.log(isAnyRunning);
      if (isAnyRunning) {
        const toast = await this.toastCtr.create({
          message: '<b>' + isAnyRunning.ActivityTitle + '</b> is still active. Please stop it to start a new one',
          duration: 2000
        });
        toast.present();
      } else {
        this.presentModal(index);
      }

    } else {
      this.isLoading = true;
      // this.projectList[index].status = 2;
      this.geolocation.getCurrentPosition({timeout: 5000, enableHighAccuracy: true}).then((resp) => {

      this.projectList[index].timerRunning = false;
      this.projectList[index].EndTime = new Date().getTime();
      this.dataService.setProjectStatus({ currentProject : this.projectList[index],
        EndTime: this.projectList[index].EndTime,
        StartOrStop: 'Stop',
        Latitude: resp.coords.latitude,
        Longitude: resp.coords.longitude}).then(() => {
          clearInterval(this.timerObj);
          this.isLoading = false;
      } ,
      async () => {
        const toast = await this.toastCtr.create({
          message: 'Unable to start this project. Please try again.',
          duration: 2000
        });
        toast.present();
        this.isLoading = false;
      });
    }).catch(async (error) => {
      const toast = await this.toastCtr.create({
        message: 'Unable to fetch Location information. Loading all available projects',
        duration: 2000
      });
      toast.present();
      this.isLoading = false;
    });
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
    if (data.verified) { // Send start status to Server
      data.StartOrStop = 'Start';
      data.StartTime = new Date().getTime();
      data.Latitude = data.verifyItems.location.data.coords.latitude;
      data.Longitude = data.verifyItems.location.data.coords.longitude;
      this.dataService.setProjectStatus(data).then((timeID) => {
        this.projectList[index].TimeSheetID = timeID;
        this.startTimer(index);
      } ,
      async () => {
        const toast = await this.toastCtr.create({
          message: 'Unable to start this project. Please try again.',
          duration: 2000
        });
        toast.present();
      });
    } else {
      const toast = await this.toastCtr.create({
        message: 'Please finish all the verifications to start the project',
        duration: 2000
      });
      toast.present();
    }
  }

  formatTime(currentTimer) {
    if (isNaN(currentTimer)) {
      return;
    }
    if (currentTimer >= 86400) {
      return new Date(87000 * 1000).toISOString().substr(8, 2) + 'D ' + new Date(currentTimer * 1000).toISOString().substr(11, 8);
    } else {
      return new Date(currentTimer * 1000).toISOString().substr(11, 8);
    }

  }


  startTimer(index) {
    const self = this;
    this.projectList[index].timerRunning = true;
    this.projectList[index].startTime ? this.projectList[index].startTime : Date.now();
    // this.timerObj = null;
    clearInterval(this.timerObj);
    this.timerObj = setInterval(() => {
      // console.log('Timer');
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

  searchList(evnt){
    this.ngOnInit();
  }

}
