export const FEES = '1000';
export const MAXIMUM_KOR_AMOUNT = '55000000';
export const MINIMUM_KOR_AMOUNT = '0';
export const addThousandsSeparators = (amount: string): string => amount?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const KOREA = {flag: '🇰🇷', code: 'KR', currency: 'KRW', engName: 'South Korea', korName: '대한민국'};
