'use strict';
const line = require('@line/bot-sdk');
const crypto = require('crypto');
const client = new line.Client({channelAccessToken: process.env.ACCESSTOKEN});
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
 
exports.handler = async function (event, context) {
 
 let body = JSON.parse(event.body);
 let bodyEvent = body.events[0];
 let userId = bodyEvent.source.userId;
 console.log('event: ', JSON.stringify(event));
 console.log('body:', JSON.stringify(body)); //リクエスト内容
 
 let signature = crypto.createHmac('sha256', process.env.CHANNELSECRET).update(event.body).digest('base64');
 let checkHeader = (event.headers || {})['X-Line-Signature'];
 if (signature === checkHeader) {
  if (bodyEvent.replyToken === '00000000000000000000000000000000') { //接続確認エラー回避
   let lambdaResponse = {
    statusCode: 200,
    headers: { "X-Line-Status" : "OK"},
    body: '{"result":"connect check"}'
   };
   context.succeed(lambdaResponse);
  }else{
   const eventType = bodyEvent.type;
   var params = {
    TableName: 'UsersInfo',
    KeyConditionExpression: "#UserId = :UserId",
    ExpressionAttributeNames:{
     "#UserId": "UserId"
     
    },
    ExpressionAttributeValues: {
     ":UserId": userId
     
    }
    
   };
   const SearchUser = await dynamo.query(params).promise();
   if (!(SearchUser.Items)){
    
   }else if(SearchUser.Items){
    
   }else{
    
   }
   switch (eventType) {
    case 'message':
     let text = bodyEvent.message.text;
     if (text == "本の追加"){
      var params = {
         TableName: 'UsersInfo',
         Item: {
          'UserId': userId,
          'BooksInfo': {},
          'Status': "BookAdd"
      }
      
      };
      const BookAdd = await dynamo.put(params).promise();
      if (BookAdd.err){
       
      }else{
       console.log("BookAddedStatus");
       
      }
      const message = setMessage(
       '本のタイトルを入力してください'
       );
     await client.replyMessage(bodyEvent.replyToken, message)
     .then((response) => { 
      let lambdaResponse = {
       statusCode: 200,
       headers: { "X-Line-Status" : "OK"},
       body: '{"result":"completed"}'
       
      };
      context.succeed(lambdaResponse);
     }).catch((err) => console.log(err));
      
     }else{
      var params = {
      TableName: "UsersInfo",
      KeyConditionExpression: "#UserId = :UserId",
      ExpressionAttributeNames:{
       "#UserId": "UserId"
       
      },
      ExpressionAttributeValues: {
       ":UserId": userId
       
      }
      
      
     };
     const SearchUser = await dynamo.query(params).promise();
     if (SearchUser.Items[0].Status == "BookAdd"){
      let text = bodyEvent.message.text;
      await bookPut(userId,text).promise();
      
     }
     }
     break;

    case 'follow':
     console.log("Status:follow");
     var params = {
      TableName: "UsersInfo",
      KeyConditionExpression: "#UserId = :UserId",
      ExpressionAttributeNames:{
       "#UserId": "UserId"
       
      },
      ExpressionAttributeValues: {
       ":UserId": userId
       
      }
      
      
     };
     const SearchUser = await dynamo.query(params).promise();
     console.log("SearchUserItem",SearchUser.Items);
       if (SearchUser.Items == 0){
        params = {
         TableName: 'UsersInfo',
         Item: {
          'UserId': userId,
          'BooksInfo': {}
         }
        };
        const CreatUser = await dynamo.put(params).promise();
        if (CreatUser.err){
         console.log("CreateUsererr");
        }else{
         console.log("CreateUser");
         const message = setMessage(
          '初めまして、まずはClovaのセットアップ後に書籍管理システムのスキルをインストールしてください'
          );
         await client.replyMessage(bodyEvent.replyToken, message)
         .then((response) => { 
          let lambdaResponse = {
           statusCode: 200,
           headers: { "X-Line-Status" : "OK"},
           body: '{"result":"completed"}'
       
           
          };
          context.succeed(lambdaResponse);
          
         }).catch((err) => console.log(err));
        }
       }
       else{
        const message = setMessage(
         '初めまして、書籍管理システムです。本を追加したいときは「本の追加」と言ってください。'
         );
        await client.replyMessage(bodyEvent.replyToken,message)
        .then((response)=>{
         let lambdaResponse = {
         statusCode: 200,
         headers: { "X-Line-Status" : "OK"},
         body: '{"result":"completed"}'
        };
        context.succeed(lambdaResponse);
        }).catch((err) => console.log(err));
       }
     break;
    
    default:
     // code
   }
  }
 }else{
  console.log('署名認証エラー');
 }
};


function setMessage(text){
 const message = {
  'type': 'text',
  'text': text
  
 };
 return message;
}

async function bookPut(userId,bookTitle){
 const params = {
  TableName: 'UsersInfo',
  Item: {
   UserId: userId,
   BooksInfo: {
    BookTitle: bookTitle
   }
  }
 };
 await dynamo.put(params).promise();
}