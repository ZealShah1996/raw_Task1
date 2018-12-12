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
            if (!readData.exists) {
                //no then add it in db file.
                let datatoPassedBack=await utilityService.appendData(filePath, primaryKey, readData.DataWhichRead,data,{"Update":false},modelName);
                return {"data":datatoPassedBack};
            } else {
                //yes then go for update.
                let datatoPassedBack=await utilityService.appendData(filePath, primaryKey,readData.DataWhichRead,data,{"Update":true},modelName);
                return {"data":datatoPassedBack};
            }
        }
        else {
            //if primary key is not assigned.
            throw new Error(`Primary key Value Name is needed for adding data db.`);
        }
    }
    catch (err) {
        throw new Error(`Data Add in db is not processed.\n message:-${err.message}\n StackTrace:-${err.stack}`);
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
            let dataGetFromJson = await utilityService.findAllData(filePath, {},modelName);
            return dataGetFromJson;
        }
        else {
            throw new Error(`Primary key Value Name is needed for adding data db.`);
        }
    }
    catch (err) {
        throw new Error(`Data Add in db is not processed.\n message:-${err.message}\n StackTrace:-${err.stack}`);
    }
}