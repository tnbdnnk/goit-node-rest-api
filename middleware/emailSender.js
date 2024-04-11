import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

const emailSender = (req, res, next) => {
    console.log('emailSender middleware called');
    const { email, subject, content } = req.body;
    const config = {
        host: 'smtp.ukr.net',
        port: 465,
        secure: true,
        auth: {
            user: 'tetianabidnenko@ukr.net',
            pass: process.env.PASSWORD,
        }
    };

    const transporter = nodemailer.createTransport(config);
    const emailOptions = {
        from: '<tetianabidnenko@ukr.net>',
        to: email,
        subject: subject,
        text: content,
    }

    transporter
        .sendMail(emailOptions)
        .then((info) => {
            console.log('email sent:', info);
            res.render('done')
        })
        .catch((err) => {
            console.log('error sending email:', err);
            next(err);
        })
}

export default emailSender;



// import Mailgun from 'mailgun.js';
// import formData from 'form-data';
// import nodemailer from 'nodemailer';

// const mailgun = new Mailgun(formData);

// const mg = mailgun.client({
//     username: 'api',
//     key: `${process.env.API_KEY}`,
//     // domain: `${process.env.DOMAIN}`
// });

// // const transporter = nodemailer.createTransport({
// //     service: 'Mailgun',
// //     auth: {
// //         user: `postmaster@${process.env.DOMAIN}`,
// //         pass: `${process.env.API_KEY}`
// //     }
// // });

// export const sendMail = async (req, res, next) => {
//     const { email, subject, content } = req.body;
//     const mailOptions = {
//         from: `Mailgun Sandbox <postmaster@${process.env.DOMAIN}>`,
//         to: [email],
//         subject: subject,
//         text: content,
//         html: "<h1>Testing some Mailgun awesomeness!</h1>"
//     };

//     mg.messages.create('sandbox-123.mailgun.org', mailOptions)
//         .then(msg => {
//             console.log('Email sent (Mailgun):', msg);
//             next();
//         })
//         .catch(err => {
//             console.error('Mailgun error:', err);
//             next(err);
//         });

    // console.log("Mailgun instance:", mg); // Check if the mailgun instance is properly initialized
    // console.log("Mail options:", mailOptions);

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.error('Nodemailer error:', error);
    //     } else {
    //         console.log('Email sent (Nodemailer): ', info.response);
    //     }
    // });

    // mg.messages().send(mailOptions, (error, body) => {
    //     if (error) {
    //         console.error('Mailgun error:',error);
    //     } else {
    //         console.log('Email sent (mailgun):',body);
    //     }
    // })
    // next(); 
// }

// const data = {
// 	from: "Mailgun Sandbox <postmaster@sandbox2890266d060b4b8db2fc3a82dad1dc95.mailgun.org>",
// 	to: "tetianabidnenko25@gmail.com",
// 	subject: "Hello",
// 	text: "Testing some Mailgun awesomness!"
// };

// mg.messages().send(data, function (error, body) {
// 	console.log(body);
// });
