'use server'
import nodemailer from 'nodemailer'

export const onMailer = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
    },
  })

  const mailOptions = {
    to: email,
    subject: 'Realtime Support',
    text: 'One of your customers on Corinna, just switched to realtime mode',
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        console.log('Email sent: ' + info.response)
        resolve(info)
      }
    })
  })
}