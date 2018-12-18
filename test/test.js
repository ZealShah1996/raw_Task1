//#region importing important modules.
var assert = require('assert');
var expect = require('chai').expect;
var severStart = require('./../server');
var fileRead = require('./../Service/utilityService').fileRead;
//const utilityService = require('./../Service/utilityService');
var request = require('supertest');
var baseUrl = "http://localhost:8000/";
var filePath;
const jsonparse = require('./../Service/utilityService').jsonParsing;
const payLoadCreator = require('./../Service/utilityService').payLoadCreate;
const nullOrUndefind = require('./../Service/utilityService').checkNotNullAndNotUndefined;
const utilityService = require('./../Service/utilityService');
//const console.log=require('../Service/debugService').console;
//#endregion

//#region check Create Method 
describe("\r\n Expect:Success||Create Operation Check", function () {
  createContainer = request(baseUrl + 'user/add');
  let data = {
    "id": 806, "name": "zeal shah", "age": 79
  }
  //request must return 201 in response.
  it('Expect:Success||Create request of user Must Have Status Code return 201.', (done) => {
    createContainer
      .post('')
      .send({ "payload": data })
      .expect(201, done);
  });

//it will check that it should send error when user try to add with same id.(primary key should not be same.)
  it('Expect:Failed||Create request of user Must Have Status Code return 422 because of same user creation is not allowed.', (done) => {
    createContainer
      .post('')
      .send({ "payload": data })
      .expect((res) => {
        attachingSpecialCharacterWithMiddle(JSON.parse(res.text).error, '!', 100, '\x1b[31m');
      })
      .expect(422, done);
  });

  //it will check after delete file's all entry it should add new entry when we request for it.(first entry check)
  it('Expect:Success||Create request when file is deleted.', async () => {
    filePath=await utilityService.createFilePath('','user', 'json');
    let readData = await jsonparse(await fileRead(filePath, { encoding: 'utf-8', flag: 'r+' }));
    let listOfUser = [];
    readData['user'].forEach(element => {
      listOfUser.push(element.id);
    });
    
    await utilityService.deleteData(filePath, listOfUser, 'user');
    await createContainer
      .post('')
      .send({ "payload": data })
      .expect(201);
  });

}).beforeAll(() => {
  attachingSpecialCharacterWithMiddle(`Start Create Operation Check`, '=', 100);
}).afterAll(() => {
  attachingSpecialCharacterWithMiddle(`End Create Operation Check`, '=', 100);
});
//#endregion

//#region check all get all user url.
describe('Get All Check', function () {
  getAllcontainer = request(baseUrl + 'user/getAll');
  //request must return 200 in response.
  it('Expect:Success||Must Have Status Code return 200.', function (done) {
    getAllcontainer
      .get('')
      .expect(function (res) {
        //console.log(res);
      })
      .expect(200, done);
  });

  //data get from url need to match with response data.
  it('Expect:Success||data needed to match with db', function (done) {
    getAllcontainer
      .get('')
      .expect(async function (res) {
        filePath=await utilityService.createFilePath('','user', 'json');
        let data = await jsonparse(await await fileRead(filePath, { encoding: 'utf-8', flag: 'r+' }));
        // console.log(data["user"]);
        // console.log(res.body.data);
        //  console.log(JSON.stribaseUrlngify(res.body.data) == JSON.stringify(data["user"]));
        if (JSON.stringify(res.body.data) == JSON.stringify(data["user"])) {
          return true;
        }
        else {
          throw new Error('Missing pagination information and hypermedia controls');
        }
      })
      .expect(200, done);
  });

  //data needs to present in response
  it('Expect:Success||data needed to be present', function (done) {
    getAllcontainer
      .get('')
      .expect(/data/)
      .expect(200, done);
  });
}).beforeAll(() => {
  attachingSpecialCharacterWithMiddle(`Start Get All Check`, '=', 100);
}).afterAll(() => {
  attachingSpecialCharacterWithMiddle(`End Get All Check`, '=', 100);
});
//#endregion

