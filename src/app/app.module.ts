import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PinDialog } from '@ionic-native/pin-dialog/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    FingerprintAIO,
    UniqueDeviceID,
    NativeStorage,
    PinDialog,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
