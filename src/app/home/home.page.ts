import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { VerifyPage } from '../modals/verify/verify.page';
import {Location} from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  projectList = [];
  timerObj;
  selectedTab = 1;

  constructor(private dataService: DataService, 
    private modalController:ModalController,
    private toastCtr: ToastController,
    private location: Location,
    public alertController: AlertController) { }

  ngOnInit() {
    this.timerObj = new Date();
    this.projectList = this.dataService.getList();
  }

  async startProject(index){

      if(this.projectList[index].status == 1  && !this.projectList[index].timerRunning){
        const isAnyRunning = this.projectList.find(item => item.timerRunning);
        console.log(isAnyRunning);
        if(isAnyRunning) {
          const toast = await this.toastCtr.create({
                  message: '<b>'+isAnyRunning.title + '</b> is still active. Please stop it to start a new one',
                  duration: 2000
                });
          toast.present();
        } else {
          this.presentModal(index);
        }
        
      } else {
        clearInterval(this.timerObj);
        this.projectList[index].timerRunning = false;
      }
   
     
    
  }

  async presentModal(index) {
    const modal = await this.modalController.create({
      component: VerifyPage,
      cssClass: 'verify-class',
      componentProps: {
        'project': this.projectList[index]
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    if(data.verified) {
      this.startTimer(index);
    }
  }

  formatTime(cuurrentTimer){
    if(cuurrentTimer >= 86400)
    {
      return new Date(87000 * 1000).toISOString().substr(8, 2)+':' + new Date(cuurrentTimer * 1000).toISOString().substr(11, 8)
    } else {
      return new Date(cuurrentTimer * 1000).toISOString().substr(11, 8)
    }
    
  }


  startTimer(index){
    var self = this;
    this.projectList[index].timerRunning = true;
    this.timerObj = setInterval(function(){
      self.projectList[index].timeTaken = Number(self.projectList[index].timeTaken) + 1
    },1000)

  }

  tabSelected(selectedTab){
    this.selectedTab = selectedTab;
    if (selectedTab == 1){
      

    } else {

    }

  }

  async logout(){
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
