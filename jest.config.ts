export default {
    transform: {'^.+\\.(js|ts|jsx|tsx)?$': 'ts-jest'},
    verbose: true,
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    transformIgnorePatterns: [],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
};
