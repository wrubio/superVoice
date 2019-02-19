const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

app.post('/', (req, res) => {
    const emails = req.body;
    const mailOptions = async(emails) => {
        console.log(emails);
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'supervoicescontest@gmail.com', // generated ethereal user
                pass: 'superVoices2019$' // generated ethereal password
            }
        });
        let mailOptions = {
            from: '"SuperVoices 👻" <supervoicescontest@gmail.com>', // sender address
            to: emails, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Nos interesas!", // plain text body
            html: "<b>Hello world?</b>" // html body
        };
        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    }
    mailOptions(emails).then(resp => {
        res.status(200).json({ ok: true })
    }).catch(err => {
        res.status(200).json({ ok: false })
    })
})

module.exports = app;