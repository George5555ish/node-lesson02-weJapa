//http module for API CALL
const https = require("https");

//file system module to create a new file.
const fs = require("fs");

//GET REQUEST
https
  .get("https://coderbyte.com/api/challenges/json/json-cleaning", (res) => {
    let data = "";

    res.on("data", (finalData) => {
      data += finalData;
    });

    res.on("end", () => {
      let url = JSON.parse(data);

      //For-Loop to clean the Parsed JSON
      for (let [key, value] of Object.entries(url)) {
        if (typeof value === "object" && Array.isArray(value) === false) {
          //Conditions for nested Objects
          for (let [subKey, subValue] of Object.entries(value)) {
            if (subValue == "" || subValue == "N/A" || subValue == "-") {
              delete value[subKey];
            }
          }

          //Conditions for Arrays
        } else if (Array.isArray(value)) {
          var newArray = [];
          const secondUrl = url[key];

          for (var i = 0; i < secondUrl.length; i++) {
            if (
              secondUrl[i] === "-" ||
              secondUrl[i] === "N/A" ||
              secondUrl[i] === ""
            ) {
              secondUrl.splice(value.indexOf(secondUrl[i]), 1);
            }
          }
        } else {
          const filterCondition = value == "-" || value == "N/A" || value == "";

          if (filterCondition) {
            delete url[key];
          }
        }
      }

      var fileToSend = url;

      var finalText = "";

      console.log(fileToSend);

      //For-Loop to display cleaned code correctly in new file
      for (let [key, value] of Object.entries(fileToSend)) {
        if (typeof value === "object" && Array.isArray(value) === false) {
          finalText = finalText + ` ${key}: `;

          for (let [subKey, subValue] of Object.entries(value)) {
            finalText = finalText + `{ ${subKey}: ${subValue} }`;
          }
        } else if (Array.isArray(value)) {
          finalText = finalText + `{ ${key}: [ ${value} ] }`;
        } else {
          finalText = finalText + ` { ${key}: ${value} }`;
        }
      }

      //File System module to create new file.
      fs.writeFile("cleanJson.js", finalText, function (err) {
        console.log("Data saved to new File");
      });
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
