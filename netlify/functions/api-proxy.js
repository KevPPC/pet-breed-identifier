const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const response = await fetch('http://54.254.194.136:183/dog-predict', {
      method: 'POST',
      body: event.body,
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}
