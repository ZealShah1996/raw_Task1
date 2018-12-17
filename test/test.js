var assert = require('assert');
var expect = require('chai').expect;
var severStart=require('./../server');
var fileRead=require('./../Service/utilityService').fileRead;
//const utilityService = require('./../Service/utilityService');
var request = require('supertest');
var baseUrl="http://localhost:8000/";
var filePath='/home/zeal/my_experiments/REST_API_User/.data/user.json';
const jsonparse=require('./../Service/utilityService').jsonParsing;
//const console.log=require('../Service/debugService').console;



//#region check all get all user url.
describe('Get All Check', function() {
    container = request(baseUrl+'user/getAll');
    //request must return 200 in return when call.
    it('Must Have Status Code return 200.', function(done) {
      container
        .get('')
        .expect(function(res){
            //console.log(res);
        })
        .expect(200, done);
    });
//data get from url need to match with response data.
    it('data needed to match with db', function(done) {
        container
          .get('')
          .expect(async function(res){
            let data=await jsonparse(await await fileRead(filePath,{ encoding: 'utf-8', flag: 'r+' }));
              console.log(data["user"]);
              console.log(res.body.data);
              console.log(JSON.stringify(res.body.data)==JSON.stringify(data["user"]));
              if(JSON.stringify(res.body.data)==JSON.stringify(data["user"])){
             return true;
              }
              else{
                throw new Error('Missing pagination information and hypermedia controls');
              }
          })
          .expect(200, done);
      });

//data needs to present in response
      it('data needed to be present ', function(done) {
        container
          .get('')
          .expect(/data/)
          .expect(200, done);
      });

  });

//#endregion


