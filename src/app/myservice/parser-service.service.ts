import { Injectable } from "@angular/core";
import { ConfigService } from "../myservice/config.service";
//const Path = require("path");
//import * as Path  from 'path';

@Injectable()
export class ParserServiceService {
  questionCount = 0;
  outputResultIndex = 0;
  constructor(private configservice: ConfigService) {}
  explainationWithHint;
  outputResult = [
    /* {
      type: "",
      questions: "",
      choices: {
        id:'',
        text:''
      },
      rightAnswer: ""
    } */
  ];

  nonAnsQuetions = [
    /* {
      identifier: "",
      que: [
        {
          qno: "",
          type:'',
          questions: "",
          choices:{
              id:'',
              text:''
          },
          rightAnswer: ""
        }
      ]
    } */
  ];
  nonAnsOptions = [
    /*{
      identifier: "",
      answer: [
        {
          qno: "",
          ans: ""
        }
      ]
    }*/
  ];

  explainationArray = [
    {
      qno: "",
      exp: ""
    }
  ];

  configData = {
    quePattern: "",
    optPattern: "",
    mappingId: "",
    subjectid: "",
    testId: "",
    sectionId: "",
    folderID: "",
    indexid: "",
    accountid: ""
  };

  changeImagePath(readData, answerData)
  {
    var tempreadData = readData;
    tempreadData = tempreadData.match(/src=("[^\s]*)/gm);
    var oIMG = `https://static-assets.pedagogy.study/contents/${
      this.configData.accountid
    }/question/${this.configData.mappingId}/${this.configData.subjectid}/${
      this.configData.indexid
    }/${this.configData.folderID}`;


    if (tempreadData) {
      for (var srcIndex = 0; srcIndex < tempreadData.length; srcIndex++) {
        //var imgName = Path.basename(tempreadData[srcIndex]);

        //var imgPath = Path.dirname(tempreadData[srcIndex]);
        var imgName = tempreadData[srcIndex].match(new RegExp(/\/([^/]*\/?$)/gm));
        var imgPath = tempreadData[srcIndex].replace(new RegExp(/\/([^/]*\/?$)/gm),"");
        var fullPath = `src="${oIMG}${imgName}`;

        readData = readData.replace(`${imgPath}${imgName}`, fullPath);
      }
    }
    return readData;
  }

  withoutAnswer(readData, answerData) {

    readData = this.changeImagePath(readData, answerData);
    //console.log("configData data", this.configData.quePattern);
    var nonAnswerQue = [];
    nonAnswerQue = readData.match(
      new RegExp(answerData.groupofIdentifier, "gm")
    );
    var explaination = [];
     var explainationJson = [];
    if (this.explainationWithHint) {
      explaination = readData.match(this.explainationWithHint);
      explainationJson = this.storeExplaination(explaination);
    }
    explaination = [];
    //main work ............................
    if (nonAnswerQue) {
      for (var n = 0; n < nonAnswerQue.length; n++) {
        if (nonAnswerQue[n].match(/^##qs-([1-9])/gm)) {
          var excePattern = new RegExp(/^##qs-(\d+)/gm);
          var groupMatch = excePattern.exec(nonAnswerQue[n].match(excePattern));
          var ide = groupMatch[1];

          var tempque = nonAnswerQue[n].match(/.*/gm);
          var storeQuestionsSet = [];
          for (
            ;
            this.outputResultIndex < tempque.length;
            this.outputResultIndex++
          ) {
            if (!tempque[this.outputResultIndex]) continue;
            this.nonAnsQuetions;

            while (!tempque[this.outputResultIndex].match(/^##qe-([1-9])/gm)) {
              var que = this.readQuetions(
                tempque,
                new RegExp(this.configData.quePattern),
                new RegExp(this.configData.optPattern)
              );
              //console.log("Without Questions: ",que.data);
              if (que == null) return null;
              que.data = que.data.replace(/\s+$/, "");
              while (que.data.match(/<br>+$/gm)) {
                var removeBr = new RegExp(/<br>+$/, "gm");
                que.data = que.data.replace(removeBr, "");
                que.data = que.data.replace(/\s+$/, "");
              }

              var opt = this.readOptions(
                tempque,
                new RegExp(this.configData.optPattern),
                new RegExp(this.configData.quePattern),
                new RegExp(this.configData.optPattern)
              );
              //console.log("Without Options: ",opt);
              if (que && opt) {
                var options1 = this.spreadOption(
                  opt,
                  this.configData.optPattern
                );

                var optionArraywithID = [];
                for (var i = 0; i < options1.length; i++) {
                  optionArraywithID.push({ id: i + 1, text: options1[i] });
                }
                var remTagofquetions = que.data.replace(
                  new RegExp(this.configData.quePattern),
                  ""
                );
                var temp = {
                  qno: que.id,
                  type: "single",
                  questions: remTagofquetions.trim(),
                  choices: optionArraywithID,
                  ans: [],
                  explaination: ""
                };
                storeQuestionsSet.push(temp);
              } else {
                console.log("que = NULL, Opt = NULL");
                return null;
              }

              if (!tempque[this.outputResultIndex]) break;
            }
            this.outputResultIndex++;
          }
          var allQuestionsData: any = {
            identifier: ide,
            que: storeQuestionsSet
          };
          this.nonAnsQuetions.push(allQuestionsData);
        } else if (nonAnswerQue[n].match(/^##os-([1-9])/gm)) {
          //console.log("Answer is work: ");
          var excePattern = new RegExp(/^##os-(\d+)/gm);
          var groupMatch = excePattern.exec(nonAnswerQue[n].match(excePattern));
          var ide = groupMatch[1];

          this.outputResultIndex++;
          var multipleOption = "";
          var tempque = nonAnswerQue[n].match(/.*/gm);

          for (
            ;
            this.outputResultIndex < tempque.length;
            this.outputResultIndex++
          ) {
            while (!tempque[this.outputResultIndex].match(/^##oe-([1-9])/gm)) {
              multipleOption += tempque[this.outputResultIndex++];
            }

            this.outputResultIndex++;
          }

          if (!multipleOption.match(new RegExp(answerData.idntPattern))) {
            console.log("MultiOption = NULL");
            return null;
          }

          this.storeAnswerForMulichoice(
            readData,
            multipleOption,
            ide,
            answerData
          );
        }
        this.outputResultIndex = 0;
      } // End main For Loop
      //end main work.........................
    } else {
      return null;
    }
    this.addExplaination(explainationJson);
    explainationJson = [];
    this.configservice.questionCount = this.questionCount;
    return this.storeResult(this.nonAnsQuetions, this.configData);
  }
  // with answer
  withAnswer(readData, ansPattern) {
    if (this.explainationWithHint)
      readData = readData.replace(this.explainationWithHint, "");

    var result = readData.match(/.*/gm);
    //console.log("My plaintext: ",readData+"\n");
    //console.log("My Answer: ",ansPattern);
    while (result.length > this.outputResultIndex) {
      var quetions = this.readQuetions(
        result,
        new RegExp(this.configData.quePattern),
        new RegExp(this.configData.optPattern)
      );

      //console.log("Questions is : ",quetions.data+"\n");
      var remTagofquetions = "";

      var options = this.readOptions(
        result,
        this.configData.optPattern,
        this.configData.quePattern,
        ansPattern
      );

      //console.log("My Option is: ",options);
      var optionArray = new Array();

      if (quetions != null && options.length != 0) {
        quetions.data = quetions.data.replace(/\s+$/, "");
        while (quetions.data.match(/<br>+$/gm)) {
          var removeBr = new RegExp(/<br>+$/, "gm");
          quetions.data = quetions.data.replace(removeBr, "");
          quetions.data = quetions.data.replace(/\s+$/, "");
        }

        var remTagofquetions = quetions.data.replace(
          new RegExp(this.configData.quePattern),
          ""
        );
        optionArray = this.spreadOption(options, this.configData.optPattern);
        if (optionArray.length == 4) {
          var optionArraywithID = [];
          for (var i = 0; i < optionArray.length; i++) {
            optionArraywithID.push({ id: i + 1, text: optionArray[i] });
          }

          var answer = this.readAnswer(
            result,
            ansPattern,
            this.configData.quePattern
          );

          if (answer) answer = answer.replace(new RegExp(ansPattern, "gm"), "");

          // if (answer != null) {
          var answerWithoutB = answer;
          this.outputResult.push({
            type: "SINGLE",
            question: remTagofquetions.trim(),

            choices: optionArraywithID,
            difficultyLevel: 1,

            rightAnswers: [this.AtoZwithNumber(answerWithoutB)],
            explanation: "",
            courses: [
              {
                mappingId: this.configData.mappingId,
                subjectid: this.configData.subjectid,
                indexid: this.configData.indexid,
                sectionId: this.configData.sectionId
              }
            ],
            testId: this.configData.testId,
            purpose: "PARTNER_SECTION"
          });
        }
        // }
      }
    }
    this.configservice.questionCount = this.questionCount;
    return this.outputResult;
  }
  // with answer

  readAnswer(result, ansPattern, quePattern) {
    for (; this.outputResultIndex < result.length; this.outputResultIndex++) {
      if (result[this.outputResultIndex].match(ansPattern)) {
        return result[this.outputResultIndex];
      } else if (result[this.outputResultIndex].match(quePattern)) {
        // need to be improve more -->
        break;
      }
    }

    return null;
  }

  storeResult(nonAnsQuetions, configData) {
    var outputResult2 = [];

    for (var i = 0; i < nonAnsQuetions.length; i++) {
      for (var j = 0; j < nonAnsQuetions[i].que.length; j++) {
        outputResult2.push({
          type: "SINGLE",
          question: nonAnsQuetions[i].que[j].questions,

          choices: nonAnsQuetions[i].que[j].choices,
          difficultyLevel: 1,

          rightAnswers: nonAnsQuetions[i].que[j].ans,
          explanation: nonAnsQuetions[i].que[j].explaination,
          courses: [
            {
              mappingId: configData.mappingId,
              subjectid: configData.subjectid,
              indexid: configData.indexid,
              sectionId: configData.sectionId
            }
          ],
          testId: configData.testId,
          purpose: "PARTNER_SECTION"
        });
      }
    }

    return outputResult2;
  }

  readQuetions(result, quePattern, optPattern) {
    var dataOfQuetions = "";

    for (; this.outputResultIndex < result.length; this.outputResultIndex++) {
      if (result[this.outputResultIndex].match(quePattern)) {
        var groupMatch: any = quePattern.exec(
          result[this.outputResultIndex].match(quePattern)
        );
        var no = groupMatch[1];

        while (!result[this.outputResultIndex].match(optPattern)) {
          if (
            result[this.outputResultIndex] &&
            result[this.outputResultIndex].length > 0
          )
            result[this.outputResultIndex] += "<br>";

          dataOfQuetions += result[this.outputResultIndex];

          this.outputResultIndex++;

          if (this.outputResultIndex >= result.length) break;

          if (!result[this.outputResultIndex]) continue;

          if (result[this.outputResultIndex].match(quePattern)) {
            dataOfQuetions = "";
          }
        }
        this.questionCount++;
        return { id: no, data: dataOfQuetions };
      }
    }
    return null;
  }
  readOptions(result, optPattern, quePattern, ansPattern) {
    var tempArr = "";
    var count = 0;

    for (; this.outputResultIndex < result.length; this.outputResultIndex++) {
      if (result[this.outputResultIndex].match(optPattern)) {
        tempArr += result[this.outputResultIndex];
        tempArr += "<br>";
      } else if (
        result[this.outputResultIndex].match(quePattern) ||
        result[this.outputResultIndex].match(ansPattern) ||
        result[this.outputResultIndex].match(/^##qe-([1-9])/gm)
      ) {
        break;
      } else {
        tempArr += result[this.outputResultIndex];
      }
    }
    return tempArr;
  }

  spreadOption(options, opattern) {
    var splitArray;
    var temp = new Array();
    splitArray = options.split(new RegExp(opattern, "gm"));
    for (var j = 1; j < splitArray.length; j++) {
      splitArray[j] = splitArray[j].replace(/\s+$/, "");
      if (splitArray[j].match(/<br>+$/gm)) {
        var removeBr = new RegExp(/<br>+$/, "gm");
        splitArray[j] = splitArray[j].replace(removeBr, "");
      }
      temp.push(splitArray[j].trim());
    }
    //console.log("Option temp is: ",temp);
    return temp;
  }

  storeAnswerForMulichoice(readData, multipleOption, ide, answerData) {
    var multiOption = [];
    let nonAnswerQue = readData.match(
      new RegExp(answerData.groupofIdentifier, "gm")
    );
    multiOption = multipleOption.match(
      new RegExp(answerData.idntPattern, "gm")
    );

    var que, answer;
    var storeAnswerSet = [];
    for (var i = 0; i < multiOption.length; i++) {
      //console.log("MultiOption is: ",multiOption[i]+"\n");
      var queString = this.configData.quePattern.replace("^","");
      var excePattern = new RegExp(queString,"gm");

      var groupMatch = ([] = excePattern.exec(
        multiOption[i].match(excePattern)
      ));

      var que: any = groupMatch[1];
      //console.log("Questions is: ",que);
      var optString  = this.configData.optPattern.replace("[(]","");
      optString  = optString.replace("[)]","");
      optString  = "\\(("+optString+")\\)";
      //console.log("option pattern: ",optString);
      excePattern = new RegExp(optString,"gm");
      groupMatch = excePattern.exec(multiOption[i].match(excePattern));

      answer = groupMatch[1];
      //console.log("Answer is: ",answer);
      var temp = { qno: que, ans: answer };
      //console.log("storeAnswerForMulichoice: ",temp);
      storeAnswerSet.push(temp);
    }

    var TempStoreAnswer: any = { identifier: ide, answer: storeAnswerSet };

    this.nonAnsOptions.push(TempStoreAnswer);
    //console.log("json: ", TempStoreAnswer);
    this.storeAnswerTononAnsQuetions();
  }

  storeAnswerTononAnsQuetions() {
    if (this.nonAnsQuetions != null && this.nonAnsOptions != null) {
      for (var i = 0; i < this.nonAnsQuetions.length; i++) {
        if (
          this.nonAnsQuetions[i].identifier === this.nonAnsOptions[0].identifier
        ) {
          for (var j = 0; j < this.nonAnsQuetions[i].que.length; j++) {
            for (var k = 0; k < this.nonAnsOptions[0].answer.length; k++) {
              if (
                this.nonAnsQuetions[i].que[j].qno ===
                this.nonAnsOptions[0].answer[k].qno
              ) {
                this.nonAnsQuetions[i].que[j].ans.push(
                  this.AtoZwithNumber(this.nonAnsOptions[0].answer[k].ans)
                );
              }
            }
          }
        }
        break;
      }
    }
    this.nonAnsOptions = [];
  }

  AtoZwithNumber(answer) {
    if (answer == "a" || answer == "A") {
      return 1;
    } else if (answer == "b" || answer == "B") {
      return 2;
    } else if (answer == "c" || answer == "C") {
      return 3;
    } else if (answer == "d" || answer == "D") {
      return 4;
    } else if (answer == "e" || answer == "E") {
      return 5;
    } else if (answer == "f" || answer == "F") {
      return 6;
    } else if (answer == "g" || answer == "G") {
      return 7;
    } else if (answer == "h" || answer == "H") {
      return 8;
    }
    else if (!(isNaN(answer))) {
      console.log("My Answer if: ",answer);
      return answer;
    }else {
      return null;
    }
  }

  storeExplaination(explaination) {
    var explainationData = [];
    if (explaination) {
      for (var i = 0; i < explaination.length; i++) {
        explainationData = explaination[i].match(/.*/gm);
        //console.log("explainationData length is :- "+explainationData);
        for (var j = 0; j < explainationData.length; j++) {
          var dataOfQuetions = "";
          if (explainationData[j].match(this.configData.quePattern)) {
            var groupMatch = new RegExp(this.configData.quePattern).exec(
              explainationData[j].match(this.configData.quePattern)
            );
            var no = groupMatch[1];
            //console.log("not error ",no);
            do {
              dataOfQuetions += explainationData[j];
              //console.log("Explaination data is ",dataOfQuetions);
              j++;

              if (j >= explainationData.length) break;

              if (!explainationData[j]) continue;

              if (explainationData[j].match(this.configData.quePattern)) {
                break;
              }
            } while (!explainationData[j].match(this.configData.quePattern));
            j--;

            dataOfQuetions = dataOfQuetions.replace(/\s+$/, "");
            while (dataOfQuetions.match(/<br>+$/gm)) {
              var removeBr = new RegExp(/<br>+$/, "gm");
              dataOfQuetions = dataOfQuetions.replace(removeBr, "");
              dataOfQuetions = dataOfQuetions.replace(/\s+$/, "");
            }
            dataOfQuetions = dataOfQuetions.replace("##ee","");
            this.explainationArray.push({
              qno: no,
              exp: dataOfQuetions.replace(
                new RegExp(this.configData.quePattern),
                ""
              )
            });
          }
        }
      }

      //Display the explaination Array

      /* for(var k=1;k<this.explainationArray.length;k++){
        console.log("Explaination is :- ","qno :- ",this.explainationArray[k].qno,"data :- ",this.explainationArray[k].exp);
    } */
    }
    return this.explainationArray;
  }

  addExplaination(explainationJson) {
    if (this.nonAnsQuetions && explainationJson) {
      for (var i = 0; i < explainationJson.length; i++) {
        for (var k = 0; k < this.nonAnsQuetions.length; k++) {
          for (var j = 0; j < this.nonAnsQuetions[k].que.length; j++) {
            if (this.nonAnsQuetions[k].que[j].qno === explainationJson[i].qno) {
              this.nonAnsQuetions[k].que[j].explaination =
                explainationJson[i].exp;
            } else {
              //console.log("error ",explainationJson[i].qno);
            }
          }
        }
      }
    }
  }
} // End class
