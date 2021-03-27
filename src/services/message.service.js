import { Subject } from 'rxjs';

const stocks_list = new Subject();

export const messageService = {
    addstock: (data) => stocks_list.next({ data }),
    clearstocks: () => stocks_list.next(),
    getstocks: () => stocks_list.asObservable()
};
