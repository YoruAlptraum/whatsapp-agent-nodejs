const express = require('express');
const app = express();
app.use(express.json());

const { handleWebhook, verifyWebhook } = require('./controllers/webhookController');

const port = process.env.PORT || 3000;

// Use webhook routes
app.post('/webhook', handleWebhook);

app.get('/webhook', verifyWebhook);

app.listen(port, () => {
  console.log(`Whatsapp app listening on port ${port}`);
});
