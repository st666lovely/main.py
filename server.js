const express = require('express');
const app = express();
app.use(express.json());

const BOT_TOKEN = '8785347014:AAG2PPnhP9DHw6Cg8zIZHJdYi6gu6g_yjWY';
const CHAT_ID = '-1003753568907';

app.post('/km-webhook', async (req, res) => {
  console.log('Full body:', JSON.stringify(req.body));

  try {
    // ChatBot gửi attributes trong req.body.attributes
    const attrs = req.body.attributes || {};
    const userAttrs = req.body.userAttributes || {};

    const region = attrs.Region || attrs.region || 'Không rõ';
    const username = userAttrs.default_name || attrs.Username || attrs.username || 'Không rõ';
    const phone = attrs['Phone number'] || attrs.phone_number || attrs['phone number'] || 'Không rõ';

    const text = `🎁 *Đăng ký nhận KM*\n\n🎮 Sảnh: ${region}\n👤 ID: ${username}\n🔢 Số chuỗi: ${phone}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });

    // Trả về đúng format ChatBot expect
    res.json({
      responses: [
        {
          type: 'text',
          message: 'Đã gửi đăng ký KM thành công! 🎁'
        }
      ]
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/km-webhook', (req, res) => {
  if (req.query.token !== 'km123') {
    res.writeHead(401);
    return res.end();
  }
  return res.end(req.query.challenge);
});

app.get('/', (req, res) => res.send('KM Webhook Server is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
