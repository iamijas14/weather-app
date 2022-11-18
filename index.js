const http = require('http');
const fs = require('fs');
const requests = require('requests');

const frontEnd = fs.readFileSync('home.html', 'utf-8');

// const fToC = (fahrenheit) => {
//   let fTemp = fahrenheit;
//   let fToCel = (fTemp - 32) * 5 / 9;
//   let cel = (Math.round(fToCel * 100) / 100).toFixed(2);
//     return cel;
// } 

const replaceItem = (tempVal, orgVal) => {
    let temperature = tempVal.replace('{%state%}', orgVal.name);
        temperature = temperature.replace('{%country%}', orgVal.sys.country);
        temperature = temperature.replace('{%temp%}', orgVal.main.temp);
        temperature = temperature.replace('{%tempMin%}', orgVal.main.temp_min);
        temperature = temperature.replace('{%tempMax%}', orgVal.main.temp_max);
        temperature = temperature.replace('{%tempStatus%}', orgVal.weather[0].main);

        return temperature;
}

const server = http.createServer((req, res) => {
    if(req.url == '/'){
        requests('https://api.openweathermap.org/data/2.5/weather?q=bangalore&appid=e9571887ae589378b53e0d3fcf658d92&units=metric')
        .on('data', (chunk) => {
            const weatherReport = JSON.parse(chunk);
            const arrData = [weatherReport];
            console.log(arrData)

            const realTimeData = arrData.map( item => replaceItem(frontEnd, item)).join("");
            res.write(realTimeData);
        })
        .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err);
        res.end()
        });
    }
});

server.listen(8000, 'localhost');
