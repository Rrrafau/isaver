var pmongo = require('promised-mongo');
var moment = require('moment-timezone');

var db = pmongo('mongodb://139.162.43.212/smartsaver');

export function createSpending(category, group, amount, createDate, userID) {
  let spendings = db.collection('spendings')
  let spending = {
	   createDate, group, category, amount, userID
  }

  return db.spendings.insert(spending)
}

export function updateSpending(_id, category, group, amount, createDate, userID) {
  let spendings = db.collection('spendings')
  let spending = {
	   createDate, group, category, amount, userID
  }

  return db.spendings.findAndModify({
			new: true, // return the newly modified document
			query: { _id: pmongo.ObjectId(_id) },
			update: { $set: spending } }).then(({ value }) => value);
}

export function removeSpending(_id) {
  let spendings = db.collection('spendings')

  return db.spendings.remove({_id: pmongo.ObjectId(_id)})
    .then(() => {
      return {_id: _id }
  })
}

export function getCurrentSpendings(userID, createDate) {
  let spendings = db.collection('spendings')

  db.spendings.ensureIndex({
    createDate: 1,
    userID: 1
  })

  return db.spendings.find({ userID, createDate })
}

export function getSpendings(userID, timeline) {
  let spendings = db.collection('spendings')

  let m = moment().tz('Asia/Manila')

  var start, end;

  switch(timeline) {
    case 'day':
    case 'today':
      start = m.startOf('day')
      end = m.endOf('day')
      break;
    case 'yesterday':
      start = m.startOf('day').subtract(1, 'day')
      end = m.endOf('day').subtract(1, 'day')
      break;
    case 'week':
      start = m.startOf('week')
      end = m.endOf('week')
      break;
    case 'lastweek':
      start = m.subtract(1, 'week').startOf('week')
      end = m.subtract(1, 'week').endOf('week')
      break;
    case 'month':
      start = m.startOf('month')
      end = m.endOf('month')
      break;
    case 'lastmonth':
      start = m.subtract(1, 'month').startOf('month')
      end = m.subtract(1, 'month').endOf('month')
      break;
  }

  db.spendings.ensureIndex({ userID: 1, createDate: 1 })

  if(timeline !== 'all') {
    console.log(start.format('MMMM Do YYYY, h:mm:ss a'), end.format('MMMM Do YYYY, h:mm:ss a'), start.unix(), end.unix())
    return db.spendings.find({ userID,
      createDate: { $gte: start.unix(), $lte: end.unix() }
    })
  }
  else {
    return db.spendings.find({ userID })
  }
}
