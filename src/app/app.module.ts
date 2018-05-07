import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
//
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ConfigService } from '../app/myservice/config.service';
import { ParserServiceService } from '../app/myservice/parser-service.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ConfigService, ParserServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
