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
        timeTaken: 0,
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
        isActive: 0,
        timeTaken: 0
      }

    ];

    return list;

  }
}
