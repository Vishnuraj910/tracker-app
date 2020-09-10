import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getList() {
    var list = [
      {
        title: "Emaar Properties",
        distance: "15 Kms",
        desc: "Some description goes here",
        status: 1,
        isActive: 1,
        timeTaken: 80,
        timerRunning: false
      },
      {
        title: "Mall of the Emirates",
        distance: "25 Kms",
        desc: "Some description goes here",
        status: 1,
        isActive: 1,
        timeTaken: 0,
        timerRunning: false
      },
      {
        title: "Burj Al Arab",
        distance: "35 Kms",
        desc: "Some description goes here",
        status: 1,
        isActive: 1,
        timeTaken: 0
      },
      {
        title: "Kalyan Jewellers",
        distance: "10 Kms",
        desc: "Some description goes here",
        status: 2,
        isActive: 1,
        timeTaken: 88400,
        timerRunning: false
      },
      {
        title: "Lulu Hyper Market",
        distance: "7.5 Kms",
        desc: "Some description goes here",
        status: 2,
        isActive: 50,
        timeTaken: 0
      }

    ];

    return list;

  }
}
