const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// ১. কনফিগারেশন
const token = '8821189599:AAHSL8MZG3J3m__K4HFAP8EYvMd-xF91CrM'; // আপনার BotFather এর Token
const ADMIN_ID = 8864523429; // আপনার Telegram Numeric User ID

const bot = new TelegramBot(token, { polling: true });
const users = new Set(); // ইউজার আইডি সেভ রাখার জন্য

// ২. /start চাপলে ইউজার ট্র্যাকিং
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users.add(chatId);
  bot.sendMessage(chatId, 'স্বাগতম! আমাদের বটে আপনাকে ধন্যবাদ।');
});

// ৩. /user কম্যান্ড দিয়ে ইউজার সংখ্যা দেখা
bot.onText(/\/user/, (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;
  bot.sendMessage(ADMIN_ID, `📊 মোট বর্তমান ইউজার সংখ্যা: ${users.size} জন`);
});

// ৪. /B কম্যান্ড দিয়ে ব্রডকাস্ট মেসেজ (টেক্সট, পিকচার, ভিডিও) পাঠানো
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // কেবল অ্যাডমিনের জন্য প্রযোজ্য
  if (chatId !== ADMIN_ID) return;

  // ক্যাপশন বা টেক্সট থেকে চেক করা মেসেজটি /B দিয়ে শুরু হয়েছে কি না
  const captionOrText = msg.text || msg.caption || '';

  if (captionOrText.startsWith('/B')) {
    let totalSent = 0;

    users.forEach((userId) => {
      // মেসেজটি সকল ইউজারের কাছে কপি/ফরওয়ার্ড করা
      bot.copyMessage(userId, ADMIN_ID, msg.message_id)
        .then(() => totalSent++)
        .catch((err) => console.log(`মেসেজ পাঠানো যায়নি: ${userId}`));
    });

    bot.sendMessage(ADMIN_ID, `✅ ব্রডকাস্ট সফলভাবে শুরু হয়েছে! মোট ${users.size} জন ইউজারের কাছে পাঠানো হচ্ছে...`);
  }
});

// ৫. Render-এ ২৪/৭ সচল রাখার জন্য ডামি অ্যাপ
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is Active!'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));