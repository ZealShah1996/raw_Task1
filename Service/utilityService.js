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
exports.serverStart = async (port, url = undefined, options = {}) => {
    url = utilityService.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject(url) ? url : "127.0.0.1";
    port = utilityService.checkNotNullAndNotUndefined(port) ? port : 8000;
    return new Promise(async (resoleve, reject) => {
        try {
            server.createServer(async (req, res) => {
                console.log("server started....");
                try {
                    await serverRoutingFunction.serverRouting(req, res);
                    console.log("server execution is done");
                }
                catch (err) {
                    console.log("server execution is done");
                    res.write(err.toString()); //write a response to the client
                    res.end(); //end the response
                }
            }).listen(port, url).on("connection", (server) => {
                console.log("Establishing connection to server");
            }).on("close", () => {
                console.log("Server is stoping...");
            }).on("listening", () => {
                console.log("Server is listening...");
                console.log(`Server Started on http:\\${url}:${port}`);
                return resoleve(true);
            }).on("start", () => {
                console.log("Server is listening...");

            });
        }
        catch (err) {
            return reject(err);
        }
    })
    //creating server using http module of node js

}
//#endregion

//#region check value is undefined or null or null string.


exports.checkNotNullAndNotUndefined = val => {
    let boolForNotNull = utilityService.checkNotNull(val);
    let boolForNotNullolForNotUndefined = utilityService.checkNotUndefined(val);
    if (boolForNotNull && boolForNotNullolForNotUndefined) {
        return true;
    }
    return false;
};

exports.checkNotNull = val => {
    if (["null"].indexOf(typeof val) == -1) {
        return true;
    }
    return false;
};

exports.checkNotUndefined = val => {
    if (["undefined"].indexOf(typeof val) == -1) {
        return true;
    }
    return false;
};


exports.checkNotEmptyStringAndNotEmptyObject = val => {
    let boolForNotEmptyString = utilityService.checkNotEmptyString(val);
    let boolForNotEmptyObject = utilityService.checkNotEmptyObject(val);
    if (boolForNotEmptyString && boolForNotEmptyObject) {
        return true;
    }
    return false;
};

exports.checkNotEmptyString = val => {
    if (val != "") {
        return true;
    }
    return false;
};

exports.checkNotEmptyObject = val => {
    if (val != {}) {
        return true;
    }
    return false;
};


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
 * @param {*} filePath 
 * @param {*} fileOptions 
 * @param {*} keyToCheck 
 */
exports.keyFind = async (filePath, fileOptions, keyToCheck, modelName) => {
    let returnObject = {};
    let data = await utilityService.jsonParsing(await utilityService.fileRead(filePath, { encoding: 'utf-8', flag: 'r' }));

    let existData = await utilityService.filterArray(data[modelName], [keyToCheck]);
    if (utilityService.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject(existData)) {
        returnObject = { "exists": true, "data": existData, "DataWhichRead": data };
        return returnObject;
    }
    else {
        returnObject = { "exists": false, "data": null, "DataWhichRead": data };
        return returnObject;
    }
}

exports.fileRead = async (filePath, fileReadOptions) => {
    fileReadOptions = utilityService.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject(fileReadOptions) ? fileReadOptions : { encoding: 'utf-8', flag: 'w' };
    return new Promise((resolve, reject) => {
        try {
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

exports.appendData = async (filePath, primaryKey, alreadyAddedData, data, fileAppendOptions, modelName) => {
    fileAppendOptions = utilityService.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject(fileAppendOptions) ? fileAppendOptions : { encoding: 'utf-8', flag: 'r+' };
    if (fileAppendOptions.Update) {
        // let existData = await utilityService.filterArray(alreadyAddedData[modelName],[data.id]);
        // if(existData!=null){
        //     alreadyAddedData[modelName][data.id]=data;
        // }
        let oldValue;
        let datatoreturn=alreadyAddedData[modelName].map((value, index) => {
            if (value.id == data.id) {
                oldValue=value;
                value=data;
               
                return value;
            }
            return value;
        });
        returnObject = { "Update Performed": true, "oldData": oldValue, "finalCoutOfRecords": alreadyAddedData[modelName].length != undefined ? alreadyAddedData[modelName].length : 0 };
        alreadyAddedData[modelName]=datatoreturn;
        console.log(datatoreturn);
    }
    else {
        alreadyAddedData[modelName][alreadyAddedData[modelName].length] =
            data;
            returnObject = { "Create Performed": true, "addeddata": data, "finalCoutOfRecords": alreadyAddedData[modelName].length != undefined ? alreadyAddedData[modelName].length : 0 };
    }
    let appendData = await utilityService.writeFile(filePath, JSON.stringify(alreadyAddedData), fileAppendOptions);
    console.log("DataUpdate is success full:" + true);
    
    return returnObject;
}


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


exports.createFilePath = async (dir, filename, filetype) => {
    let deaultFolderPath = `${baseDir}${dir}${filename}.${filetype}`;
    return deaultFolderPath;
}


exports.jsonParsing = async (string, defaultValuePassed = {}) => {
    let existData = string;
    if (typeof (string) == "string") {
        existData = utilityService.checkNotEmptyStringAndNotEmptyObject(string) ? JSON.parse(string) : defaultValuePassed;
    }
    return existData;
}

exports.objectStringfy = async (object) => {

}

exports.findAllData = async (filePath, condition,modelName) => {
    let retrunObject = {};
    let data = await utilityService.fileRead(filePath, { encoding: 'utf-8', flag: 'r' });
    retrunObject["condition"] = condition;
    if (condition != {}) {
         let temp=await utilityService.jsonParsing(data);
         retrunObject["data"] =temp[modelName];
        return retrunObject;
    }
    else {
        let temp=await utilityService.jsonParsing(data);
        retrunObject["data"] =temp[modelName];
        return retrunObject;
    }
}

exports.filterArray = async (arrayOfObjects, ids) => {
    let returnListOfObjects = arrayOfObjects.filter((element) => {
        if (ids.indexOf(element.id) > -1) {
            return element;
        }
    });
    return returnListOfObjects;
}



//#endregion


//#region region for replaying data

exports.responseSendBack = async (object) => {
    let responseObjectString = {};
    let listOfObjects = ["data", "statusCode", "error", "message"];
    listOfObjects.forEach((element) => {
        let bool = utilityService.checkKeyEsixtsInObject(object, element);
        if (bool) {
            responseObjectString[element] = object[element];
        }
        else {
            responseObjectString[element] = "";
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