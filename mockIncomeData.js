var pmongo = require('promised-mongo');
var moment = require('moment-timezone');

var db = pmongo('mongodb://139.162.43.212/smartsaver', ['income']);

moment().tz('Asia/Manila')

var time = moment().subtract(3, 'month')
var now = moment()

var data = []

var groups = [
  {type: 'salary', category: ['CTO Leengo', 'CEO SmartSaver', 'Lead Engineer', 'CTO Leengo']},
  {type: 'stocks', category: ['Leengo', 'SmartSaver', 'Leengo', 'SmartSaver']},
  {type: 'one-offs', category: ['Lecturing', 'Consulting (Business)', 'Consulting (IT)']},
  {type: 'sales', category: ['SmartSaver subs', 'Leengo subs', 'Leengo subs', 'SmartSaver subs']},
  {type: 'renting-out', category: ['Condo in NY', 'House in PL', 'Vacation Home in PH', 'Condo in NY']},
  {type: 'music', category: ['DJ gigs', 'Movie Soundtracks', 'Track sales', 'DJ gigs']},
  {type: 'business-share', category: ['Good Foods PH', 'Jollibee', 'Jollibee', 'Good Foods PH']},
]

let getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

while(time <= now) {
  var int = getRandomInt(0, 5)
  var item = {
    group: groups[int].type,
    category: groups[int].category[getRandomInt(0, 3)],
    userID: 'radolasd@gmail.com',
    createDate: time.unix(),
    amount: parseFloat((getRandomInt(1, 1000000)*Math.random()).toFixed(2))
  }

  data.push(item)

  time.add(2, 'hour');
}

let i = 0;

db.income.ensureIndex({userID: 1})

function addRecord() {
  db.income.insert(data[i]).then( function() {
    i++
    if(i < data.length) {
      console.log('adding ', i);
      addRecord()
    }
    else {
      console.log('done');

      db.close();
    }
  });
}

function setup() {
  // db.results.drop().then(function() {
    addRecord()
  // })
}

setup()
