# Api Development Final Project

**Author:** Rishu Kumar  
**Date:** 29-11-2023


## Instructions to Setup and Run


### Setup Instructions

#### Install Dependencies:

```
npm install express sqlite3 sequelize
```

#### Start Programme

```
node server.js
```

#### Run and Test by Doing CRUD Operation and Error Handeling

#### Create:
```
curl -X POST -H "Content-Type: application/json" -d '{"firstName": "James", "lastName": "Karl", "address": {"street": "98 james st", "city": "uphill City"}}' http://localhost:3000/api/users
```

#### Read: 
```
curl "http://localhost:3000/api/users?firstName=John"
```
```
curl "http://localhost:3000/api/users?city=sun%20City"
```

#### Update:
```
curl -X PUT -H "Content-Type: application/json" -d '{"firstName": ”Evan"}' http://localhost:3000/api/users/4
```

#### Delete:
```
curl -X DELETE http://localhost:3000/api/users/4
```

#### Error Handling:
```
curl -X POST -H "Content-Type: application/json" -d '{"lastName": ”kojl"}' http://localhost:3000/api/users
```
```
curl -X PUT -H "Content-Type: application/json" -d '{"firstName": "Joy"}' http://localhost:3000/api/users/1000
```