require('dotenv').config()

const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors())
// app.use(cors({origin: 'http://localhost:3000'}))


const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    pool: true,
    host: "uk53.siteground.eu", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 465, // port for secure SMTP
    tls: {
      ciphers:'SSLv3'
    },
    auth: {
      user: process.env.A1,
      pass: process.env.A2
    }
})

transporter.verify((error) => {
  if (error) {console.log(error);}
  else {console.log("Ready to Send");}
});

  app.post("/contact", (req,res)=>{
    const mailOptions = {
      from: process.env.A1, // sender address (who sends)
      to: process.env.A3, // list of receivers (who receives)
      subject: `${req.body.name} sent you a message from the Indige Contact Form!`, // Subject line
      text: `${req.body.message}`, // plaintext body.contact
      html: `<div style="margin: 20px; text-align: left; border: solid 1px grey; border-radius: 5px; padding: 20px;">
              <h3 style="text-align: center;">You recieved a new message from your Indige Form </h3>
              <hr style="margin: 20px; color: grey;"/>
              <br/>
              <h3>Name:</h3>
              <p>${req.body.name}</p>
              <h3>Email:</h3>
              <p>${req.body.email}</p>
              <h3>Subject:</h3>
              <p>${req.body.subject}</p>
              <h3>Message below:</h3>
              <p>${req.body.message}</p>
            </div>` // html body
    };
      console.log(req.body)
      res.json({status: 'Request Successful!'})

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
          res.json({status: 'Request Failed'})
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
          res.json({ status: "Email sent" });
        }
    });
  })

const PORT = process.env.PORT || 4000

app.listen(PORT,() =>{
console.log(`App running on port ${PORT}`)
})

