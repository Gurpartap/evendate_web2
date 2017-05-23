let telegram = require('telegram-bot-api'),
    api = new telegram({
        token: "306033696:AAGa7u-AaiYawaEBBlu8gfEl_lYpi7GHfkg",
        polling: true,
        updates: {
            enabled: true,
            get_interval: 500
        }
    }),
    bodyParser = require('body-parser'),
    express = require("express"),
    app = express(),
    winston = require('winston'),
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new winston.transports.File({filename: __dirname + '/tg_debug.log', json: true})
        ],
        exceptionHandlers: [
            new (winston.transports.Console)(),
            new winston.transports.File({filename: __dirname + '/tg_exceptions.log', json: true})
        ],
        exitOnError: false
    }),
    http = require('http'),
    ApiCaller = require('./APICaller'),
    DBCaller = require('./DBCaller'),
    dbCaller = new DBCaller(),
    KeyboardBuilder = require('./KeyboardBuilder.js'),
    telegraph = require('telegraph-node'),
    ph = new telegraph(),
    telegraph_token = '6aa707fb088b6efb50762cfba746414a345025f53cb280f0678b83e9eb59',
    restler = require('restler'),
    moment = require('moment'),
    smtpTransport = require('nodemailer-smtp-transport'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('../v1-config.json'));

let config_index = process.env.ENV ? process.env.ENV : 'local',
    real_config = config[config_index],
    transporter = nodemailer.createTransport(smtpTransport({
        host: real_config.smtp.host,
        port: real_config.smtp.port,
        secure: false,
        auth: {
            user: real_config.smtp.user,
            pass: real_config.smtp.password
        }
    }));

api.getMe()
    .then(function (data) {
        console.log(data);
        ph.createAccount('Evendate bot', {short_name: 'Evendate bot', author_name: 'Evendate bot'}).then((result) => {
            console.log(result)
        })
    })
    .catch(function (err) {
        console.log(err);
    });

const TOPIC_ICONS = {
    'Образование': '🎓 Образование',
    'Культура и искусство': '🎭 Культура и искусство',
    'Развлечения': '🎉 Развлечения',
    'Технологии': '🖥 Технологии',
    'Природа': '🐣 Природа',
    'Дизайн': '🎨 Дизайн',
    'Бизнес': '👔 Бизнес',
    'Деньги': '💵 Деньги',
    'Спорт': '⛹ Спорт',
    'Здоровье': '🏊 Здоровье',
    'Выставочные залы': '🏫 Выставочные залы',
    'Общество': '👥 Общество',
    'Встречи': '🏃 Встречи',
    'Публичные выступления': '🗣 Публичные выступления',
    'Отношения': '💑 Отношения'
};

const STATE_KEYS = {
    MENU: '⬅️ Меню',
    START: '/start',
    SUBS: "📫 Подписки",
    TOPICS: "📋 Темы",
    ORGANIZATIONS: "🏛 Организации",
    SEARCH: "🔍 Поиск",
    RECOMMENDATIONS: "🚀 Дай рекомендации",
    ABOUT: "ℹ️ О боте",
    FAQ: "❔ FAQ",
    FAQ_COMMAND: "/faq",
    SETTINGS: "⚙ Настройки",
    WRITE_TO_DEVELOPERS: "🖊 Написать разработчикам",
    RECOMMENDATIONS_TODAY: "📅 Сегодня",
    RECOMMENDATIONS_TOMORROW: "🔜 Завтра",
    RECOMMENDATIONS_WEEKEND: "🗓 На выходных",
    RECOMMENDATIONS_INTERESTING: "⭐️ Интересное",
    RECOMMENDATIONS_NEAR_5KM: "🛰️ События поблизости (до 5 км)",
    RECOMMENDATIONS_FREE: "💸 Бесплатно",

};

const STATES = {
    '/start': 'start',
    "📫 Подписки": 'subscriptions',
    "🔍 Поиск": 'search',
    "🚀 Дай рекомендации": 'recommendations',
    "ℹ️ О боте": 'about',
    "❔ FAQ": 'faq',
    "⚙ Настройки": 'settings',
    "🖊 Написать разработчикам": 'write_to_developers',
    "📅 Сегодня": 'recommendations_today',
    "🔜 Завтра": 'recommendations_tomorrow',
    "🗓 На выходных": 'recommendations_weekend',
    "⭐️ Интересное": 'recommendations_interesting',
    "📍️ События поблизости (до 1 км)": 'recommendations_nearby_1_km',
    "💸 Бесплатно": 'recommendations_free',
    "🛰️ События поблизости (до 5 км)": 'recommendations_nearby_5_km',
};

