const express=require('express');
const bodyParser=require('body-parser');
const api=require('./routes/api')
const cors=require('cors')
const PORT=process.env.PORT || 8080;

const app=express();
app.use(bodyParser.json());

app.use(cors());
app.use('/api',api);


app.listen(PORT,function () {
    console.log("server running on port :" +PORT);
})