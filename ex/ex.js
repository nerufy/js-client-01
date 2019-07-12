const btn = document.getElementById('btn');
const result = document.getElementById('result');

btn.addEventListener('click',()=>{
    result.innerText = "新着、未読メールは1件です";
    /* var inbox = require("inbox")

const server = "imap.mail.yahoo.co.jp"
const user = ""
const password = "yyyyyy"

var client = inbox.createConnection(false, server, {
    secureConnection: true,
    auth:{
        user: user,
        pass: password
    }
})

client.connect()

// ---------------------------------------------------------------
client.on("connect", function()
{
    console.log ("*** connected ***")
    client.openMailbox("INBOX", function(error, info)
    {
    if(error) throw error;

    client.listMessages(-10, function(err, messages)
        {
        messages.forEach(function(message)
            {
            const uid = message.UID
            console.log(uid)
            console.log("Name: " + message.from.name)
            console.log("Address: " + message.from.address)
            console.log("Title: " + message.title)

//          client.createMessageStream(uid).pipe(process.stdout, {end: false})
            });

        client.close()
        })
    })
})

// ---------------------------------------------------------------
client.on('close', function (){
    console.log('*** disconnected! ***');
})

// ---------------------------------------------------------------
 */
});