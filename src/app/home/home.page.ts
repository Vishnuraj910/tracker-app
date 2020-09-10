import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalController } from '@ionic/angular';
import { VerifyPage } from '../modals/verify/verify.page';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  projectList = [];
  timerObj;
  currentTimerFlag = true;

  constructor(private dataService: DataService, private modalController:ModalController) { }

  ngOnInit() {
    this.timerObj = new Date();
    this.projectList = this.dataService.getList();
  }

  startProject(index){
    if(!this.projectList[index].timerRunning){
      this.startTimer(index);
    } else {
      clearInterval(this.timerObj);
      this.projectList[index].timerRunning = false;
    }
    
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: VerifyPage,
      cssClass: 'verify-class'
    });
    return await modal.present();
  }

  formatTime(cuurrentTimer){
    return new Date(cuurrentTimer * 1000).toISOString().substr(11, 8)
  }


  startTimer(index){
    var self = this;
    this.projectList[index].timerRunning = true;
    this.timerObj = setInterval(function(){
      self.projectList[index].timeTaken = Number(self.projectList[index].timeTaken) + 1
    },1000)

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
