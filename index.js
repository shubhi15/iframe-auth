var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var https = require('https');
var fs = require('fs');
import { createOrLoginUser } from './index2';
var  expressSession = require("express-session");



var sslOptions = {
  key: fs.readFileSync(__dirname +'/cert/key.pem'),
  cert: fs.readFileSync(__dirname  + '/cert/cert.pem'),
  passphrase: 'Dummy'
};

var app = express();
app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// CORS in case you need
app.use((req, res, next) => {
	res.set('Access-Control-Allow-Origin', 'https://app-demorocket3.wedeploy.io'); // this is the rocket.chat URL
	res.set('Access-Control-Allow-Credentials', 'true');

	next();
});

// // this is the endpoint configured as API URL
// app.post('/sso', function (req, res) {

// 	// add your own app logic here to validate user session (check cookies, headers, etc)

// 	// if the user is not already logged in on your system, respond with a 401 status
// 	var notLoggedIn = true;
// 	if (notLoggedIn) {
// 		return res.sendStatus(401);
// 	}

// 	// you can save the token on your database as well, if so just return it
// 	// MongoDB - services.iframe.token
// 	var savedToken = null;
// 	if (savedToken) {
// 		return res.json({
// 			token: savedToken
// 		});
// 	}

// 	// if dont have the user created on rocket.chat end yet, you can now create it
// 	var currentUsername = null;
// 	if (!currentUsername) {
// 		axios.post('https://app-884ojm0.wedeploy.io/api/v1/users.register', {
// 			username: 'new-user',
// 			email: 'mynewuser@email.com',
// 			pass: 'new-users-passw0rd',
// 			name: 'New User'
// 		}).then(function (response) {

// 			// after creation you need to log the user in to get the `authToken`
// 			if (response.data.success) {
// 				return axios.post('https://app-884ojm0.wedeploy.io/api/v1/login', {
// 					username: 'new-user',
// 					password: 'new-users-passw0rd'
// 				});
// 			}
// 		}).then(function (response) {
// 			if (response.data.status === 'success') {
// 				res.json({
// 					loginToken: response.data.data.authToken
// 				});
// 			}
// 		}).catch(function (error) {
// 			console.log(error)
// 			res.sendStatus(401);
// 		});
// 	} else {

// 		// otherwise create a rocket.chat session using rocket.chat's API
// 		axios.post('https://app-884ojm0.wedeploy.io/api/v1/login', {
// 			username: 'username-set-previously',
// 			password: 'password-set-previously'
// 		}).then(function (response) {
// 			if (response.data.status === 'success') {
// 				res.json({
// 					loginToken: response.data.data.authToken
// 				});
// 			}
// 		}).catch(function () {
// 			res.sendStatus(401);
// 			console.log(error)
// 		});
// 	}
// });

// // just render the form for the user authenticate with us
// app.get('/login/rci', function (req, res) {
// 	res.set('Content-Type', 'text/html');
// 	fs.createReadStream('login.html').pipe(res);
// });

// // receives login information
// app.post('/login/rci', function (req, res) {

// 	// do your own authentication process

// 	// after user is authenticated we can proceed with authenticating him on rocket.chat side

// 	//
// 	//
// 	// the code bellow is exact the same as the on /sso endpoint, excepts for its response
// 	// it was duplicated since the purpose of this is app is for helping people understanding
// 	// the authentication process and being a well designed app =)
// 	//
// 	//

// 	// if dont have the user created on rocket.chat end yet, you can now create it
// 	var currentUsername = 'ddd';
// 	console.log(currentUsername);
// 	if (!currentUsername) {
// 		axios.post('http://localhost:3000/api/v1/users.register', {
// 			username: req.body.username,
// 			email: req.body.email,
// 			pass: req.body.password,
// 			name: req.body.username
// 		}).then(function (response) {
// 			console.log('Response from Register', response)

// 			// after creation you need to log the user in to get the `authToken`
// 			if (response.data.success) {
// 				return axios.post('https://app-884ojm0.wedeploy.io/api/v1/login', {
// 					username: req.body.username,
// 					password: req.body.password
// 				});
// 			}
// 		}).then(function (response) {
// 			console.log('Response from login', response)
// 			if (response.data.status === 'success') {


