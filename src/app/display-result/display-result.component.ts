import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../myservice/config.service';

@Component({
  selector: 'app-display-result',
  templateUrl: './display-result.component.html',
  styleUrls: ['./display-result.component.css']
})
export class DisplayResultComponent implements OnInit {
  @Input() result = [];
  @Input() qno = [];
  @Input() questionNumber=[];

  constructor(private configservice:ConfigService) {
    //console.log("question in display: ",this.configservice.result);
  }

  ngOnInit() {
    /*this.result = this.configservice.result;
    this.qno = this.configservice.qno;
    this.questionNumber = this.configservice.questionNumber;*/
    //document.body.innerHTML = "<br> <p> My innerHTML work";
  }

}
