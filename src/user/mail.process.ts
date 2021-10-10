import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";


require('dotenv').config();

@Processor('mail')

export class MailProcessor{
   // private readonly logger= new Logger(MailProcessor.name);

    @Process('transcode')
    
    async transcode(job:Job<unknown>){
        console.log(123);
        const mail=job.data['mail'];
        const nodeMailer = require('nodemailer');
        const transporter = nodeMailer.createTransport({
            service: "Gmail",
            auth: {
                user: "hienntt183734@gmail.com",
                pass: "hien842850"
            }
        });
        
        const option = {
            from: "hienntt183734@gmail.com",
            to: mail,
            subject: "Login",
            text: "Login successfully"
        };
        transporter.sendMail(option, function (err, info) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Sent: " + info.response);
        })
        
    }
}