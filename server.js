
//importing modules from node js modules 

const querystring = require('querystring');
var StringDecoder = require('string_decoder').StringDecoder;

//importing same file for accessing utility functions for processing.
const utilityService = require('./Service/utilityService');
const dataService = require('./Service/dataService');
const replay=require('./Service/utilityService').responseSendBack;
const keyExists=require('./Service/utilityService').checkKeyEsixtsInObject;

//server start on specific port and url provided in function.
//***(port,url,options?={}) */
utilityService.serverStart(8000, undefined, {}).then(serverStart => {
    //if server start is true means server is started..
    console.log(`serverStart ${serverStart}`);
}).catch(Error => {
    console.log(Error);
});


//server routing happened from this function but refrence in utility function.
//  path:-/Service/utilityService.js 
//  line_no:-20 
//**
/* 
* @param {*} req:request from client. 
* @param {*} res:response to client.
*/
exports.serverRouting = async (req, res) => {
    // let filePath=await utilityService.createFilePath('','user','json');
    // let data=await utilityService.keyFind(filePath,{},1);
    try {
        // let dataAddedOrUpdate=await dataService.addUpdateData({
        //     "id": 7,
        //     "name": "ze",
        //     "age": 29
        // }, "id", {}, "user");
        // let data= await dataService.GetAll("id","user");
        // res.write(JSON.stringify({"addedData":dataAddedOrUpdate}));
        // res.write(JSON.stringify({"all data":data}));
        // Get the payload,if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
        req.on("data",(data)=>{
            buffer += decoder.write(data);
        });
        req.on('end', async ()=>{
            buffer += decoder.end();
            req["data"]=buffer;
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            console.log(req);
            var chosenHandler = typeof(req["url"]) !== 'undefined' ? handlers[req["url"]] : handlers.notFound;
         if(utilityService.checkNotNullAndNotUndefined(chosenHandler)){
            let responseObject=await chosenHandler(req,res);
            res.write(await replay(responseObject));
            res.end();
         }
         else{
            let responseObject={};
            responseObject["error"]="No rotes found.";
            res.write(await replay(responseObject));
            res.end(); 
         }
        });
    }
    catch (err) {
        res.write(err);
        res.end();
    }
    //write a response to the client
     //end the response
};

let handlers={};
handlers['/user/getAll']=dataService.GetAll;
handlers["/user/update"]=dataService.addUpdateData;
handlers["/user/add"]=dataService.addUpdateData;

