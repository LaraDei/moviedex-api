require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const movieData = require('./movieData.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization') 

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.get( '/movie', function handleGetMovies(req, res){
    const {genre, country, vote}= req.query
    let response = movieData
    console.log('moviedata')
    if (genre) {
        response = response.filter(movie =>
          movie.genre.toLowerCase().includes(genre.toLowerCase())
        )
    }
    if (country) {
        response = response.filter(movie =>
          movie.country.toLowerCase().includes(country.toLowerCase())
        )
    }
    if (vote) {
        response = response.filter(movie =>
          movie.avg_vote >= Number(vote)
        )
    }
    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})