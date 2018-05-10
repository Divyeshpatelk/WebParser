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
  result;
  arrowButton = true;
  answer = {};
  withAnswerPattern;
  checkConfig = false;
  myConfigFormGroup: FormGroup;
  myTextareaFormGroup: FormGroup;
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

    this.myTextareaFormGroup = new FormGroup({
      plain: new FormControl("", Validators.required),
      json: new FormControl("", Validators.required)
    });
    this.plainText = sessionStorage.getItem("plainText");
    this.arrowButton = false;
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
    this.myservice.configData.quePattern = this.myservice.quetionsRegex[
      this.myConfigFormGroup.get("quetionPattern").value
    ];
    this.myservice.configData.optPattern = this.myservice.optionRegex[
      this.myConfigFormGroup.get("optionPattern").value
    ];
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
    this.checkConfig = false;
    //this.myConfigFormGroup.reset();
    this.arrowButton = true;
  }

  onKeyUp(event: any) {
    sessionStorage.setItem("plainText", event.target.value);
    this.plainText = event.target.value;
    this.parserService.nonAnsOptions = [];
    this.parserService.nonAnsQuetions = [];
    this.arrowButton = true;
  }

  questionCount = true;
  questionTotal: number = 0;
  qno = [];
  regexCount = true;
  questionNumber = [];
  questionNumberCheck = true;
  questionNo = 0;
  onParserSubmit() {
    //console.log('angular data::'+this.plainText);
    this.displayText = "";
    this.parserService.configData = this.myservice.configData;
    this.parserService.explainationWithHint = new RegExp(
      /(##es([\s\S]*?)##ee+)/gm
    );

    if (this.myConfigFormGroup.get("choice").value === "Without Answer") {
      let answer = this.myservice.ansIdtRegex[
        this.myConfigFormGroup.get("ansIdtPattern").value
      ];
      let group = this.myservice.ansIdtRegex["groupofIdentifier"];

      this.answer = {
        idntPattern: answer,
        groupofIdentifier: group
      };
      this.result = this.parserService.withoutAnswer(
        this.plainText,
        this.answer
      );

      /* for (var i = 0; i < this.result.length; i++) {
        this.displayText = this.result[i].question+"\n";
        for(var j=0;j<this.result[i].choices.length;j++){
          this.displayText += this.result[i].choices[j];
        }
        this.displayText += this.result.rightAnswers;
      } */

      this.displayText = this.result;
    } else if (this.myConfigFormGroup.get("choice").value === "With Answer") {
      this.withAnswerPattern = this.myservice.answerRegex[
        this.myConfigFormGroup.get("answerPattern").value
      ];
      this.result = this.parserService.withAnswer(
        this.plainText,
        this.withAnswerPattern
      );
    } else {
    }

    // validation of Parser JSON
    if (this.result == null) {
      this.regexCount = false;
    } else {
      this.regexCount = true;
      if (this.myservice.questionCount != this.result.length) {
        this.questionCount = false;
        this.questionTotal = this.myservice.questionCount - this.result.length;
      }
      this.myservice.result = this.result;
      console.log("submit done: ",this.result);
      for (var i = 0; i < this.result.length; i++) {
        if (this.result[i].choices.length != 4) {
          this.questionNumberCheck = false;
          this.qno.push((i+1));
          this.questionNumber.push("Option Missing!");
          this.questionNo ++;
        }

        if (this.result[i].rightAnswers.length == 0) {
          this.questionNumberCheck = false;
          this.qno.push((i+1));
          this.questionNumber.push("Answer Missing!");
          this.questionNo ++;
        }
      }
      this.myservice.qno = this.qno;
      this.myservice.questionNumber = this.questionNumber;
    }

    this.arrowButton = false;
    console.log("My Json: ",this.result);
    //this.result = [];
  }
  question = true;
  addQuestion() {
    this.question = false;
  }
  option = true;
  addOption() {
    this.option = false;
  }

  onCancelQuestion() {
    this.question = true;
  }

  onCancelOption() {
    this.option = true;
  }
  identifire = true;
  addIdentifire() {
    this.identifire = false;
  }
  ans = true;
  addAnswer() {
    this.ans = false;
  }

  onCancelIdentifire() {
    this.identifire = true;
  }
  onCancelAns() {
    this.ans = true;
  }
}
