import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfigService } from "../app/myservice/config.service";
import { ParserServiceService } from "../app/myservice/parser-service.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "Html to Json";
  plainText;
  displayText;
  answer = {};
  checkConfig = false;
  myConfigFormGroup: FormGroup;
  withAnswer = false;
  withoutAnswer = false;

  constructor(
    private myservice: ConfigService,
    private parserService: ParserServiceService
  ) {}

  ngOnInit() {
    this.myConfigFormGroup = new FormGroup({
      choice: new FormControl("", Validators.required),
      quetionPattern: new FormControl("", Validators.required),
      optionPattern: new FormControl("", Validators.required),
      answerPattern: new FormControl("", Validators.required),
      ansIdtPattern: new FormControl("", Validators.required),
      mappingId: new FormControl("", Validators.required),
      subjectId: new FormControl("", Validators.required),
      testId: new FormControl("", Validators.required),
      sectionId: new FormControl("", Validators.required),
      folderId: new FormControl("", Validators.required),
      indexId: new FormControl("", Validators.required),
      accountId: new FormControl("", Validators.required)
    });

    this.plainText = sessionStorage.getItem("plainText");
  }

  openConfig() {
    this.checkConfig = true;
  }

  onChange() {
    //console.log("Choice value is :- ",this.myConfigFormGroup.get('choice').value);
    if (this.myConfigFormGroup.get("choice").value === "With Answer") {
      this.withAnswer = true;
      this.withoutAnswer = false;
    } else if (
      this.myConfigFormGroup.get("choice").value === "Without Answer"
    ) {
      this.withAnswer = false;
      this.withoutAnswer = true;
    } else {
      this.withAnswer = true;
      this.withoutAnswer = true;
    }
  }

  onSubmit() {
    this.myservice.configData.quePattern = this.myservice.quetionsRegex[this.myConfigFormGroup.get(
      "quetionPattern"
    ).value];
    this.myservice.configData.optPattern = this.myservice.optionRegex[this.myConfigFormGroup.get(
      "optionPattern"
    ).value];
    this.myservice.configData.mappingId = this.myConfigFormGroup.get(
      "mappingId"
    ).value;
    this.myservice.configData.subjectid = this.myConfigFormGroup.get(
      "subjectId"
    ).value;
    this.myservice.configData.testId = this.myConfigFormGroup.get(
      "testId"
    ).value;
    this.myservice.configData.sectionId = this.myConfigFormGroup.get(
      "sectionId"
    ).value;
    this.myservice.configData.folderID = this.myConfigFormGroup.get(
      "folderId"
    ).value;
    this.myservice.configData.indexid = this.myConfigFormGroup.get(
      "indexId"
    ).value;
    this.myservice.configData.accountid = this.myConfigFormGroup.get(
      "accountId"
    ).value;

    if (this.myConfigFormGroup.get("choice").value === "Without Answer") {
      let answer = this.myservice.ansIdtRegex[
        this.myConfigFormGroup.get("ansIdtPattern").value
      ];
      let group = this.myservice.ansIdtRegex["groupofIdentifier"];

      this.answer = {
        idntPattern: answer,
        groupofIdentifier: group
      };
    } else if (this.myConfigFormGroup.get("choice").value === "With Answer") {
    } else {
    }
    this.checkConfig = false;
    //this.myConfigFormGroup.reset();
  }

  onKeyUp(event: any) {
    sessionStorage.setItem("plainText", event.target.value);
    this.plainText = event.target.value;
    this.parserService.nonAnsOptions = [];
    this.parserService.nonAnsQuetions = [];
  }

  onParserSubmit() {
    //console.log('angular data::'+this.plainText);
    this.displayText = "";
    var result = this.parserService.withoutAnswer(
      this.plainText,
      this.myservice.configData,
      this.answer
    );
    //console.log('final output: '+ JSON.stringify(result));
    this.displayText = result;
    result = [];
    //location.href = "http://localhost:4200/";
  }
}
