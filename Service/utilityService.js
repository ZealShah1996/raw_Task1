//importing modules from node js modules 
const server = require('http');
const fs = require('fs');
const path = require('path');

// Base directory of data folder
const baseDir = path.join(__dirname, '/../.data/');


//importing same file for accessing utility functions for processing.
const utilityService = require('./utilityService');


//importing function name from main index file for processing.
const serverRoutingFunction = require('./../server');


//#region server start region
//**
/*  Server Start.
 * @param {*} port:number(ex.8000)
 * @param {*} url:string(ex.localhost)
 * @param {*} options:objects(for future upgradation)
 * @return {*} void
 */
exports.serverStart = async (port, url = undefined, options = {}) => {
    //check that url is not empty string and is not empty object
    url = utilityService.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject(url) ? url : "127.0.0.1";
    //same as url check for port .
    port = utilityService.checkNotNullAndNotUndefined(port) ? port : 8000;
    return new Promise(async (resoleve, reject) => {
        try {
            //this will create new server using http.
            server.createServer(async (req, res) => {
                console.log("server started....");
                try {
                    //server is running successfull.
                    await serverRoutingFunction.serverRouting(req, res);
                    console.log("server execution is done");
                }
                catch (err) {
                    //servre is not running successfull.
                    console.log("server execution is done");
                    //writing to response why server is not running successfull
                    res.write(err.toString()); //write a response to the client
                    res.end(); //end the response
                }
            }).listen(port, url).on("connection", (server) => {
                console.log("Establishing connection to server");//on connection establishment verification.
            }).on("close", () => {
                console.log("Server is stoping...");//it will notifie that server is stopeed by some one.
            }).on("listening", () => {
                console.log("Server is listening...");//server is listening.
                console.log(`Server Started on http:\\${url}:${port}`);//notifiy server is started on this url and port.
                return resoleve(true);
            }).on("start", () => {
                console.log("Server is started...");

            });
        }
        catch (err) {
            //handling if server start faced some issues.
            return reject(err);
        }
    })
    //creating server using http module of node js

}
//#endregion

//#region check value is undefined or null or null string.
//**
 /* check that value shouldn't be undefined or null.
 * @param {*} val (ex.5,undefined,null)
 * @return {*} boolean (ex. true,false,false)
 */

exports.checkNotNullAndNotUndefined = val => {
    //there is function below which will check that value is null or not.
    let boolForNotNull = utilityService.checkNotNull(val);
    //this will check it should not undefined.
    let boolForNotNullolForNotUndefined = utilityService.checkNotUndefined(val);

    //both null boolean and undefined boolean needs to true
    if (boolForNotNull && boolForNotNullolForNotUndefined) {
        return true;
    }
    //it will return false in case of null and undefined.
    return false;
};

 /* 
 * check value shouldn't be null
 * @param {*} val (ex.5,null)
 * @return {*} boolean (ex. true,false)
 */
exports.checkNotNull = val => {
    if (["null"].indexOf(typeof val) == -1) {
        return true;
    }
    return false;
};

 /* 
 * check value shouldn't be undefined.
 * @param {*} val (ex.5,undefined)
 * @return {*} boolean (ex. true,false)
 */
exports.checkNotUndefined = val => {
    if (["undefined"].indexOf(typeof val) == -1) {
        return true;
    }
    return false;
};

 /* 
 * check value shouldn't be empty string or sholdn't be empty object.
 * @param {*} val (ex.5,undefined)
 * @return {*} boolean (ex. true,false)
 */
exports.checkNotEmptyStringAndNotEmptyObject = val => {
    //it will check that value shouldn't be empty string.
    let boolForNotEmptyString = utilityService.checkNotEmptyString(val);
    //it will check that value shouldn't be empty object.
    let boolForNotEmptyObject = utilityService.checkNotEmptyObject(val);
    //both bool above should be true.
    if (boolForNotEmptyString && boolForNotEmptyObject) {
        return true;
    }
    //it will send false default.
    return false;
};
 /* 
 * check value shouldn't be empty string 
 * @param {*} val (ex.5,"")
 * @return {*} boolean (ex. true,false)
 */
