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

const getNewsFeed = function (country, category) {
  return new Promise((resolve, reject) => {
    newsapi.v2
      .topHeadlines({
        category: category ? category : 'general',
        country: country ? country : 'us',
      })
      .then((response) => {
        console.log(response)
        resolve(response)
      })
  })
}

app.get('/api/news-feed', async (req, res) => {
  const { country, category } = req.query

  // To query /v2/top-headlines
  // All options passed to topHeadlines are optional, but you need to include at least one of them
  const newsFeed = await getNewsFeed(country, category)

  return res.send(newsFeed)
})

// app.all('*', async (req, res) => {
//   throw new NotFoundError()
// })

// app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(chalk.green(`News API is listening on port ${PORT}!`))
})
