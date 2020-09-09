import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

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