let users = {};
const start_keyboard = {
    "keyboard": [
        [STATE_KEYS.SUBS, STATE_KEYS.SEARCH],
        [STATE_KEYS.RECOMMENDATIONS],
        [STATE_KEYS.ABOUT, STATE_KEYS.FAQ],
        [STATE_KEYS.WRITE_TO_DEVELOPERS]
    ],
    "one_time_keyboard": true,
    "resize_keyboard": true
};

let startFromMenu = (chat_id, correct_cmd) => {
    let message_text = '';
    if (!correct_cmd) {
        message_text = 'Неверная команда. ';
    }
    api.sendMessage({
        chat_id: chat_id,
        text: message_text + 'Давайте начнем с меню.',
        reply_markup: JSON.stringify(start_keyboard)
    })
        .then((result) => {
            console.log(result)
        })
        .catch((err) => {
            console.log(err)
        });
};

let createTelegraphPage = (events, title) => {
    let content = [];
    events.forEach((value, index) => {
        let dates_text = '';

        if (value.first_event_date == value.last_event_date) {
            dates_text = moment.unix(value.first_event_date).format('DD.MM.YYYY');
        } else {
            dates_text = moment.unix(value.first_event_date).format('DD.MM.YYYY') + ' - ' + moment.unix(value.last_event_date).format('DD.MM.YYYY');
        }

        content.push({tag: 'hr'});
        content.push({tag: 'h3', children: [value.title]});
        content.push({tag: 'br'});
        content.push({tag: 'img', attrs: {src: value.image_horizontal_url}});
        content.push({tag: 'p', children: ['Организатор: ' + value.organization_short_name]});
        content.push({tag: 'p', children: ['Даты: ' + dates_text]});
        content.push({tag: 'br'});
        content.push({tag: 'br'});
        content.push({tag: 'p', children: [value.description]});
        content.push({tag: 'a', attrs: {href: value.link}, children: ['Подробнее']});
        content.push({tag: 'hr'});
    });
    return ph.createPage(telegraph_token, title, content, {
        return_content: true
    });
};

