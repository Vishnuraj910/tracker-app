import { Component } from '@angular/core';

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

  constructor() {}

  login() {
    console.log(this.loginObj.username);  
    
  }

}