// 				// since this endpoint is loaded within the iframe, we need to communicate back to rocket.chat using `postMessage` API
// 				res.set('Content-Type', 'text/html');
// 				res.send(`<script>
// 				window.parent.postMessage({
// 					event: 'login-with-token',
// 					loginToken: '${ response.data.data.authToken }'
// 				}, 'http://localhost:3000'); // rocket.chat's URL
// 				</script>`);
// 			}
// 		}).catch(function (error) {
// 			console.log(error)
// 			res.sendStatus(401);
// 		});
// 	} else {

// 		// otherwise create a rocket.chat session using rocket.chat's API
// 		axios.post('http://localhost:3000/api/v1/login', {
// 			username: 'bob',
// 			// req.body.username
// 			password: 'Shubhi124',
// 		}).then(function (response) {
// 			if (response.data.status === 'success') {
// 				console.log('Response from login', response)

// 				// since this endpoint is loaded within the iframe, we need to communicate back to rocket.chat using `postMessage` API
// 				res.set('Content-Type', 'text/html');
// 				res.send(`
// 				<script>
// 				window.parent.postMessage({
// 					event: 'login-with-token',
// 					loginToken: '${ response.data.data.authToken }'
// 				}, 'http://localhost:4000/rc'); // rocket.chat's URL
// 				</script>`);
// 			}
// 		}).catch((error) => {
// 			console.log(error)
// 			res.sendStatus(401);
// 		});
// 	}
// });


// just render the form for the user authenticate with us
app.get('/login/rci', function (req, res) {
	res.set('Content-Type', 'text/html');
	fs.createReadStream('login.html').pipe(res);
});

app.get('/index/rci', function (req, res) {
	res.set('Content-Type', 'text/html');
	fs.createReadStream('index1.html').pipe(res);
});

app.post('/login/rci', async (req, res) => {
// ....CODE TO LOGIN USER

	// Creating or login user into Rocket chat.
	
   try {
    const response = await createOrLoginUser(req.body.username, req.body.username, req.body.email, req.body.password);
    req.session.user = req.body;
    // Saving the rocket.chat auth token and userId in the database
    console.log('response got', response);
    req.session.user.rocketchatAuthToken = response.data.authToken;
    req.session.user.rocketchatUserId = response.data.userId;
    //await user.save();
    res.redirect('/rocket_chat_iframe/rc');
   } catch (ex) {
     console.log('Rocket.chat login failed', ex);
   }
})

// This method will be called by Rocket.chat to fetch the login token
app.get('/rocket_chat_auth_get', (req, res) => {
  if (req.session && req.session.user && req.session.user.rocketchatAuthToken) {
    // res.send({ loginToken: req.session.user.rocketchatAuthToken })
    res.redirect('/rocket_chat_iframe/rc');
    return;
  } else {
    res.redirect('/login/rci');
    return;
  }
});

app.get('/', function (req, res) {
  res.send("Hello World!");
});

// This method will be called by Rocket.chat to fetch the login token
// and is used as a fallback
app.get('/rocket_chat_iframe/rc', (req, res) => {
const rocketChatServer = 'https://app-demorocket3.wedeploy.io';
console.log('request session', req.session.user)
  if (req.session && req.session.user && req.session.user.rocketchatAuthToken) {
    return res.send(`<script>
      window.parent.postMessage({
        event: 'login-with-token',
        loginToken: '${ req.session.user.rocketchatAuthToken }'
      }, '${rocketChatServer}');
    </script>
    `)
  } else {
  //   return  res.send(`<script>
  //   window.parent.postMessage({
  //     event: 'login-with-token',
  //     loginToken: '${ rocketChatAdminAuthToken }'
  //   }, '${rocketChatServer}');
  // </script>
  // `)
  res.redirect('/login/rci');
  }
})

// app.listen(3040, function () {
// 	console.log('Example app listening on port 3030!');
// });
https.createServer(sslOptions, app).listen(3040, function () {
  	console.log('Example app listening on port 3040!');
  });