const express = require('express')
const app = express()
const nodemailer = require("nodemailer")

require('dotenv').config()



app.set('view engine', 'ejs');

const path = require('path')


app.use(express.static(path.join(__dirname, '/views')))
app.use(express.static(path.join(__dirname, '/images')))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.render('home', {success: false})
})
app.get('/contact-us', (req, res) => {
    res.render('contact-us', {success: false})
})
app.get('/about-us', (req, res) => {
  res.render('about', {success: false})
})


app.post('/send-message', (req, res) => {

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
  })
  
  transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "Web Development", 
    html: `<h1>Customer Data</h1>
          <h2>Name: ${req.body.name}</h2>
          <h2>Email Address: ${req.body.email}</h2>
          <h2>Phone: ${req.body.phone}</h2>
          <h2>Subject: ${req.body.subject}</h2>
          <h3>Message</h3>
          <h2>${req.body.message}</h2>
          `
  }).then(r => {
    let url = req.headers.referer
    let renderUrl = url.slice(req.headers.host.length + 9, url.length)
    if(renderUrl == ''){
      res.render('home', {success: true})
    }
    if(renderUrl == 'about-us'){
      res.render('about', {success: true})
    }
    if(renderUrl == 'contact-us'){
      res.render('contact-us', {success: true})
    }
  }).catch(err => console.log(err))
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})