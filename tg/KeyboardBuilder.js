class KeyboardBuilder {


    static getBackButtonText() {
        return '⬅️ Меню';
    }

    static getMarkup(data) {
        let kb = {
            "keyboard": [],
            "one_time_keyboard": true,
            "resize_keyboard": true
        };
        if (data){
            kb.keyboard = data;
        }
        kb.keyboard.push([this.getBackButtonText()]);
        return JSON.stringify(kb);
    }
}


module.exports = KeyboardBuilder;