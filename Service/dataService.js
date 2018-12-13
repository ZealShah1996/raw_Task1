//importing same file for accessing utility functions for processing.
const utilityService = require('./utilityService');
const jsonParse = require('./utilityService').jsonParsing;


//**
 /* add/update data in database.
 * @param {*} req :-req object of http module.
 * @param {*} res:-res object of http module.
 * @return {*} res :-response to request.
 */
exports.addUpdateData = async (req,res) => {
    try {
        //primary key assignmenet for temporay purpose we can change it and make it dynamic also.
        let primaryKey="id";
        //same as primary key.
        let modelName="user";
        let data={};
        //checking req has payload or not.
        try{
            data=(await jsonParse(req.data)).payload;
        }
        //if data has and not pasable then it will give error.
        catch(err){
            throw new Error('passed data is not perfect format.')
        }
        //if primary key is not metioned then it will give error.
        if (primaryKey != null) {
            //file path create dynamic using function.
            let filePath = await utilityService.createFilePath('', modelName, 'json');
            //read data from file and making key search out put.
            let readData = await utilityService.keyFind(filePath, {}, data[primaryKey],modelName);
            //checking based on key is there any data avaiable or not.
            if (!readData.exists ) {
                if(req.url.split('/').indexOf('add')==-1){
                    let error= new Error("wrong request.");
                    error["statusCode"]=422;
                    throw error;
                }
                //no then add it in db file.
                let datatoPassedBack=await utilityService.appendData(filePath, primaryKey, readData.DataWhichRead,data,{"Update":false},modelName);
                return {"data":datatoPassedBack,"statuscode":201};
            } else{
                if(req.url.split('/').indexOf('update')==-1){
                    let error= new Error("wrong request.");
                    error["statusCode"]=422;
                    throw error;
                }
                //yes then go for update.
                let datatoPassedBack=await utilityService.appendData(filePath, primaryKey,readData.DataWhichRead,data,{"Update":true},modelName);
                return {"data":datatoPassedBack,"statuscode":200};
            }
        }
        else {
            //if primary key is not assigned.
            throw new Error(`Primary key Value Name is needed for adding data db.`);
        }
    }
    catch (err) {
        return {"error":`Data Add/Update in db is not processed. message:-${err.message} StackTrace:-${err.stack}`,"statuscode":err.statusCode!=null?err.statusCode:400};
       // throw new Error();
    }
}

//**
 /* get all data from database.
 * @param {*} req :-req object of http module.
 * @param {*} res:-res object of http module.
 * @return {*} res :-response to request.
 */
exports.GetAll = async (req,res) => {
    try {
         //primary key assignmenet for temporay purpose we can change it and make it dynamic also.
        let primaryKey="id";
         //same as primary key.
        let modelName="user";
        
        if (primaryKey != null) {
              //file path create dynamic using function.
        let filePath = await utilityService.createFilePath('', modelName, 'json');
        //getting all data from utiliservice's find all data .
            let dataGetFromJson = await utilityService.findAllData(filePath,modelName);
            return dataGetFromJson;
        }
        else {
            throw new Error(`Primary key Value Name is needed for adding data db.`);
        }
    }
    catch (err) {
        return {"error":`Data Add in db is not processed. message:-${err.message} StackTrace:-${err.stack}`,"statuscode":404};
       // throw new Error(`Data Add in db is not processed.\n message:-${err.message}\n StackTrace:-${err.stack}`);
    }
}


//**
 /* delete data from database.
 * @param {*} req :-req object of http module.
 * @param {*} res:-res object of http module.
 * @return {*} res :-response to request.
 */
exports.delete = async (req,res) => {
    try {
         //primary key assignmenet for temporay purpose we can change it and make it dynamic also.
        let primaryKey="id";
         //same as primary key.
        let modelName="user";
        
        if (primaryKey != null) {
              //file path create dynamic using function.
        let filePath = await utilityService.createFilePath('', modelName, 'json');
        //delete data based on array passed.
            let dataGetFromJson = await utilityService.deleteData(filePath,[req.id],modelName);
           
            return dataGetFromJson;
        }
        else {
            throw new Error(`Primary key Value Name is needed for adding data db.`);
        }
    }
    catch (err) {
        return {"error":`Data Add in db is not processed. message:-${err.message} StackTrace:-${err.stack}`,"statuscode":404};
       // throw new Error(`Data Add in db is not processed.\n message:-${err.message}\n StackTrace:-${err.stack}`);
    }
}


