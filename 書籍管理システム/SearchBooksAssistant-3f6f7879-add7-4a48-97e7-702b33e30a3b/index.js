const clova = require('@line/clova-cek-sdk-nodejs');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = clova.Client
    .configureSkill()
    .onLaunchRequest(async responseHelper =>{
        const UserId = responseHelper.getUser().userId;
        console.log("UserId:", UserId);
        var params = {
                            TableName: "UsersInfo",
                            KeyConditionExpression: "#UserId = :UserId",
                            ExpressionAttributeNames:{
                                "#UserId": "UserId"
                            },
                            ExpressionAttributeValues: {
                                ":UserId": UserId
                            }
                    };
                    const SearchUser = await dynamo.query(params).promise();
                    if (SearchUser.err) {
                        console.log("dynamo_query_err:", dynamo.err);
                        
                    } else {
                        console.log(SearchUser.Items);
                        if (SearchUser.Items == 0){
                            params = {
                                TableName: 'UsersInfo',
                                Item: {
                                    'UserId': UserId,
                                    'BooksInfo': {}
                                    
                                }
                            };
                            const CreatUser = await dynamo.put(params).promise();
                            if (CreatUser.err){
                                console.log("dynamo_put_err:", dynamo.err);
                                
                            }else{
                                const speechList = [
                                    clova.SpeechBuilder.createSpeechText(
                                        '初めまして、まずはラインボットから書籍登録をしてください'
                                        
                                        )
                                    ];
                                responseHelper.setSpeechList(speechList);
                            }
                            
                        }
                        else{
                            const speechList = [
                                clova.SpeechBuilder.createSpeechText(
                                    'どのような本をお探しですか？'
                                    )
                                    ];
                                    responseHelper.setSpeechList(speechList);
                            
                        }
        }
    })
    .onIntentRequest(async responseHelper =>{
        const intent = responseHelper.getIntentName();
        const slots = responseHelper.getSlots();
        console.log("UserId:",responseHelper.getUser());
        switch (intent) {
            case 'Clova.GuideIntent':
                const speechList = [
                    clova.SpeechBuilder.createSpeechText(
                        '本の名前で場所を検索することができます'
                    )
                ];
                responseHelper.setSpeechList(speechList);

                break;
            case 'SearchBooks':
                console.log(slots['Books']);
                const BookName = slots['Books'];
                if (slots){
                    
                    var params = {
                            TableName: "BooksInfo",
                            KeyConditionExpression: "#BookTitle = :Books",
                            ExpressionAttributeNames:{
                                "#BookTitle": "BookTitle"
                            },
                            ExpressionAttributeValues: {
                                ":Books": BookName
                            }
                    };
                    console.log("slots:", slots);
                    console.log("params:",params);
                    const BookList = await dynamo.query(params).promise();
                    console.log(BookList.Items);
                    const SpLocate = BookList.Items[0]['Locate'];
                    const speechList = [
                        clova.SpeechBuilder.createSpeechText(
                            `${BookName} わ${SpLocate} にあります`
                        )
                    ];
                    responseHelper.setSpeechList(speechList);
                    
                    break;
                }
                else{
                    console.log('NoSlot');
                }
                await console.log("Searched");
            default :
                console.log('NoIntent');
                break;
        }

    })
    .onSessionEndedRequest(async responseHelper =>{

    }
).lambda();