exports.checkNotEmptyString = val => {
    if (val != "") {
        return true;
    }
    return false;
};

 /* 
 * check value sholdn't be empty object. 
 * @param {*} val (ex.5,{})
 * @return {*} boolean (ex. true,false)
 */
exports.checkNotEmptyObject = val => {
    if (val != {}) {
        return true;
    }
    return false;
};

/* 
 * check value sholdn't be empty object or sholdn't be empty object or value shouldn't be undefined or null.
 * @param {*} val (ex.5,{},"",{})
 * @return {*} boolean (ex. true,false,false,false)
 */
exports.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject = val => {
    let boolForNotNull = utilityService.checkNotNullAndNotUndefined(val);
    let boolForNotNullolForNotUndefined = utilityService.checkNotEmptyStringAndNotEmptyObject(val);
    if (boolForNotNull && boolForNotNullolForNotUndefined) {
        return true;
    }
    return false;
};

//#endregion

//#region file operation
/*
 * 
 * @param {*} filePath (ex.filepath:-/home/zeal/my_experiments/REST_API_User/Service)
 * @param {*} fileOptions (future use)
 * @param {*} keyToCheck (ex.5(id));
 * @return {*} returnobject (ex.{ "exists": true, "data": { "id": 11,
            "name": "zeal fbnvbnvbnvbn",
            "age": 23 }, "DataWhichRead": alldatafromfile })
 */
exports.keyFind = async (filePath, fileOptions, keyToCheck, modelName) => {
    let returnObject = {};
    //parse json after reading data from file.
    let data = await utilityService.jsonParsing(await utilityService.fileRead(filePath, { encoding: 'utf-8', flag: 'r+' }));

    //fileter specific key id fromlist of array using filterArray function.
    let existData = await utilityService.filterArray(data[modelName], [keyToCheck]);

    //check that exist data is there or not if it is acceptable data then return exists true else false. 
    if (utilityService.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject(existData)) {
        returnObject = { "exists": true, "data": existData, "DataWhichRead": data };
        return returnObject;
    }
    else {
        //return false if exist data is not acceptable.
        returnObject = { "exists": false, "data": null, "DataWhichRead": data };
        return returnObject;
    }
}

//**
 /* file read from directory 
 * @param {*} filePath (ex.filepath:-/home/zeal/my_experiments/REST_API_User/Service.)
 * @param {*} fileReadOptions (for future use.)
 *  @return {*} data (ex.data of specific file.)
 */
exports.fileRead = async (filePath, fileReadOptions) => {
    //verify that file read options are acceptable.
    fileReadOptions = utilityService.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject(fileReadOptions) ? fileReadOptions : { encoding: 'utf-8', flag: 'w+' };
    return new Promise((resolve, reject) => {
        try {
            //promise for asyncronas process with filepath provided.
            fs.readFile(filePath, fileReadOptions, (err, data) => {
                if (err) {
                    console.log(`error:${JSON.stringify(err)}`);
                    throw new Error(err.message);
                }
                else {
                    return resolve(data);
                }
            });
        }
        catch (err) {
            return reject(err);
        }
    });
}


 /* file read from directory 
 * @param {*} filePath (ex.filepath:-/home/zeal/my_experiments/REST_API_User/Service.)
 * @param {*} primaryKey (ex. id)-Name of field which will be primary key.
 * @param {*} alreadyAddedData(ex. listofaddeddata)-already fetched data for key check so passed from it.
 * @param {*} data (ex. data needed to add/update)-data which needed to add or update.
 * @param {*} fileAppendOptions (for future use.)
 * @return {*} returnObject.
 */
