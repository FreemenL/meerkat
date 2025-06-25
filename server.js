const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text())
        
app.post('/reportData', (req, res) => {
    console.log(`req.body`,req.body)
    res.status(200).send('')
})

app.listen(8999, () => {
    console.log('server listen on port 8999...')
})