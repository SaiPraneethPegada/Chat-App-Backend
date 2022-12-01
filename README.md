# Chat-App-Backend

##  [Backend Deployed URL](https://chat-app-api-kaw0.onrender.com) | [Frontend Source code](https://github.com/SaiPraneethPegada/Chat-App-Frontend.git)

## API End-Points:

| Method | End point | Description |
| ---- | ---- | ---- |
| POST | /signup | signup requirements -> username, email(unregistered), password(Min 8 characters length) and pic (optional). |
| POST | /login | login credential requirements -> email and password |

> After succesful logged in:

| Method | End point | Description |
| ---- | ---- | ---- |
| GET | /searchUser | search users by their userName or email. GET request take search keyword from query params |
| POST | /chat | if logged user has chat with the search user then it populate the chat orelse it will create a new chat with the search user |
| GET | /chat | fetches all the chats w.r.t logged user |
| POST | /chat/message | it takes message content and chatId from req.body and store message in that chatId |
| GET | /chat/message/:chatId | fetches all the messages from the respective chatId |
