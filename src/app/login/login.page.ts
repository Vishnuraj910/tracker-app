import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  loginObj = {
    username: null,
    password: null,
  };

  constructor(private authService: AuthService) {}

  login() {
    console.log(this.loginObj.username);  
    this.authService.login(this.loginObj).then(function(){
      
    })
    
  }

}