exports.appendData = async (filePath, primaryKey, alreadyAddedData, data, fileAppendOptions, modelName) => {
    try{
    //verify taht file added options are acceptable.
    fileAppendOptions = utilityService.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject(fileAppendOptions) ? fileAppendOptions : { encoding: 'utf-8', flag: 'r+' };
  
  //if file append options.update is true that means it is update request other wise it is add request.
    if (fileAppendOptions.Update) {
        let oldValue;
        //performing update.
        let datatoreturn=alreadyAddedData[modelName].map((value, index) => {
            if (value.id == data.id) {
                oldValue=value;
                value=data;
                return value;
            }
            return value;
        });
        //assigning request output values like operation performed properly or not and count of data which is added in file.
        returnObject = { "Update Performed": true, "oldData": oldValue, "finalCoutOfRecords": alreadyAddedData[modelName].length != undefined ? alreadyAddedData[modelName].length : 0 };
        alreadyAddedData[modelName]=datatoreturn;
        console.log(datatoreturn);
    }
    else {
        if(!utilityService.checkNotUndefined(alreadyAddedData[modelName])){
              //data add
            alreadyAddedData[modelName]=[];
            alreadyAddedData[modelName].push(data);
          
        }
        else{
        //performing create request.
        alreadyAddedData[modelName][alreadyAddedData[modelName].length] =
            data;
        }
        
            returnObject = { "Create Performed": true, "addeddata": data, "finalCoutOfRecords": alreadyAddedData[modelName].length != undefined ? alreadyAddedData[modelName].length : 0 };
    }

    //after processing update/create request it will write changes to file.
    let appendData = await utilityService.writeFile(filePath, JSON.stringify(alreadyAddedData), fileAppendOptions);
    //confirmation to condole.
    console.log("DataUpdate is success full:" + true);
    //returning objects to call.
    return returnObject;
}
catch(err){
    return [];
}
}

//**
 /* file write. 
 * @param {*} filePath (ex.filepath:-/home/zeal/my_experiments/REST_API_User/Service.)
 * @param {*} data (ex.data which needed to write)
 * @param {*} writeFileOptions (for future use.)
 *  @return {*} data (ex.writetten data.)
 */
exports.writeFile = async (filePath, data, writeFileOptions) => {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFile(filePath, data, function (err) {
                if (err) {
                    console.log(`error:${JSON.stringify(err)}`);
                    throw err;
                }
                else {
                    console.log('Saved!');
                    return resolve(data);
                }
            });
        }
        catch (err) {
            return reject(err);
        }
    });
}

//**
 /* create file path from given perameters
 * @param {*} dir (ex. zeal)
 * @param {*} filename (ex. user)
 * @param {*} filetype (ex. json)
 * @return {*} file path from base dir.
 */
exports.createFilePath = async (dir, filename, filetype) => {
    let deaultFolderPath = `${baseDir}${dir}${filename}.${filetype}`;
return new Promise((resolve,reject)=>{
    checkForFile(deaultFolderPath,()=>{
        return resolve(deaultFolderPath);
       });
})
  
    
}

//checks if the file exists. 
//If it does, it just calls back.
//If it doesn't, then the file is created.
function checkForFile(fileName,callback)
{
    fs.exists(fileName, function (exists) {
        if(exists)
        {
            callback();
        }else
        {
            fs.writeFile(fileName, "",{flag: 'wx'}, function (err, data) 
            { 
                callback();
            })
        }
    });
}


//**
 /* prevent error of not acceptable json.
 * @param {*} string (ex. string to be parsed)
 * @param {*} defaultValuePassed (ex. if json is not acceptable then what should return.)
 * @return {*} existData. -Parsed data.
 */
exports.jsonParsing = async (string, defaultValuePassed = {}) => {
    let existData = string;
    try{
    if (typeof (string) == "string") {
        existData = utilityService.checkNotEmptyStringAndNotEmptyObject(string) ? JSON.parse(string) : defaultValuePassed;
    }
    return existData;
}
catch(err){
    return {};
}
}

 //**
  /* find all data in main file.
  * @param {*} filePath (ex. string to be parsed)
  * @param {*} condition (for future use.)
  * @param {*} modelName (model name means table name.)
  * @return {*} retrunObject. -return object which contains data to show from files.
  */
