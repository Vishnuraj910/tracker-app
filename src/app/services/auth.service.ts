import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://86.96.196.61/tms/api/';
  defaultId = '112442';
  constructor(private http: HttpClient, private uniqueDeviceID: UniqueDeviceID, public platform: Platform) {
    console.log('Called Auth Service');
  }

  login(creds): Promise <any> {
    return new Promise( (resolve, reject) => {

      const headers = new HttpHeaders();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      if (this.platform.platforms().indexOf('mobileweb') !== -1)
    {
      if (creds.username.trim().length && creds.password.trim().length)
      {
        this.http.post(`${this.baseUrl}Auth/Authenticate?UserID=${creds.username.trim()}
        &Password=${creds.username.trim()}&DeviceID=${this.defaultId}`,
        {}, {headers})
        .subscribe((data) => {
          console.log(data);
          resolve(data);
        }, (err) => {
          reject();
        });

      }

    } else {
      this.uniqueDeviceID.get()
      .then((uuid: any) => {
        if (creds.username.trim().length && creds.password.trim().length)
        {
          this.http.post(`${this.baseUrl}Auth/Authenticate?UserID=${creds.username.trim()}
          &Password=${creds.username.trim()}&DeviceID=${uuid}`, {})
          .subscribe((data) => {
            console.log(data);
            resolve(data);
          });
          resolve();
        }
      })
      .catch((error: any) => {reject(); console.log(error);});
    }
    });
  }

  verify(creds, otp): Promise <any> {
    return new Promise( (resolve, reject) => {

      const headers = new HttpHeaders();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      if (this.platform.platforms().indexOf('mobileweb') !== -1)
    {
      if (creds.EmployeeCode.trim().length && otp.trim().length)
      {
        this.http.post(`${this.baseUrl}Auth/Activate?UserID=${creds.EmployeeCode.trim()}
        &DeviceID=${this.defaultId}&DeviceOTP=${otp.trim()}`,
        {}, {headers})
        .subscribe((data) => {
          console.log(data);
          resolve(data);
        }, (err) => {
          reject();
        });

      }

    } else {
      this.uniqueDeviceID.get()
      .then((uuid: any) => {
        if (creds.EmployeeCode.trim().length && otp.trim().length)
        {
          this.http.post(`${this.baseUrl}Auth/Activate?UserID=${creds.EmployeeCode.trim()}
          &DeviceOTP=${otp.trim()}&DeviceID=${uuid}`, {})
          .subscribe((data) => {
            console.log(data);
            resolve(data);
          });
          resolve();
        }
      })
      .catch((error: any) => {reject(); console.log(error);});
    }
    });
  }
}
