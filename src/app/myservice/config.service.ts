import { Injectable } from "@angular/core";

@Injectable()
export class ConfigService {
  questionCount = 0;
  constructor() {}
  //result;
  //qno = [];
  //questionNumber = [];
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

  answerRegex = {
    "Ans.": "Ans:",
    "answer": "answer",
    "=>": "=>.+",
    "ans:":"ans: "
  };

  ansIdtRegex = {
    "1. (a)": "(\\d+)\\.\\s\\(([a-d])\\)",
    "1. (A)": "(\\d+)\\.\\s\\(([A-D])\\)",
    "1. (a) or 1. (A)": "(\\d+)\\.\\s\\(([a-dA-D])\\)",
    "1. a": "(\\d+)\\.\\s([a-d])",
    "1. A": "(\\d+)\\.\\s([A-D])",
    "1. a or 1. A": "(\\d+)\\.\\s([a-dA-D])",
    "(1) (a)": "\\((\\d+)\\)\\s\\(([a-d])\\)",
    "(1) (A)": "\\((\\d+)\\)\\s\\(([A-D])\\)",
    "(1) (a) or (1) (A)": "\\((\\d+)\\)\\s\\(([a-dA-D])\\)",
    "(1) a": "\\((\\d+)\\)\\s([a-d])",
    "(1) A": "\\((\\d+)\\)\\s([A-D])",
    "(1) a or (1) A": "\\((\\d+)\\)\s([a-dA-D])",
    "1. (1)":"(\\d+)\\.\\s\\(([1-5])\\)",
    "groupofIdentifier":
      "(##qs-(\\d+)([\\s\\S]*?)##qe-\\d+)|(##os-(\\d+)([\\s\\S]*?)##oe-\\d+)",
      "explainationWithHint" : "(##es([\\s\\S]*?)##ee+)"
  };
  quetionsRegex = {
    "(1)": "^\\((\\d+)\\)\\s",
    "1.": "^(\\d+)[.]"
  };
  optionRegex = {
    "(a)": "[(][a-d][)]",
    "(A)": "[(][A-D][)]",
    "(a) or (A)": "[(][a-dA-D][)]",
    "a)":"[a-d][)]",
    "A)":"[A-D][)]",
    "a) or A)":"[a-dA-D][)]",
    "(1)":"[(][1-5][)]"
  };
}