//#region check all update methods 
describe("Update Operation Check",async  function  () {
  updateContainer = request(baseUrl + 'user/update');

  let data = {
       "id": 806, "name": "zeal test", "age": 78
     }
  //request must return 201 in response.
  it('Expect:Success||Update request of user Must Have Status Code return 200.', (done) => {
    updateContainer
      .post('')
      .send({"payload": data })
      .expect(200, done);
  });

//it will check that it should send error when user try to add with same id.(primary key should not be same.)
  it('Expect:Failed||Update request of user Must Have Status Code return 422 because if user is not present then it\'s error.', (done) => {
    let data = {
      "id": 899, "name": "zeal test", "age": 78
    }
    updateContainer
      .post('')
      .send({ "payload": data })
      .expect((res) => {
        attachingSpecialCharacterWithMiddle(JSON.parse(res.text).error, '!', 100, '\x1b[31m');
      })
      .expect(422, done);
  });

  //it will check after delete file's all entry it should add new entry when we request for it.(first entry check)
  it('Expect:Success||Update request when file is deleted.', async () => {
    filePath=await utilityService.createFilePath('','user', 'json');
    let readData = await jsonparse(await fileRead(filePath, { encoding: 'utf-8', flag: 'r+' }));
    let listOfUser = [];
    readData['user'].forEach(element => {
      listOfUser.push(element.id);
    });
    await utilityService.deleteData(filePath, listOfUser, 'user');
    await updateContainer
      .post('')
      .send({ "payload": data })
      .expect(422);
  });

}).beforeAll(() => {
  attachingSpecialCharacterWithMiddle(`Start update Operation Check`, '=', 100);
}).afterAll(() => {
  attachingSpecialCharacterWithMiddle(`End update Operation Check`, '=', 100);
});
//#endregion 




//#region check all delete methods 
describe("delete Operation Check",async  function  () {
  let id=809;
  deleteContainer = request(baseUrl + `user/delete`);
  createContainer = request(baseUrl + 'user/add');
  let data = {
    "id": 809, "name": "zeal shah", "age": 79
  }
  //request must return 201 in response.
  it('Expect:Success||before delete Create request of user Must Have Status Code return 201.', (done) => {
    createContainer
      .post('')
      .send({ "payload": data })
      .expect(201, done);
  });

  //request must return 200 in response.
  it('Expect:Success||delete request of user Must Have Status Code return 200.', (done) => {
    deleteContainer
      .get(`/${id}`)
      .expect(200, done);
  });

//it will check that it should send error when user try to add with same id.(primary key should not be same.)
  it('Expect:Failed||delete request of user Must Have Status Code return 422 because if user is not present then it\'s error.', (done) => {
    let idNotPresentInDatabase=899;
    deleteContainer
    .get(`/${idNotPresentInDatabase}`)
      .expect((res) => {
       // attachingSpecialCharacterWithMiddle(JSON.parse(res.text).error, '!', 100, '\x1b[31m');
      })
      .expect(422, done);
  });
}).beforeAll(() => {
  attachingSpecialCharacterWithMiddle(`Start delete Operation Check`, '=', 100);
}).afterAll(() => {
  attachingSpecialCharacterWithMiddle(`End delete Operation Check`, '=', 100);
});
//#endregion 

//#region support functions for adding functionality.
function attachingSpecialCharacterWithMiddle(string, specialCharcter, length, color = '\x1b[0m') {
  let lengthOfString = string.length;
  let remeaningCharters = (length - lengthOfString) / 2;

  if (length - lengthOfString > 0) {
    // console.log(length - lengthOfString);
    console.log(
      nullOrUndefind(color) ? color : '\x1b[0m',
      `${specialCharcter.repeat(remeaningCharters - 1)}${string}${specialCharcter.repeat(remeaningCharters - 1)}`
      , '\x1b[0m');
    // console.log(`${specialCharcter.repeat(remeaningCharters-1)}${string}${specialCharcter.repeat(remeaningCharters-1)}`);
  }
}
//#endregion