const express = require('express')
const app = express()
const nodemailer = require("nodemailer")
const session = require('express-session')
const axios = require('axios')

require('dotenv').config()


app.set('view engine', 'ejs');

const path = require('path')


app.use(express.static(path.join(__dirname, '/views')))
app.use(express.static(path.join(__dirname, '/images')))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.get('/', (req, res) => {
  
  if(!req.session.viewCount){
    req.session.viewCount = 1
  } else {
    req.session.viewCount += 1
  }
  res.render('home', {success: false})
})



app.get('/contact-us', (req, res) => {

  if(!req.session.viewCount){
    req.session.viewCount = 1
  } else {
    req.session.viewCount += 1
  }

  res.render('contact-us', {success: false})
})
app.get('/about-us', (req, res) => {
  
  if(!req.session.viewCount){
    req.session.viewCount = 1
  } else {
    req.session.viewCount += 1
  }
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


app.post('/user-info', async (req, res) => {
  

  if(req.session.viewCount == 1){

    const response = await axios.get('http://api.ipify.org/')

    const ip = response.data
    const url = `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`
    const ip_api = await axios.get(url)

    const sys = req.body
    const loc = ip_api.data

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
      subject: "User Visit", 
      html: `<h1>Visiter Informations</h1>
            <h3 style="color: red">System Info</h3>
            <p>Browser: ${sys.name} Version: ${sys.version}</p>
            <p>Layout: ${sys.layout}</p>
            <p>OS: ${sys.os.family}</p>
            <p>OS architecture: ${sys.os.architecture}</p>
            <p>OS version: ${sys.os.version}</p>
            <p>Layout: ${sys.layout}</p>
            <p>Description: ${sys.description}</p>
            <p>Product: ${sys.product}</p>
            <p>Manufacturer: ${sys.manufacturer}</p>
            <br>
            <h3 style="color: red">Location Info</h3>
            <p>Status: ${loc.status}</p>
            <p>Continent: ${loc.continent}</p>
            <p>Continent Code: ${loc.continentCode}</p>
            <p>Region: ${loc.region}</p>
            <p>Region Name: ${loc.regionName}</p>
            <p>City: ${loc.city}</p>
            <p>District: ${loc.district}</p>
            <p>ZIP: ${loc.zip}</p>
            <p>Latitude: ${loc.lat}</p>
            <p>Longitude: ${loc.lon}</p>
            <p>Timezone: ${loc.timezone}</p>
            <p>Offset: ${loc.offset}</p>
            <p>Currency: ${loc.currency}</p>
            <p>Internet service provider: ${loc.isp}</p>
            <p>Org: ${loc.org}</p>
            <p>as: ${loc.as}</p>
            <p>as name: ${loc.asname}</p>
            <p>Reverse: ${loc.reverse}</p>
            <p>Mobile: ${loc.mobile}</p>
            <p>Proxy: ${loc.proxy}</p>
            <p>Hosting: ${loc.hosting}</p>
            <p>Query: ${loc.query}</p>
            `
    })
  }
})


const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
