import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MenuComponent } from './menu/menu.component'
import { FormsModule } from '@angular/forms';
import { Web3Service } from './services/web3.service';
import { SharedDataService } from './services/shared.service';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    Web3Service,
    SharedDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