api.on('message', function (message) {

    if (!message) return;
    dbCaller.saveChat(message.chat);
    dbCaller.saveMessage(message);
    dbCaller.saveUser(message.from);

    if (message == undefined) return;

    let user_key = '_' + message.from.id;
    let current_state = '/start';

    if (users[user_key] == undefined) {
        users[user_key] = {
            user: message.from,
            states: [STATE_KEYS.START],
            search_results: [],
            search: {
                reply_markup: {}
            },
            recommendations: []
        };
    } else {
        current_state = users[user_key].states[users[user_key].states.length - 1];
    }

    // WITH STATE
    if (message.text != STATE_KEYS.START && message.text != STATE_KEYS.MENU) {
        switch (current_state) {
            case STATE_KEYS.SEARCH: {
                ApiCaller
                    .getEvents({
                        future: 'true',
                        q: message.text,
                        length: 15,
                        offset: 0,
                        fields: 'description,link,organization_short_name'
                    })
                    .then(res => {

                        users[user_key].search_results = res.data;

                        if (res.data.length == 0) {
                            api.sendMessage({
                                chat_id: message.chat.id,
                                text: 'К сожалению, ничего не найдено.'
                            })
                                .catch((err) => {
                                    console.log(err)
                                });
                            return true;
                        }
                        let _event = res.data[0],
                            buttons = [];
                        res.data.forEach((value, index) => {

                            if (index < 5) {

                                let showing_emoji = index == 0 ? '✅ ' : '';

                                buttons.push({
                                    text: showing_emoji + ' ' + String(index + 1),
                                    callback_data: 'show_search_event.' + index
                                });

                            }
                        });

                        createTelegraphPage(res.data, 'Результаты поиска по запросу: ' + message.text)
                            .then((result) => {

                                users[user_key].search.reply_markup = {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: 'Подробнее',
                                                url: _event.link
                                            }
                                        ],
                                        buttons,
                                        [
                                            {
                                                text: 'Показать все ' + res.data.length + ' событий',
                                                url: result.url
                                            }
                                        ]
                                    ]
                                };

                                api.sendPhoto({
                                    chat_id: message.chat.id,
                                    caption: _event.title + ' \n \n ' + _event.description,
                                    photo: _event.image_horizontal_url,
                                    reply_markup: JSON.stringify(users[user_key].search.reply_markup)
                                })
                                    .then((result) => {
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    });
                            });
                    })
                    .catch(err => {
                        console.log('ERROR', err);
                    });
                return;
            }
            case STATE_KEYS.SUBS: {
                let keyword = '',
                    is_topic = false;
                for (let topic_key in TOPIC_ICONS) {
                    if (TOPIC_ICONS.hasOwnProperty(topic_key)) {
                        if (TOPIC_ICONS[topic_key] == message.text) {
                            is_topic = true;
                            keyword = topic_key;
                        }
                    }
                }
                if (!is_topic) break;
                dbCaller.getTopicTags(keyword)
                    .then(res => {
                        let message_text;
                        if (res.length == 1) {
                            message_text = res[0].keyword;
                        } else {
                            message_text = [];
                            res.forEach(row => {
                                if (row.is_tags == false) {
                                    message_text.push(row.keyword);
                                }
                            });
                            message_text = message_text.join(', ');
                        }
                        dbCaller.getIsSubscribed(message.chat.id, keyword)
                            .then(is_subscribed => {
                                let keyboard = {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: is_subscribed ? 'Отписаться' : 'Подписаться',
                                                callback_data: is_subscribed ? 'unsubscribe.' + keyword : 'subscribe.' + keyword
                                            },
                                            {
                                                text: KeyboardBuilder.getBackButtonText(),
                                                callback_data: 'go_to_menu'
                                            }
                                        ]
                                    ]
                                };
                                api.sendMessage({
                                    chat_id: message.chat.id,
                                    text: 'Подписка на эту тему позволит получать уведомления о событиях по таким тематикам как: ' + message_text,
                                    reply_markup: JSON.stringify(keyboard)
                                })
                                    .catch((err) => {
                                        console.log(err)
                                    });

                            })
                            .catch((err) => {
                                console.log(err)
                            });

                    })
                    .catch((err) => {
                        console.log(err)
                    });
                return;
            }
            case STATE_KEYS.WRITE_TO_DEVELOPERS: {
                let html = '';
                let letter = message.from;
                letter.__text = message.text;
                for (let i in letter) {
                    if (letter.hasOwnProperty(i)) {
                        html += '<p><strong>' + i + ':</strong> ' + letter[i] + '</p>';
                    }
                }
                transporter.sendMail({
                    debug: true,
                    connectionTimeout: 50000,
                    greetingTimeout: 50000,
                    socketTimeout: 50000,
                    from: 'feedback@evendate.ru',
                    to: 'support@evendate.ru',
                    subject: 'Обратная связь!',
                    html: html
                }, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                });
                api.sendMessage({
                    chat_id: message.chat.id,
                    text: 'Спасибо за Ваше сообщение! Мы постараемся Вам ответить как можно скорее!',
                    reply_markup: JSON.stringify(start_keyboard)
                })
                    .then((result) => {
                        console.log(result)
                    })
                    .catch((err) => {
                        console.log(err)
                    });
                users[user_key].states.push(STATE_KEYS.START);
                return;
            }
        }
    }

    //WITHOUT STATE

    switch (message.text) {
        case STATE_KEYS.MENU:
        case STATE_KEYS.START: {
            api.sendMessage({
                chat_id: message.chat.id,
                text: 'Добро пожаловать, товарищ!',
                reply_markup: JSON.stringify(start_keyboard)
            })
                .catch((err) => {
                    console.log(err)
                });
            users[user_key].states = [STATE_KEYS.START];
            break;
        }
        case STATE_KEYS.SEARCH: {
            api.sendMessage({
                chat_id: message.chat.id,
                text: 'Введите ключевые слова, по которым искать события',
                reply_markup: KeyboardBuilder.getMarkup()
            })
                .catch((err) => {
                    console.log(err)
                });
            users[user_key].states.push(STATE_KEYS.SEARCH);
            break;
        }
        case undefined:
        case STATE_KEYS.RECOMMENDATIONS_TOMORROW:
        case STATE_KEYS.RECOMMENDATIONS_WEEKEND:
        case STATE_KEYS.RECOMMENDATIONS_INTERESTING:
        case STATE_KEYS.RECOMMENDATIONS_TODAY:
        case STATE_KEYS.RECOMMENDATIONS_FREE: {

            if (message.text == undefined && !message.location) {
                return;
            }

            let filters = {
                    future: true,
                    fields: 'actuality,description,link,organization_short_name,nearest_event_date',
                    order_by: '-actuality',
                    length: 20
                },
                recommendation_key = STATES[message.text];

            switch (message.text) {
                case STATE_KEYS.RECOMMENDATIONS_INTERESTING: {
                    filters.fields += ',favored_users_count';
                    filters.order_by = '-favored_users_count';
                    break;
                }
                case STATE_KEYS.RECOMMENDATIONS_WEEKEND: {
                    let _day = moment();
                    while (_day.isoWeekday() != 6 && _day.isoWeekday() != 7) {
                        _day.add(1, 'days');
                    }
                    filters.since = _day.format('YYYY-MM-DD 00:00:01');
                    if (_day.isoWeekday() == 6) {
                        _day.add(1, 'days');
                    }
                    filters.till = _day.format('YYYY-MM-DD 23:59:59');
                    filters.order_by += ',-favored_users_count';

                    break;
                }
                case STATE_KEYS.RECOMMENDATIONS_TODAY: {
                    filters.date = moment().format('YYYY-MM-DD');
                    break;
                }
                case STATE_KEYS.RECOMMENDATIONS_FREE: {
                    filters.is_free = true;
                    break;
                }
                case undefined: {
                    filters.point = message.location.latitude + ' ' + message.location.longitude;
                    filters.distance = 5000;
                    break;
                }
            }

            ApiCaller.getEvents(filters)
                .then((res) => {

                    users[user_key].recommendations[recommendation_key] = {
                        reply_markup: [],
                        results: res.data
                    };

                    if (res.data.length == 0) {
                        api.sendMessage({
                            chat_id: message.chat.id,
                            text: 'К сожалению, ничего не найдено.'
                        })
                            .catch((err) => {
                                console.log(err)
                            });
                        return;
                    }
                    let _event = res.data[0],
                        buttons = [];
                    res.data.forEach((value, index) => {
                        if (index < 5) {
                            let showing_emoji = index == 0 ? '✅ ' : '';
                            buttons.push({
                                text: showing_emoji + ' ' + String(index + 1),
                                callback_data: recommendation_key + '.' + index
                            });

                        }
                    });

                    createTelegraphPage(res.data, 'Рекомендации: ' + message.text)
                        .then((result) => {
                            users[user_key].recommendations[recommendation_key].reply_markup = {
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Подробнее',
                                            url: _event.link
                                        }
                                    ],
                                    buttons,
                                    [
                                        {
                                            text: 'Показать все ' + res.data.length + ' событий',
                                            url: result.url
                                        }
                                    ]
                                ]
                            };

                            console.log(JSON.stringify(users[user_key].recommendations[recommendation_key].reply_markup));

                            api.sendPhoto({
                                chat_id: message.chat.id,
                                caption: _event.title + ' \n \n ' + _event.description,
                                photo: _event.image_horizontal_url,
                                reply_markup: JSON.stringify(users[user_key].recommendations[recommendation_key].reply_markup)
                            })
                                .then((result) => {
                                })
                                .catch((err) => {
                                    console.log(err)
                                });
                        });
                });

            api.sendMessage({
                chat_id: message.chat.id,
                text: 'Сейчас подберем самые лучшие события'
            })
                .then((result) => {
                })
                .catch((err) => {
                    console.log(err)
                });

            break;
        }
        case STATE_KEYS.RECOMMENDATIONS: {
            users[user_key].states.push(STATE_KEYS.RECOMMENDATIONS);

            let keyboard = [
                [STATE_KEYS.RECOMMENDATIONS_TODAY],
                [STATE_KEYS.RECOMMENDATIONS_TOMORROW],
                [STATE_KEYS.RECOMMENDATIONS_WEEKEND],
                [STATE_KEYS.RECOMMENDATIONS_INTERESTING],
                [STATE_KEYS.RECOMMENDATIONS_FREE]];

            if (!message.chat.type || message.chat.type != 'group') {
                keyboard.push([{text: STATE_KEYS.RECOMMENDATIONS_NEAR_5KM, request_location: true}]);
            }

            api.sendMessage({
                chat_id: message.chat.id,
                text: 'Выберите какого типа Вам рекомендовать события',
                reply_markup: KeyboardBuilder.getMarkup(keyboard
                )
            })
                .then((result) => {
                })
                .catch((err) => {
                    console.log(err)
                });
            return;
        }
        case STATE_KEYS.SUBS: {
            users[user_key].states.push(STATE_KEYS.SUBS);

            let buttons = [];
            dbCaller.getSubTopics(message.chat.id)
                .then(sub_rows => {
                    let message_text = 'Выберите какого типа подписки Вы хотите редактировать. ';
                    if (sub_rows.length > 0) {
                        message_text += 'Текущие подписки: ';
                        sub_rows.forEach(sub_row => {
                            message_text += '\n ✔️ ' + sub_row.keyword;
                        });
                    } else {
                        message_text += 'Сейчас подписок нет';
                    }

                    dbCaller.getTopics()
                        .then(rows => {
                            rows.forEach(row => {
                                buttons.push([TOPIC_ICONS[row.keyword]]);
                            });
                            api.sendMessage({
                                chat_id: message.chat.id,
                                text: message_text,
                                reply_markup: KeyboardBuilder.getMarkup(buttons)
                            })
                                .then((result) => {
                                })
                                .catch((err) => {
                                    console.log(err)
                                });
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                })
                .catch((err) => {
                    console.log(err)
                });

            return;
        }
        case STATE_KEYS.WRITE_TO_DEVELOPERS: {
            users[user_key].states.push(STATE_KEYS.WRITE_TO_DEVELOPERS);

            api.sendMessage({
                chat_id: message.chat.id,
                text: 'Напишите Ваше сообщение, мы его обязательно получим и постараемся Вам ответить как можно скорее',
                reply_markup: KeyboardBuilder.getMarkup()
            })
                .then((result) => {
                })
                .catch((err) => {
                    console.log(err)
                });
            return;
        }
        case STATE_KEYS.ABOUT: {
            api.sendMessage({
                chat_id: message.chat.id,
                text: 'Бот разработан командой Evendate.\n\n' +
                'EvendateBot поможет не пропускать интересные события. За подробной инструкцией по работе нажмите нажмите /faq. \n\n' +
                'https://evendate.io'
            })
                .catch((err) => {
                    console.log(err)
                });
            return;
        }
        case STATE_KEYS.FAQ_COMMAND:
        case STATE_KEYS.FAQ: {
            api.sendMessage({
                chat_id: message.chat.id,
                text: 'Мы собрали ответы на часто задаваемые вопросы на специальной странице: ' +
                'http://telegra.ph/FAQ-po-rabote-s-EvendateBot-02-26' +
                '\n\n Если у Вас возникли вопросы, напишите нам',
                reply_markup: KeyboardBuilder.getMarkup(
                    [
                        [STATE_KEYS.WRITE_TO_DEVELOPERS]
                    ]
                )

            })
                .catch((err) => {
                    console.log(err)
                });
            return;
        }
        default: {
            api.sendMessage({
                chat_id: message.chat.id,
                text: 'Я не знаю что делать =( Попробуйте начать сначала',
                reply_markup: KeyboardBuilder.getMarkup()
            })
                .catch((err) => {
                    console.log(err)
                });
            return
        }
    }
});


