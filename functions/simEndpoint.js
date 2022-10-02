const axios = require('axios');
const cheerio = require('cheerio');

const login = async (npm, password) => {
  const url = "https://simkuliah.unsyiah.ac.id/index.php";
  const cookie = await axios.get(url)
  .then((res) => {
    return res.headers['set-cookie'][0].split('; ')[0];
  })
  const body = new URLSearchParams({
    username: npm,
    password: password,
  })
  const hitLogin = await axios.post(`${url}/login`, 
    body,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        cookie: cookie,
      },
    })
  .then((res) => {
    return res.data;
  })

  const $ = cheerio.load(hitLogin);
  const name = $('.user-profile a span').text();
  const typeOfUser = $('.nav-right li .label-danger').text();
  if (name === '') {
    return null
  } else {
    return {
      name,
      typeOfUser,
    };
  }
}

exports.handler = async (event, handler) => {
  // const { npm, password } = JSON.parse(event.body);
  const { npm, password } = event.queryStringParameters;
  const result = await login(npm, password);
  if (result == null) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Failed Login"
      })
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}