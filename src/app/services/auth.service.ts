import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://86.96.196.61/tms/api/';
  defaultId = '112442';
  userDetails;
  info;

  constructor(private http: HttpClient, public platform: Platform) {
    console.log('Called Auth Service');
  }

  getUserDetails(){
    return this.userDetails;
  }

  login(creds): Promise <any> {
    return new Promise( async (resolve, reject) => {
      const uuid =  (await Plugins.Device.getInfo()).uuid;
      var headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');
    headers.append('content-type','application/json');


      if (creds.username.trim().length && creds.password.trim().length)
      {
        this.http.post(`${this.baseUrl}Auth/Authenticate?UserID=${creds.username.trim()}&Password=${creds.username.trim()}&DeviceID=${uuid}`,
        {}, { headers:headers})
        .subscribe((data) => {
          console.log(data);
          this.userDetails = data;
          resolve(data);
        }, (err) => {
          reject();
        });

      }
    });
  }

  verify(creds, otp): Promise <any> {
    return new Promise( async (resolve, reject) => {
      const uuid =  (await Plugins.Device.getInfo()).uuid;
      const headers = new HttpHeaders();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
     
      if (creds.EmployeeCode.trim().length && otp.trim().length)
      {
        this.http.post(`${this.baseUrl}Auth/Activate?UserID=${creds.EmployeeCode.trim()}&DeviceID=${uuid}&DeviceOTP=${otp.trim()}`,
        {}, {headers})
        .subscribe((data) => {
          console.log(data);
          resolve(data);
        }, (err) => {
          reject();
        });

      }
    });
  }
}
