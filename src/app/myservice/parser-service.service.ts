import { Injectable } from "@angular/core";

@Injectable()
export class ParserServiceService {
  outputResultIndex = 0;
  configData = {};
  constructor() {}

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

  withoutAnswer(readData, configData, answerData) {
    //console.log("json: ", configData);
    //console.log("readData: ", readData);
    //console.log("group regex: ", answerData.groupofIdentifier);
    //console.log("Function data: ",readData);
    var nonAnswerQue = [];
    nonAnswerQue = readData.match(
      new RegExp(answerData.groupofIdentifier, "gm")
    );
    /* for(let i=0;i<nonAnswerQue.length;i++){
      console.log("All data: ",nonAnswerQue[i]+"\n");
      } */
    //console.log("All data 1: ",nonAnswerQue[0]+"\n");
    //console.log("All data 2: ",nonAnswerQue[1]+"\n");
    /* var explaination = [],
      explainationJson = [];
    if (explainationWithHint) {
      explaination = readData.match(explainationWithHint);
      explainationJson = storeExplaination(explaination);
    }  */

    //main work ............................
    if (nonAnswerQue) {
      for (var n = 0; n < nonAnswerQue.length; n++) {
        //console.log("Tag data: ",nonAnswerQue[n])
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
            //console.log("All data: ",tempque);
            while (!tempque[this.outputResultIndex].match(/^##qe-([1-9])/gm)) {
              var que = this.readQuetions(
                tempque,
                new RegExp(configData.quePattern),
                new RegExp(configData.optPattern)
              );

              if (que.data.match(/<br>+$/gm)) {
                var removeBr = new RegExp(/<br>+$/, "gm");
                que.data = que.data.replace(removeBr, "");
              }
              //console.log("quetions is : ",que.data);
              var opt = this.readOptions(
                tempque,
                new RegExp(configData.quePattern),
                new RegExp(configData.optPattern)
              );
              //console.log("option is : ",opt);
              if (que && opt) {
                var options1 = this.spreadOption(opt, configData.optPattern);

                var optionArraywithID = [];
                for (var i = 0; i < options1.length; i++) {
                  optionArraywithID.push({ id: i + 1, text: options1[i] });
                }
                var remTagofquetions = que.data.replace(
                  new RegExp(configData.quePattern),
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

    //return this.nonAnsQuetions;
    return this.storeResult(this.nonAnsQuetions, configData);
  }

  storeResult(nonAnsQuetions, configData) {
    var outputResult2 = [];
    //console.log("Final output for without Answer"+nonAnsQuetions);
    for (var i = 0; i < nonAnsQuetions.length; i++) {
      for (var j = 0; j < nonAnsQuetions[i].que.length; j++) {
        outputResult2.push({
          type: "SINGLE",
          question: nonAnsQuetions[i].que[j].questions,
          // questionDelta: "",
          choices: nonAnsQuetions[i].que[j].choices,
          difficultyLevel: 1,
          // explanation: null,
          // explanationDelta: null,
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
    //console.log("temp log", result);
    var tempArr = "";
    var count = 0;
    //console.log("option pattern")
    for (; this.outputResultIndex < result.length; this.outputResultIndex++) {
      if (result[this.outputResultIndex].match(optPattern)) {
        tempArr += result[this.outputResultIndex];
        tempArr += "<br>";

        //console.log("option data: ",tempArr);
      } else if (
        result[this.outputResultIndex].match(quePattern) ||
        //result[this.outputResultIndex].match(ansPattern) ||
        result[this.outputResultIndex].match(/^##qe-([1-9])/gm)
      ) {
        //console.log("Else condition: ");
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
      //console.log("spreadOption data: ",splitArray[j]);
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
    //console.log("multiple answer and quetions 2: ", multiOption);
    //console.log("ide regex: ", answerData.idntPattern);
    var que, answer;
    var storeAnswerSet = [];
    for (var i = 0; i < multiOption.length; i++) {
      //console.log("multiple answer: ",multiOption[i]+"\n");
      var excePattern = new RegExp(/(\d+)[.]\s/gm);
      //console.log("exp: ",excePattern);
      var groupMatch = ([] = excePattern.exec(
        multiOption[i].match(excePattern)
      ));
      //console.log("Group exp: ",groupMatch);
      var que: any = groupMatch[1];
      excePattern = new RegExp(/([a-zA-Z])/gm);
      groupMatch = excePattern.exec(multiOption[i].match(excePattern));

      answer = groupMatch[1];

      var temp = { qno: que, ans: answer };

      storeAnswerSet.push(temp);
    }

    var TempStoreAnswer: any = { identifier: ide, answer: storeAnswerSet };

    this.nonAnsOptions.push(TempStoreAnswer);
    console.log("json: ",TempStoreAnswer);
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
