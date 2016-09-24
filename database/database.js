var promisedMongo = require('promised-mongo');

var db = promisedMongo('mongodb://139.162.43.212/smartsaver');


export function updateSpending(_id, category, amount, createDate, userID) {
  let spendings = db.collection('spendings')
  let spending = {
	   createDate, category, amount, userID
  }

  db.spendings.ensureIndex({
    createDate: 1,
    userID: 1,
    category: 1
  })

  return db.spendings.update({
    createDate: createDate,
    userID: userID,
    category: category
  }, {
    $set: spending
  }, {
    upsert: true
  } ).then(function(res,item) {
    return {
      createDate, amount, userID, category
    }
  })
}

export function removeSpending(_id) {
  let spendings = db.collection('spendings')

  return db.spendings.remove({_id: pmongo.ObjectId('_id')})
    .then(({ _id }) => _id )
}

export function getCurrentSpendings(userID, createDate) {
  let spendings = db.collection('spendings')

  db.spendings.ensureIndex({
    createDate: 1,
    userID: 1
  })

  return db.spendings.find({ userID, createDate })
}

export function getSpendings(userID) {
  let spendings = db.collection('spendings')

  return db.spendings.find({ userID })
}
