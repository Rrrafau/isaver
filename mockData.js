var pmongo = require('promised-mongo');
var moment = require('moment-timezone');

var db = pmongo('mongodb://139.162.43.212/smartsaver', ['spendings']);

moment().tz('Asia/Manila')

var time = moment().subtract(3, 'month')
var now = moment()

var data = []

var groups = [
  {type: 'groceries', category: ['meat', 'vegetables', 'fruits', 'cereal']},
  {type: 'bills', category: ['electricity', 'water', 'internet', 'rent']},
  {type: 'junk food', category: ['chips', 'chocolates', 'fast foods', 'soft drinks']},
  {type: 'alcohol', category: ['vodka', 'beer', 'whiskey', 'rum']},
  {type: 'travel', category: ['bus', 'car', 'air', 'ferry']},
  {type: 'taxis', category: ['uber', 'grab', 'taxi', 'lyft']},
  {type: 'restaurants', category: ['chinese', 'filipino', 'italian', 'polish']},
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
    amount: parseFloat((getRandomInt(1, 1000)*Math.random()).toFixed(2))
  }

  data.push(item)

  time.add(2, 'hour');
}

console.log('created', data.length)
let i = 0;

db.spendings.ensureIndex({userID: 1})

function addRecord() {
  db.spendings.insert(data[i]).then( function() {
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
