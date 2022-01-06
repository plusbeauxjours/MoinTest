import {observable} from 'mobx';

export interface ILogs {
    flag: string;
    code: string;
    currency: string;
    engName: string;
    korName: string;
    amount: string;
    createdAt: Date;
}
const history = observable({
    histories: [],
    add(log: ILogs) {
        this.histories.push(log);
    },
    remove(log: ILogs) {
        this.histories = this.histories.filter(h => h.createdAt !== log.createdAt);
    },
});

export {history};
