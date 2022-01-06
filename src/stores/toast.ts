import {observable} from 'mobx';

const toast = observable({
    isToastVisible: false,
    text: '',
    on(text: string) {
        this.text = text;
        this.isToastVisible = true;
    },
    off() {
        this.text = '';
        this.isToastVisible = false;
    },
});

export {toast};
