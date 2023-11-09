    const express = require('express');
    const nodemailer = require('nodemailer');
    const router = express.Router();
    require('dotenv').config();
    const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
    }
    });
    router.post('/email-service', (req, res) => {
        try{
            const {
                nombre,
                correo,
                asunto,
                cuerpo
            } = req.body
            const mailOptions = {
                from: `"${nombre}" <${correo}>`, 
                to: process.env.MAIL, 
                subject: asunto,
                text: cuerpo
            };
            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.json({error: 'Error al enviar el correo'});
            } else {
                res.json({success:'Correo enviado con éxito'});
            }
            });
        } catch(error){
            res.json({error: 'Error al enviar el correo'});
        }
    });

    module.exports = router;