api.on('inline.callback.query', function (msg) {

    console.log(msg);
    let data = msg.data; //Value from 'callback_data' field of clicked button

    if (msg == undefined) return;

    let user_key = '_' + msg.from.id;
    if (users[user_key] == undefined) return startFromMenu(msg.message.chat.id);


    let command = data.split('.');
    switch (command[0]) {
        case 'show_search_event': {
            if (!users[user_key].search.reply_markup.inline_keyboard
                || users[user_key].search.reply_markup.inline_keyboard.length == 0
                || users[user_key].search_results.length < command[1]) {
                return startFromMenu(msg.message.chat.id);
            }
            users[user_key].search.reply_markup.inline_keyboard[0][0].url = _event.url;
            users[user_key].search.reply_markup.inline_keyboard[1].forEach((value, index) => {

                let showing_emoji = index == command[1] ? '✅ ' : '';

                users[user_key].search.reply_markup.inline_keyboard[1][index].text = showing_emoji + ' ' + String(index + 1);
            });

            let _event = users[user_key].search_results[command[1]];
            console.log(_event);
            api.sendPhoto({
                chat_id: msg.message.chat.id,
                caption: _event.title + ' \n \n ' + _event.description,
                photo: _event.image_horizontal_url,
                reply_markup: JSON.stringify(users[user_key].search.reply_markup)
            })
                .then((result) => {
                    console.log(result)
                })
                .catch((err) => {
                    console.log(err)
                });
            break;
        }
        case 'go_to_menu': {
            startFromMenu(msg.message.chat.id, true);
            break;
        }
        case 'unsubscribe': {
            dbCaller.setSubscriptionStatus(msg.message.chat.id, command[1], false)
                .then(res => {
                    api.editMessageReplyMarkup({
                        chat_id: msg.message.chat.id,
                        message_id: msg.message.message_id,
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Подписаться',
                                        callback_data: 'subscribe.' + command[1]
                                    },
                                    {
                                        text: KeyboardBuilder.getBackButtonText(),
                                        callback_data: 'go_to_menu'
                                    }
                                ]
                            ]
                        })
                    })
                        .then((result) => {
                            console.log(result)
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                    api.sendMessage({
                        chat_id: msg.message.chat.id,
                        text: 'Вы отписались от темы ' + command[1]
                    });

                })
                .catch((err) => {
                    console.log(err)
                });

            break;
        }
        case 'subscribe': {
            dbCaller.setSubscriptionStatus(msg.message.chat.id, command[1], true)
                .then(res => {
                    api.editMessageReplyMarkup({
                        chat_id: msg.message.chat.id,
                        message_id: msg.message.message_id,
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Отписаться',
                                        callback_data: 'unsubscribe.' + command[1]
                                    },
                                    {
                                        text: KeyboardBuilder.getBackButtonText(),
                                        callback_data: 'go_to_menu'
                                    }
                                ]
                            ]
                        })
                    })
                        .then((result) => {
                            console.log(result)
                        })
                        .catch((err) => {
                            console.log(err)
                        });

                    api.sendMessage({
                        chat_id: msg.message.chat.id,
                        text: 'Вы подписались на тему ' + command[1]
                    });
                })
                .catch((err) => {
                    console.log(err)
                });
            break;
        }
        case 'recommendations_tomorrow':
        case 'recommendations_weekend':
        case 'recommendations_interesting':
        case 'recommendations_today':
        case 'undefined':
        case 'recommendations_free': {
            if (!users[user_key].recommendations[command[0]].reply_markup.inline_keyboard
                || users[user_key].recommendations[command[0]].reply_markup.inline_keyboard.length == 0
                || users[user_key].recommendations[command[0]].results.length < command[1]) {
                return startFromMenu(msg.message.chat.id);
            }
            users[user_key].recommendations.reply_markup.inline_keyboard[0][0].url = _event.url;
            users[user_key].recommendations[command[0]].reply_markup.inline_keyboard[1].forEach((value, index) => {

                let showing_emoji = index == command[1] ? '✅ ' : '';

                users[user_key].recommendations[command[0]].reply_markup.inline_keyboard[1][index].text = showing_emoji + ' ' + String(index + 1);
            });

            let _event = users[user_key].recommendations[command[0]].results[command[1]];
            console.log(_event);
            api.sendPhoto({
                chat_id: msg.message.chat.id,
                caption: _event.title + ' \n \n ' + _event.description,
                photo: _event.image_horizontal_url,
                reply_markup: JSON.stringify(users[user_key].recommendations[command[0]].reply_markup)
            })
                .then((result) => {
                    console.log(result)
                })
                .catch((err) => {
                    console.log(err)
                });
        }

    }
    //do stuff
});

app.listen(5000, function () {
    console.log('TG listening on port 5000!');
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.get('/events/:id', function (req, res) {
    ApiCaller.getEvents({
        id: req.params.id,
        fields: 'link,description'
    }).then(res => {
        console.log(res);
        if (res.data.length == 1) {
            let _event = res.data[0];
            dbCaller.getToNotify(_event.id)
                .then((chats) => {
                console.log(chats);
                    chats.forEach(chat => {
                        api.sendPhoto({
                            chat_id: chat.chat_id,
                            caption: _event.title + ' \n \n ' + _event.description,
                            photo: _event.image_horizontal_url,
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [{text: 'Подробнее', url: _event.link}]
                                ]
                            })
                        })
                            .then((result) => {})
                            .catch((err) => {
                                console.log(err)
                            });

                    });
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    })
        .catch((err) => {
            console.log(err)
        });
    res.json({status: true});
});
