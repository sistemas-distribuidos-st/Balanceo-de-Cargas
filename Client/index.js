const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors({origin:true, credentials:true}))
app.use(express.static(__dirname +'/public'))

app.get('/', (req, res) => {
  	res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

