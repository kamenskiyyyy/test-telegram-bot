const {againOptions, gameOptions} = require("./options");
const TelegramApi = require("node-telegram-bot-api");

const token = "5150738637:AAHQ3Jk-76Er5A54H5N7-c-idq0nrS4fz0U"
const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Я загадываю цифры от 0 до 10, а тебе нужно ее угадать)")
    chats[chatId] = Math.floor(Math.random() * 10)
    setTimeout(() => bot.sendMessage(chatId, "Отгадаешь?", gameOptions), 1000)
}

const startApp = async () => {
    await bot.setMyCommands([
        {command: "/start", description: "Приветствие"},
        {command: "/info", description: "Информация"},
        {command: "/game", description: "Игра"},
    ])

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg?.chat.id;

        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp")
            await bot.sendMessage(chatId, "Добро пожаловать в тестовый бот Каменева Николая c:")
            return setTimeout(() => bot.sendMessage(chatId, "Поиграем в игру?  Жми /game"), 1000)
        }
        if (text === "/info") {
            return await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return await startGame(chatId)
        }
        return await bot.sendMessage(chatId, 'Я тебя не понимаю :c')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return await startGame(chatId)
        }
        if (+data === chats[chatId]) {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/22.webp")
            return await bot.sendMessage(chatId, "Ты угадал!", againOptions)
        } else {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/9.webp")
            return await bot.sendMessage(chatId, "Не угадал :c", againOptions)
        }

    })
}

startApp()
