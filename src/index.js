require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
require('express-async-errors')
// const { errorHandler } = require('./middlewares/error-handler')
const NewsAPI = require('newsapi')
const newsapi = new NewsAPI(process.env.NEWS_API_KEY)

const app = express()

app.set('trust proxy', true)

app.use(express.json())

app.get('/api/news-feed', (req, res) => {
  const { country, category } = req.query

  // To query /v2/top-headlines
  // All options passed to topHeadlines are optional, but you need to include at least one of them
  newsapi.v2
    .topHeadlines({
      category: category ? category : 'general',
      country: country ? country : 'us',
    })
    .then((response) => {
      console.log(response)
      return res.send({ status: true, data: response.data })
    })
})

// app.all('*', async (req, res) => {
//   throw new NotFoundError()
// })

// app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(chalk.green(`News API is listening on port ${PORT}!`))
})
