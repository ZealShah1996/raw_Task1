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
exports.serverStart = async (port, url, options) => {
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
                    res.write('Hello World!'); //write a response to the client
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

exports.keyFind = async (filePath, fileOptions, keyToCheck) => {
    fs.readFile(filePath, { encoding: 'utf-8', flag: 'r' }, (err, data) => {
        if (err) {
            console.log(`error:${JSON.stringify(err)}`);
            throw new Error(err.message);
        }
        else {
            let keyData = JSON.parse(data)[keyToCheck];
            return keyData;
        }
    });
}

exports.createFilePath = async (dir, filename, filetype) => {
    let deaultFolderPath = `${baseDir}${dir}${filename}.${filetype}`;
    return deaultFolderPath;
}

//#endregion