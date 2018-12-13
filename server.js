
//importing modules from node js modules 

const querystring = require('querystring');
var StringDecoder = require('string_decoder').StringDecoder;
const url=require('url');

//importing same file for accessing utility functions for processing.
const utilityService = require('./Service/utilityService');
const dataService = require('./Service/dataService');
const replay = require('./Service/utilityService').responseSendBack;
const keyExists = require('./Service/utilityService').checkKeyEsixtsInObject;

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
    try {
        //using to getting data passed in req 
        var decoder = new StringDecoder('utf-8');
        var perameters=req.url.toString();
        req["url"]=url.parse(req.url,true).href;
        var buffer = '';
        //if data passed event call then write in buffer with utf-8 encoding.
        req.on("data", (data) => {
            buffer += decoder.write(data);
        });

        //after completion of data passing event do all process we want because now we have all data we needed.
        req.on('end', async () => {
            //free decoding object.
            buffer += decoder.end();
            //assigning data attribute to request from buffer.
            req["data"] = buffer;

            req["id"]=parseInt(perameters.slice(perameters.lastIndexOf('/')+1,perameters.lastIndexOf('?')!=-1?perameters.lastIndexOf('?'):perameters.length));
            req["url"]=req["url"].replace(`/${req["id"]}`,'');
            //set content type to request
            res.setHeader('Content-Type', 'application/json');
            
            console.log(req);
            //finding handler function where it will go next.
            var chosenHandler = typeof (req["url"]) !== 'undefined' ? handlers[req["url"]] : handlers.notFound;
            //if any handler is avaiable then it will continue process.
            if (utilityService.checkNotNullAndNotUndefined(chosenHandler)) {
                //executing handler.
                let responseObject = await chosenHandler(req, res);
                //write status code default 200.
                res.writeHead(utilityService.checkNotNullAndNotUndefined(responseObject["statuscode"])?responseObject["statuscode"]:200);
                //writing resposne in proper format for response return.
                res.write(await replay(responseObject));
                //ending response.
                res.end();
            }
            else {
                let responseObject = {};
                //route dosen't found error.
                responseObject["error"] = "No rotes found.";
                res.writeHead(404);
                  //writing resposne in proper format for response return.
                res.write(await replay(responseObject));
                 //ending response.
                res.end();
            }
        });
    
    }
    catch (err) {
        //writing error in response.
        res.write(err);
        //ending response.
        res.end();
    }
    //write a response to the client
    //end the response
};


//**
 /* assigning routes for user.
 */
let handlers = {};
handlers['/user/getAll'] = dataService.GetAll;
handlers["/user/update"] = dataService.addUpdateData;
handlers["/user/add"] = dataService.addUpdateData;
handlers["/user/delete"]=dataService.delete;

