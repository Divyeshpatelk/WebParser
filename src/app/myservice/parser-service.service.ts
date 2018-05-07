import { Injectable } from "@angular/core";

@Injectable()
export class ParserServiceService {
  outputResultIndex = 0;
  constructor() {}

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

  withoutAnswer(readData, answerData) {

    console.log("configData data", this.configData.quePattern);
    var nonAnswerQue = [];
    nonAnswerQue = readData.match(
      new RegExp(answerData.groupofIdentifier, "gm")
    );
    /* var explaination = [],
      explainationJson = [];
    if (explainationWithHint) {
      explaination = readData.match(explainationWithHint);
      explainationJson = storeExplaination(explaination);
    }  */

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

              if (que.data.match(/<br>+$/gm)) {
                var removeBr = new RegExp(/<br>+$/, "gm");
                que.data = que.data.replace(removeBr, "");
              }

              var opt = this.readOptions(
                tempque,
                new RegExp(this.configData.quePattern),
                new RegExp(this.configData.optPattern)
              );

              if (que && opt) {
                var options1 = this.spreadOption(opt, this.configData.optPattern);

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
          console.log("Answer is work: ");
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
    }
    //addExplaination(explainationJson);

    return this.storeResult(this.nonAnsQuetions, this.configData);
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
          if (result[this.outputResultIndex])
            result[this.outputResultIndex] += "<br>";
          dataOfQuetions += result[this.outputResultIndex];

          this.outputResultIndex++;

          if (this.outputResultIndex >= result.length) break;

          if (!result[this.outputResultIndex]) continue;

          if (result[this.outputResultIndex].match(quePattern)) {
            dataOfQuetions = "";
          }
        }
        return { id: no, data: dataOfQuetions };
      }
    }
    return null;
  }
  readOptions(result, quePattern, optPattern) {
    var tempArr = "";
    var count = 0;

    for (; this.outputResultIndex < result.length; this.outputResultIndex++) {
      if (result[this.outputResultIndex].match(optPattern)) {
        tempArr += result[this.outputResultIndex];
        tempArr += "<br>";
      } else if (
        result[this.outputResultIndex].match(quePattern) ||
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
      if (splitArray[j].match(/<br>+$/gm)) {
        var removeBr = new RegExp(/<br>+$/, "gm");
        splitArray[j] = splitArray[j].replace(removeBr, "");
      }
      temp.push(splitArray[j].trim());
    }

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
      var excePattern = new RegExp(/(\d+)[.]\s/gm);

      var groupMatch = ([] = excePattern.exec(
        multiOption[i].match(excePattern)
      ));

      var que: any = groupMatch[1];
      excePattern = new RegExp(/([a-zA-Z])/gm);
      groupMatch = excePattern.exec(multiOption[i].match(excePattern));

      answer = groupMatch[1];

      var temp = { qno: que, ans: answer };

      storeAnswerSet.push(temp);
    }

    var TempStoreAnswer: any = { identifier: ide, answer: storeAnswerSet };

    this.nonAnsOptions.push(TempStoreAnswer);
    console.log("json: ", TempStoreAnswer);
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
    } else {
      return null;
    }
  }
} // End class
