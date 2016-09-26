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

  var start, end;

  switch(timeline) {
    case 'day':
    case 'today':
      start = moment().tz('Asia/Manila').startOf('day')
      end = moment().tz('Asia/Manila').endOf('day')
      break;
    case 'yesterday':
      start = moment().tz('Asia/Manila').startOf('day').subtract(1, 'day')
      end = moment().tz('Asia/Manila').endOf('day').subtract(1, 'day')
      break;
    case 'week':
      start = moment().tz('Asia/Manila').startOf('week')
      end = moment().tz('Asia/Manila').endOf('week')
      break;
    case 'lastweek':
      start = moment().tz('Asia/Manila').subtract(1, 'week').startOf('week')
      end = moment().tz('Asia/Manila').subtract(1, 'week').endOf('week')
      break;
    case 'month':
      start = moment().tz('Asia/Manila').startOf('month')
      end = moment().tz('Asia/Manila').endOf('month')
      break;
    case 'lastmonth':
      start = moment().tz('Asia/Manila').subtract(1, 'month').startOf('month')
      end = moment().tz('Asia/Manila').subtract(1, 'month').endOf('month')
      break;
  }

  db.spendings.ensureIndex({ createDate: 1 })

  if(timeline !== 'all') {
    return db.spendings.find({ userID,
      createDate: { $gte: start.unix(), $lte: end.unix() }
    })
  }
  else {
    return db.spendings.find({ userID })
  }
}

/********* INCOME *********/

export function createIncome(category, group, amount, createDate, userID) {
  let income = db.collection('income')
  let item = {
	   createDate, group, category, amount, userID
  }

  return db.spendings.insert(item)
}

export function updateIncome(_id, category, group, amount, createDate, userID) {
  let income = db.collection('income')
  let values = {
	   createDate, group, category, amount, userID
  }

  return db.spendings.findAndModify({
			new: true, // return the newly modified document
			query: { _id: pmongo.ObjectId(_id) },
			update: { $set: values } }).then(({ value }) => value);
}

export function removeIncome(_id) {
  let income = db.collection('income')

  return db.income.remove({_id: pmongo.ObjectId(_id)})
    .then(() => {
      return {_id: _id }
  })
}

export function getIncome(userID, timeline) {
  let income = db.collection('income')

  var start, end;

  switch(timeline) {
    case 'day':
    case 'today':
      start = moment().tz('Asia/Manila').startOf('day')
      end = moment().tz('Asia/Manila').endOf('day')
      break;
    case 'yesterday':
      start = moment().tz('Asia/Manila').startOf('day').subtract(1, 'day')
      end = moment().tz('Asia/Manila').endOf('day').subtract(1, 'day')
      break;
    case 'week':
      start = moment().tz('Asia/Manila').startOf('week')
      end = moment().tz('Asia/Manila').endOf('week')
      break;
    case 'lastweek':
      start = moment().tz('Asia/Manila').subtract(1, 'week').startOf('week')
      end = moment().tz('Asia/Manila').subtract(1, 'week').endOf('week')
      break;
    case 'month':
      start = moment().tz('Asia/Manila').startOf('month')
      end = moment().tz('Asia/Manila').endOf('month')
      break;
    case 'lastmonth':
      start = moment().tz('Asia/Manila').subtract(1, 'month').startOf('month')
      end = moment().tz('Asia/Manila').subtract(1, 'month').endOf('month')
      break;
  }

  db.income.ensureIndex({ createDate: 1 })

  if(timeline !== 'all') {
    return db.income.find({ userID,
      createDate: { $gte: start.unix(), $lte: end.unix() }
    })
  }
  else {
    return db.income.find({ userID })
  }
}
