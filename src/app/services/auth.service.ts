import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { 
    console.log("Called Auth Service");
  }

  login(creds): Promise <string> {
    return new Promise( (resolve, reject) => {

      if(creds.username == "admin" && creds.password == "admin")
      {
        resolve();
      }

      reject();

      
    });
  }
}