exports.findAllData = async (filePath, modelName,condition={}) => {
    let retrunObject = {};
    //reading file
    let data = await utilityService.fileRead(filePath, { encoding: 'utf-8', flag: 'r+' });

    //checking condition should not be emty object.
    if (condition != {}) {
        //parsing data which passed.
         let temp=await utilityService.jsonParsing(data,[]);
         //assigning data in replay object.
         retrunObject["data"] =utilityService.checkNotNullAndNotUndefined(temp[modelName])?temp[modelName]:'';
         //attaching condition.
         retrunObject["data"]["condition"] = condition;
         
        return retrunObject;
    }
    //executing get all entries from file.
    else {
         //parsing data which passed.
        let temp=await utilityService.jsonParsing(data);
        //assigning data in replay object.
        retrunObject["data"] =temp[modelName];
        return retrunObject;
    }
}

//**
  /* @description ids passed needs to delete.
  * @function deleteData(filePath,condition,modelName)
  * @param {String} filePath (ex. string to be parsed)
  * @param {Array} ids ()
  * @param {String} modelName (model name means table name.)
  * @return {Array} retrunObject. -return object which contains data to show from files.
  */
 exports.deleteData = async (filePath,ids,modelName) => {
    let retrunObject = {};
    //reading file
    let data = await utilityService.fileRead(filePath, { encoding: 'utf-8', flag: 'r+' });

    //checking condition should not be emty object.
    if (ids.length!=0) {
        //parsing data which passed.
         let temp=await utilityService.jsonParsing(data);
         temp[modelName]=await utilityService.deleteFromArray(temp[modelName],ids);
         //assigning data in replay object.
         retrunObject["data"] =temp[modelName];
         
        //after processing update/create request it will write changes to file.
        let appendData = await utilityService.writeFile(filePath, JSON.stringify(temp), {});
        return retrunObject;
    }
    //executing get all entries from file.
    else {
         //parsing data which passed.
        let temp=await utilityService.jsonParsing(data);
        //assigning data in replay object.
        retrunObject["data"] =temp[modelName];
        retrunObject["message"]="Nothing deleted."
        return retrunObject;
    }
       
}



exports.filterArray = async (arrayOfObjects, ids) => {
try{
    let returnListOfObjects = arrayOfObjects.filter((element) => {
        if (ids.indexOf(element.id) > -1) {
            return element;
        }
    });
    return returnListOfObjects;
}
catch(err){
    return arrayOfObjects;
}
}


exports.deleteFromArray=async (arrayOfObjects,ids)=>{
    if(arrayOfObjects.length<1){
        return [];
    }
    let returnListOfObjects = arrayOfObjects.filter((element) => {
        if (ids.indexOf(element.id)==-1) {
            return element;
        }
    });
    return returnListOfObjects;
}



//#endregion

//#region  for replaying data

exports.responseSendBack = async (object) => {
    let responseObjectString = {};
    let listOfObjects = ["data", "error","message"];
    listOfObjects.forEach((element) => {
        let bool = utilityService.checkKeyEsixtsInObject(object, element);
        if (bool) {
            responseObjectString[element] = object[element];
        }
    });
    return JSON.stringify(responseObjectString);
    // responseObjectString["error"]=
}

exports.checkKeyEsixtsInObject = (object, key) => {
    let boolKeyExists = utilityService.checkNotNullAndNotUndefined(object[key]);
    return boolKeyExists;
}
//#endregion

//#region Unit test utility function
exports.payLoadCreate= (payloadObject)=>{
payloadObject={"id":9,"name":"zeal shah","age":79};
console.log(payloadObject);
return payloadObject;
}
//#endregion