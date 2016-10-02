
const graphql = require('graphql');

const database = require('./database');

let incomeType = new graphql.GraphQLObjectType({
  name: 'Income',
  fields:  {
    _id: {
      type: graphql.GraphQLString,
      resolve: function(_ref) {
        let _id = _ref._id;
        return _id;
      }
    },
    category: {
      type: graphql.GraphQLString,
      resolve: function(_ref) {
        let category = _ref.category;
        return category;
      }
    },
    group: {
      type: graphql.GraphQLString,
      resolve: function(_ref) {
        let group = _ref.group;
        return group;
      }
    },
    amount: {
      type: graphql.GraphQLFloat,
      resolve: function(_ref3) {
        let amount = _ref3.amount;
        return amount;
      }
    },
    createDate: {
      type: graphql.GraphQLInt,
      resolve: function(_ref3) {
        let createDate = _ref3.createDate;
        return createDate;
      }
    },
    userID: {
      type: graphql.GraphQLString,
      resolve: function(_ref5) {
        let userID = _ref5.userID;
        return userID;
      }
    }
  }
});

let spendingType = new graphql.GraphQLObjectType({
  name: 'Spending',
  fields:  {
    _id: {
      type: graphql.GraphQLString,
      resolve: function(_ref) {
        let _id = _ref._id;
        return _id;
      }
    },
    category: {
      type: graphql.GraphQLString,
      resolve: function(_ref) {
        let category = _ref.category;
        return category;
      }
    },
    group: {
      type: graphql.GraphQLString,
      resolve: function(_ref) {
        let group = _ref.group;
        return group;
      }
    },
    amount: {
      type: graphql.GraphQLFloat,
      resolve: function(_ref3) {
        let amount = _ref3.amount;
        return amount;
      }
    },
    createDate: {
      type: graphql.GraphQLInt,
      resolve: function(_ref3) {
        let createDate = _ref3.createDate;
        return createDate;
      }
    },
    userID: {
      type: graphql.GraphQLString,
      resolve: function(_ref5) {
        let userID = _ref5.userID;
        return userID;
      }
    }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    spendings: {
      type: new graphql.GraphQLList(spendingType),
      args: {
        userID: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        startDate: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        endDate: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (_, { userID, startDate, endDate }) =>
                database.getSpendings(userID, startDate, endDate),
    },
    income: {
      type: new graphql.GraphQLList(incomeType),
      args: {
        userID: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        startDate: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        endDate: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (_, { userID, startDate, endDate }) =>
                database.getIncome(userID, startDate, endDate),
    }
  })
})

const mutationType = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createSpending: {
      type: spendingType,
  	  args: {
  		  category: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        group: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        amount: { type: new graphql.GraphQLNonNull(graphql.GraphQLFloat) },
        createDate: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        userID: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
  	  },
      resolve: (_, { category, group, amount, createDate, userID }) =>
  				  database.createSpending( category, group, amount, createDate, userID ),
    },
    createIncome: {
      type: incomeType,
  	  args: {
  		  category: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        group: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        amount: { type: new graphql.GraphQLNonNull(graphql.GraphQLFloat) },
        createDate: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        userID: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
  	  },
      resolve: (_, { category, group, amount, createDate, userID }) =>
  				  database.createIncome( category, group, amount, createDate, userID ),
    },
    updateSpending: {
  	  type: spendingType,
  	  args: {
        _id: { type: graphql.GraphQLString },
  		  category: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        group: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        amount: { type: new graphql.GraphQLNonNull(graphql.GraphQLFloat) },
        createDate: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        userID: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
  	  },
  	  resolve: (_, { _id, category, group, amount, createDate, userID }) =>
  				  database.updateSpending( _id, category, group, amount, createDate, userID ),
  	},
    updateIncome: {
  	  type: incomeType,
  	  args: {
        _id: { type: graphql.GraphQLString },
  		  category: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        group: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        amount: { type: new graphql.GraphQLNonNull(graphql.GraphQLFloat) },
        createDate: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        userID: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
  	  },
  	  resolve: (_, { _id, category, group, amount, createDate, userID }) =>
  				  database.updateIncome( _id, category, group, amount, createDate, userID ),
  	},
    removeSpending: {
  	  type: spendingType,
  	  args: {
  		  _id: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
  	  },
  	  resolve: (_, { _id }) => database.removeSpending(_id),
  	},
    removeIncome: {
  	  type: spendingType,
  	  args: {
  		  _id: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
  	  },
  	  resolve: (_, { _id }) => database.removeIncome(_id),
  	}
  })
})

module.exports = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
