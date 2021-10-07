import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor('mail')
export class MailProcessor{
   // private readonly logger= new Logger(MailProcessor.name);

    @Process('transcode')
    async transcode(job:Job<unknown>){
        const mail=job.data['mail'];
        const nodeMailer = require('nodemailer');
        const transporter = nodeMailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.HOST_MAIL_NAME,
                pass: process.env.HOST_MAIL_PASS
            }
        });
        const option = {
            from: process.env.HOST_MAIL_NAME,
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
        
        // console.log('Starting transcoding');
        // console.log(job.data);
        // console.log('Transcoding completed');
    }
}