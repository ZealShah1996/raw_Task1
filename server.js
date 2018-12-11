
//importing modules from node js modules 

const querystring = require('querystring');


//importing same file for accessing utility functions for processing.
const utilityService=require('./Service/utilityService');

//server start on specific port and url provided in function.
//***(port,url,options?={}) */
utilityService.serverStart(8000,"10.1.6.30",{}).then(serverStart=>{
    //if server start is true means server is started..
    console.log(`serverStart ${serverStart}`);
}).catch(Error=>{
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
exports.serverRouting= async (req,res)=>{
    let filePath=await utilityService.createFilePath('','user','json');
    let data=await utilityService.keyFind(filePath,{},1);
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
};

