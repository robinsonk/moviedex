require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const movies = require('./movies.json')
const cors = require('cors')

//should be able to GET movies by genre, country, or avg_vote

const app = express()

app.use(morgan('dev'))
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken == apiToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Danger, Will Robinson: Unauthorized Request'})
    }
    //move on
    next()
})

app.get('/movies', function handleGetMovies(req, res) {
    let response = movies;

    //filter out movies by genre is query is present
    if (req.query.genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }
    if (req.query.country) {
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())    
        )
    }
    if(req.query.avg_vote) {
        response = response.filter(movie =>
           movie.avg_vote >= Number(req.query.avg_vote)      
        )
    }

    res.json(response)

})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Sever listening on PORT ${PORT}`)
})