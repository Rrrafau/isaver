require('babel-register')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config')
const express = require('express')
const path = require('path')

const React = require('react')
const ReactDOMServer = require('react-dom/server')
const { match, RouterContext } = require('react-router')
const { Provider } = require('react-redux')
const { configureStore } = require('./store/configureStore.js')
const _ = require('lodash')
const fs = require('fs')
const baseTemplate = fs.readFileSync('./index.html')
const template = _.template(baseTemplate)
const { Routes, Store } = require('./containers/Root.js')

const graphQLHTTP = require('express-graphql')
const schema = require('./database/schema.js')

const app = new express()
const port = 3001
const compiler = webpack(config)

const jwt = require('express-jwt');
const cors = require('cors');

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// Authentication middleware provided by express-jwt.
// This middleware will check incoming requests for a valid
// JWT on any routes that it is applied to.
const authCheck = jwt({
  secret: new Buffer('umANL39X-d7-LhcQV78cK30JbZUvH2d34pm8WnIsxKHC25_SQdkZU0RNCOUlpVz5', 'base64'),
  audience: 'dFI6x9UgMQP0dEeEOfpLeCaUrGsXXbO8'
});

app.use('/api', graphQLHTTP({
  schema: schema,
  pretty: true,
  graphiql: true,
}));

app.use('/public', express.static(__dirname + '/public'))

app.use(function(req, res) {
  // res.sendFile(__dirname + '/index.html')
  match({ routes: Routes(), location: req.url },
    (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      }
      else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      }
      else if (renderProps) {
        const body = ReactDOMServer.renderToString(
          React.createElement(Provider, { store: Store },
            React.createElement(RouterContext, renderProps)
          )
        )
        res.status(200).send(template({ body }))
      }
      else {
        res.status(404).send('Not found')
      }
    })
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
