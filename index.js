const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require("morgan");
const db = require('./db/db.js')
const Users = require('./db/Users.js')
const Exes = require('./db/Exes.js')

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan("tiny"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", (req, res, next) => {
  const newUser = new Users(req.body)
  newUser.save((err, data) => {
    res.send(data)
  })
})

app.get('/api/users', (req, res, next) => {
  Users.find({}, (err, data) => {
    res.send(data)
  })
})

app.post('/api/users/:_id/exercises', (req, res, next) => {
  let { description, duration, date } = req.body
  if (!date) {
    date = new Date().toDateString();
  } else {
    date = new Date(date).toDateString();
  }
  const _id = req.params._id
  Users.findById(_id, (err, user) => {
    const username = user.username
    const newExe = new Exes({username, description, duration, date })
    newExe.save((err, exe) => {
      const {description, duration} = exe
      const date = exe.date.toDateString()
      const response = {username, description, duration, date, _id}
    res.send(response)
    })
  })
})

app.get('/api/users/:_id/logs', (req, res,next)=>{
  const _id = req.params._id
  let {from, to, limit} = req.query
  if (from || to) {
    from = new Date(from).toDateString()
    to = new Date(to).toDateString()
    Users.findById(_id, (err, user) => {
     const username = user.username
      Exes.find({username, date: {
          "$gte": from,
          "$lt": to
     }}).limit(limit).exec((err, exes) => {
      const count = exes.length
      const log = exes.map(exe => {return {
        description: exe.description,
        duration: exe.duration,
        date: exe.date.toDateString()}})
        console.log(log)
       const response = {username, count, _id, log}
       res.send(response)
     })
    })  
  } else {
    Users.findById(_id, (err, user) => {
    const username = user.username
    Exes.find({username}).limit(limit).exec((err, exes) => {
      const count = exes.length
      const log = exes.map(exe => {return {
        description: exe.description,
        duration: exe.duration,
        date: exe.date.toDateString()}})
      console.log(log)
      const response = {username, count, _id, log}
      res.send(response)
    })
  })
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
