//importing same file for accessing utility functions for processing.
const utilityService = require('./utilityService');
const jsonParse = require('./utilityService').jsonParsing;



exports.addUpdateData = async (req,res) => {
    try {
        let primaryKey="id";
        let modelName="user";
        let data={};
        try{
            data=(await jsonParse(req.data)).payload;
        }
        catch(err){
            throw new Error('passed data is not perfect format.')
        }
        
        if (primaryKey != null) {
            let filePath = await utilityService.createFilePath('', modelName, 'json');
            let readData = await utilityService.keyFind(filePath, {}, data[primaryKey],modelName);
            if (!readData.exists) {
                let datatoPassedBack=await utilityService.appendData(filePath, primaryKey, readData.DataWhichRead,data,{"Update":false},modelName);
                return {"data":datatoPassedBack};
            } else {
                let datatoPassedBack=await utilityService.appendData(filePath, primaryKey,readData.DataWhichRead,data,{"Update":true},modelName);
                return {"data":datatoPassedBack};
            }
        }
        else {
            throw new Error(`Primary key Value Name is needed for adding data db.`);
        }
    }
    catch (err) {
        throw new Error(`Data Add in db is not processed.\n message:-${err.message}\n StackTrace:-${err.stack}`);
    }
}


exports.GetAll = async (req,res) => {
    try {
        let primaryKey="id";
        let modelName="user";
        let filePath = await utilityService.createFilePath('', modelName, 'json');
        if (primaryKey != null) {
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