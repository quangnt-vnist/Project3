const nodemailer = require("nodemailer");
const user = 'vnist.qlcv@gmail.com';
const pass = 'qlcv123@';
exports.sendEmail = (to, subject, text, html) => {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: user, pass: pass }
    });
    var mainOptions = {
        from: user,
        to: to,
        subject: subject,
        text:  text,
        html:   html
    }

    transporter.sendMail(mainOptions);
}
