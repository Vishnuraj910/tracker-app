import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseUrl = 'https://www.mattakkara.com/api/';
  defaultEmployeeCode = '16536';

  constructor(private http: HttpClient, private uniqueDeviceID: UniqueDeviceID,
              public platform: Platform, private authService: AuthService) {
    console.log('Called Data Service');
  }

  getProjects(coordinates, searchString = ''): Promise <any> {
    return new Promise( (resolve, reject) => {
      const userObj = this.authService.getUserDetails();
      // console.log(userObj);

      this.http.get(`${this.baseUrl}Activity/Get?UserID=${userObj ? userObj.EmployeeCode : this.defaultEmployeeCode}${(coordinates ? '&latitude=' + coordinates.latitude + '&longitude=' + coordinates.longitude : '')}&searchString=${searchString}`)
        .subscribe((data) => {
          console.log(data);
          resolve(data);
        }, (err) => {
          reject();
        });
  });
}

  getList() {
    const list = [
      {
        title: 'Emaar Properties',
        distance: '15 Kms',
        desc: 'Some description goes here',
        status: 1,
        isActive: 1,
        timeTaken: 80,
        timerRunning: false
      },
      {
        title: 'Mall of the Emirates',
        distance: '25 Kms',
        desc: 'Some description goes here',
        status: 1,
        isActive: 1,
        timeTaken: 0,
        timerRunning: false
      },
      {
        title: 'Burj Al Arab',
        distance: '35 Kms',
        desc: 'Some description goes here',
        status: 1,
        isActive: 1,
        timeTaken: 0
      },
      {
        title: 'Kalyan Jewellers',
        distance: '10 Kms',
        desc: 'Some description goes here',
        status: 2,
        isActive: 1,
        timeTaken: 88400,
        timerRunning: false
      },
      {
        title: 'Lulu Hyper Market',
        distance: '7.5 Kms',
        desc: 'Some description goes here',
        status: 2,
        isActive: 50,
        timeTaken: 0
      }

    ];

    return list;

  }
  findDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    }
    else {
      const Latitude1 = Math.PI * lat1 / 180;
      const Latitude2 = Math.PI * lat2 / 180;
      const theta = lon1 - lon2;
      const radiusTheta = Math.PI * theta / 180;
      let dist = Math.sin(Latitude1) * Math.sin(Latitude2) + Math.cos(Latitude1) * Math.cos(Latitude2) * Math.cos(radiusTheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === 'K') { dist = dist * 1.609344; }
      if (unit === 'N') { dist = dist * 0.8684; }
      return dist;
    }
  }
}
