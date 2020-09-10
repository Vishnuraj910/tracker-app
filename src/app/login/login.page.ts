import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {
    
  }
  

  login() {
    console.log(this.loginObj.username);  
    var self = this;
    this.authService.login(this.loginObj).then(function(){
      self.router.navigate(['/home'])
      
    }, function(){
      alert("Please check your credentials");
    })
    
  }

}
