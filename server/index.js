//import required modules
const express = require('express');
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
const app = express();
const fs = require('fs');
const URL = require("url").URL;
//set up render engine,json retrival and post event handler
let settings = {method: "Get" };
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res, next) => {
    try {
        //read JSON URL
        var data = fs.readFileSync('json_link.txt', 'utf8');
        //get JSON by URL
        fetch(data, settings)
        .then(res => res.json())
        .then((json) => {
            //render response
            return res.render('index', {
                //populate data in response
                jsonURL : data,
                CityName : json.city.name,
                day1 : json.list[0].dt_txt,
                day2 : json.list[8].dt_txt,
                day3 : json.list[16].dt_txt,
                day4 : json.list[24].dt_txt,
                day5 : json.list[32].dt_txt,
                temp1 : ((json.list[0].main.temp_max/10).toFixed(1) + " degrees"),
                temp2 : ((json.list[8].main.temp_max/10).toFixed(1) + " degrees"),
                temp3 : ((json.list[16].main.temp_max/10).toFixed(1) + " degrees"),
                temp4 : ((json.list[24].main.temp_max/10).toFixed(1) + " degrees"),
                temp5 : ((json.list[32].main.temp_max/10).toFixed(1) + " degrees"),
                hummidity1 : (json.list[0].main.humidity + "%"),
                hummidity2 : (json.list[8].main.humidity + "%"),
                hummidity3 : (json.list[16].main.humidity + "%"),
                hummidity4 : (json.list[24].main.humidity + "%"),
                hummidity5 : (json.list[32].main.humidity + "%")
            });
        });
    } catch(e) {
        console.log('Error:', e.stack);
    }
});

//change link for JSON file
app.post('/',function(req,res){
    //check if string is a valid URL
    if (validStr(req.body.URLString)){
        //Update URL record
        fs.writeFile('json_link.txt', req.body.URLString, function(err) {
            if (err) throw err;
        });
    }
    else{
        //reset URL to default
        fs.writeFile('json_link.txt', 'https://samples.openweathermap.org/data/2.5/forecast?id=524901&appid=b6907d289e10d714a6e88b30761fae22', function(err) {
            if (err) throw err;
        });
    }
    res.redirect(req.get('referer'));
});


//used for testing purposes - returns the json found at the URL specified in json_link.txt
app.get('/json', (req, res, next) => {
    try {
        var data = fs.readFileSync('json_link.txt', 'utf8');
        fetch(data, settings)
        .then(res => res.json())
        .then((json) => {
            return res.send(json);
        });
    } catch(e) {
        console.log('Error:', e.stack);
    }
});
//check if a string is a valid URL
const validStr = (string) => {
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
};
//initialize application on port 8082
app.listen(8080);
module.export = app;

//https://samples.openweathermap.org/data/2.5/forecast?id=524901&appid=b6907d289e10d714a6e88b30761fae22