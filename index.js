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
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
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

  app.post("/contact", (req,res, next)=>{
    const mailOptions = {
        from: process.env.A1, // sender address (who sends)
        to: process.env.A3, // list of receivers (who receives)
        subject: `${req.body.name} Sent you a message from the Portfolio Contact Form!`, // Subject line
        text: `${req.body.message}`, // plaintext body.contact
        html: `<h1>${req.body.name} sent you a message from your website.</h1>
                <br/>
                <h3>Their email is: ${req.body.email}</h3>
                <br/>
                <h4>Message below:</h4>
                <p>${req.body.message}</p>` // html body
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
    
    // transporter.verify((error) => {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log("Ready to Send");
    //     }
    //   });
    // next();
  })

const PORT = process.env.PORT || 4000

app.listen(PORT,() =>{
console.log(`App running on port ${PORT}`)
})

