import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseeUrl = "http://86.96.196.61/tms/api/";

  constructor(private http: HttpClient, private uniqueDeviceID: UniqueDeviceID, public platform: Platform) { 
    console.log("Called Auth Service");
  }

  login(creds): Promise <any> {
    return new Promise( (resolve, reject) => {

      var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
      if (this.platform.platforms().indexOf('mobileweb') != -1)
    {
      if(creds.username.trim().length && creds.password.trim().length)
      {
        this.http.post(`${this.baseeUrl}Auth?UserID=${creds.username.trim()}&Password=${creds.username.trim()}&DeviceID=browser`,{},{headers: headers})
        .subscribe((data) => {
          console.log(data);
          resolve(data);
        },(err) => {
          reject();
        })
        
      }
    
    } else {
      this.uniqueDeviceID.get()
      .then((uuid: any) => {
        if(creds.username.trim().length && creds.password.trim().length)
        {
          this.http.post(`${this.baseeUrl}Auth?UserID=${creds.username.trim()}&Password=${creds.username.trim()}&DeviceID=${uuid}`,{})
          .subscribe((data) => {
            console.log(data);
          resolve(data);
          })
          resolve();
        }
      })
      .catch((error: any) => {reject();console.log(error)});
    }
      
      


      

      
    });
  }
}
