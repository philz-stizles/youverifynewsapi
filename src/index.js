require('dotenv').config()
const express = require('express')
const chalk = require('chalk')
require('express-async-errors')
const cors = require('cors')
// const { errorHandler } = require('./middlewares/error-handler')
const NewsAPI = require('newsapi')
const newsapi = new NewsAPI(process.env.NEWS_API_KEY)

const app = express()

// app.set('trust proxy', true)

// Cors
// app.use((req: Request, res: Response, next): Response | void => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'OPTIONS, GET, POST, PUT, PATCH, DELETE'
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');

//   // A fix for graphql response with status of 405 (Method Not Allowed)
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   return next();
// });

// CORS
app.use(
  cors()
  // origin: 'https://someurl.com'
) //

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
    // .catch((err) => console.log(response.message))
  })
}

app.get('/api/news-feed', async (req, res) => {
  try {
    const { country, category } = req.query

    // To query /v2/top-headlines
    // All options passed to topHeadlines are optional, but you need to include at least one of them
    const newsFeed = await getNewsFeed(country, category)

    return res.send(newsFeed)
  } catch (error) {
    console.log(error.message)
    return res.status(500)
  }
})

// app.all('*', async (req, res) => {
//   throw new NotFoundError()
// })

// app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(chalk.green(`News API is listening on port ${PORT}!`))
})
