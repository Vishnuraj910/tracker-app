import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  loginObj = {
    username: "16536",
    password: "16536",
  };

  constructor(private authService: AuthService, private router: Router, public loadingController: LoadingController,
    private nativeStorage: NativeStorage) {
    
  }
  

  async login() {
    console.log(this.loginObj.username);  
    var self = this;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loging In',
      duration: 20000
    });
    await loading.present();

    this.authService.login(this.loginObj).then(async function(userData){
      self.nativeStorage.setItem('userData', userData)
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
      self.router.navigate(['/home'])
      await loading.dismiss();
    }, async function(){
      await loading.dismiss();
      alert("Please check your credentials");
    })
    
  }

}
