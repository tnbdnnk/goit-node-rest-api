// import Mailgun from 'mailgun.js';
// import FormData from 'form-data';

// const mailgun = new Mailgun(FormData);

// const mg = mailgun.client({
//     username: 'api',
//     key: process.env.MAILGUN_API_KEY2,
// });

// const domain = process.env.MAILGUN_DOMAIN;

// export const sendTestEmail = () => {
//     const data = {
//         from: `Excited User <tnbdnnk@gmail.com>`,
//         to: ['tnbdnnk@gmail.com'],
//         subject: 'Test email',
//         text: 'This is a test email sent from Mailgun.'
//     };

//     mg.messages.create(domain, data)
//         .then(body => {
//             console.log('Email sent:', body);
//         })
//         .catch(error => {
//             console.error('Error sending email:', error);
//         });
// };

// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     host: 'smtp.elasticemail.com',
//     port: '2525',
//     secure: true,
//     auth: {
//         user: 'apikey',
//         pass: process.env.API_KEY,
//     },
// });

// function sendVerificationEmail (email) {
//     const mailOptions = {
//         from: 'tnbdnnk@meta.ua',
//         to: email,
//         subject: 'Registration Confirmation',
//         html: '<p>Welcome! Please confirm your registration by clicking the link.</p>',
//         text: 'Welcome! Please confirm your registration by clicking the link.'
//     };
//     transporter.sendMail({...mailOptions, logger: true}, (error, info) => {
//         if (error) {
//             return console.error("error sending email", error);
//         }
//         console.log("email successfully sent:", info.response);
//     });
// };

// const userEmail = 'tnbdnnk@meta.ua';
// sendVerificationEmail(userEmail);

// export const resendVerificationEmail = async (req, res, next) => {
//     try {
//         const { email } = req.body;

//         // Validate email field
//         if (!email) {
//             return res.status(400).json({ message: 'missing required field email' });
//         }

//         // Check if the user with the provided email exists and is not verified
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }
//         if (user.verify) {
//             return res.status(400).json({ message: 'Verification has already been passed' });
//         }

//         // Generate a new verification token
//         const verificationToken = uuidv4(); // or use nanoid()

//         // Update user's verification token in the database
//         user.verificationToken = verificationToken;
//         await user.save();

//         // Send verification email
//         const verificationLink = `${process.env.BASE_URL}/users/verify/${verificationToken}`;
//         await sendVerificationEmail(user.email, verificationLink);

//         return res.status(200).json({ message: 'Verification email sent' });
//     } catch (error) {
//         next(error);
//     }
// };

 //We're using the express framework and the mailgun-js wrapper2 
// var express = require('express'); 
// var Mailgun = require('mailgun-js');
// //init express5 
// var app = express();
// //Your api key, from Mailgun’s Control Panel8 
// var api_key = 'MAILGUN-API-KEY';
// //Your domain, from the Mailgun Control Panel11 
// var domain = 'YOUR-DOMAIN.com';
// //Your sending email address14 
// var from_who = 'your@email.com';
// //Tell express to fetch files from the /js directory17 
// app.use(express.static(__dirname + '/js'));
// //We're using the Jade templating language because it's fast and neat19 
// app.set('view engine', 'jade')
// //Do something when you're landing on the first page22 
// app.get('/', function (req, res) {
//     //render the index.jade file - input forms for humans24 
//     res.render('index', function (err, html) {
//         if (err) {
//             // log any error to the console for debug27 
//             console.log(err); 
//         }
//         else {
//             //no error, so send the html to the browser31 
//             res.send(html)
//         }; 
//     }); 
// });
// // Send a message to the specified email address when you navigate to /submit/someaddr@email.com37 // The index redirects here38 
// app.get('/submit/:mail',
//     function (req, res) {
//         //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails41 
//         var mailgun = new Mailgun({ apiKey: api_key, domain: domain });
//         var data = {
//             //Specify email data45 
//             from: from_who,
//             //The email to contact47 
//             to: req.params.mail,
//             //Subject and text data 49 
//             subject: 'Hello from Mailgun',
//             html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?' + req.params.mail + '">Click here to add your email address to a mailing list</a>'
//         }
//         //Invokes the method to send emails given the above data with the helper library54 
//         mailgun.messages().send(data, function (err, body) {
//             //If there is an error, render the error page56 
//             if (err) {
//                 res.render('error', { error: err });
//                 console.log("got an error: ", err); 
//             }
//             //Else we can greet and leave61 
//             else {
//                 //Here "submitted.jade" is the view file for this landing page 63 //We pass the variable "email" from the url parameter in an object rendered by Jade64 
//                 res.render('submitted', { email: req.params.mail });
//                 console.log(body); 
//             } 
//         }); 
//     });
// app.get('/validate/:mail', function (req, res) {
//     var mailgun = new Mailgun({ apiKey: api_key, domain: domain });
//     var members = [
//         {
//             address: req.params.mail
//         }
//     ];
//     //For the sake of this tutorial you need to create a mailing list on Mailgun.com/cp/lists and put its address below80 
//     mailgun.lists('NAME@MAILINGLIST.COM').members().add(
//         { members: members, subscribed: true },
//         function (err, body) {
//             console.log(body);
//             if (err) {
//                 res.send("Error - check console"); 
//             } else {
//                 res.send("Added to mailing list");
//             }
//         }); 
// })
// app.get('/invoice/:mail',
//     function (req, res) {
//         //Which file to send? I made an empty invoice.txt file in the root directory94 //We required the path module here..to find the full path to attach the file!95 
//         var path = require("path");
//         var fp = path.join(__dirname, 'invoice.txt');
//         //Settings98 
//         var mailgun = new Mailgun(
//             {
//                 apiKey: api_key,
//                 domain: domain
//             }
//         );
//         var data = {
//             from: from_who,
//             to: req.params.mail,
//             subject: 'An invoice from your friendly hackers',
//             text: 'A fake invoice should be attached, it is just an empty text file after all',
//             attachment: fp
//         }; //Sending the email with attachment109 
//         mailgun.messages().send(data,
//             function (error, body) {
//                 if (error) {
//                     res.render('error', { error: error });
//                 } else {
//                     res.send("Attachment is on its way");
//                     console.log("attachment sent", fp); 
//                 } 
//             }); 
//     })
// app.listen(3030);
