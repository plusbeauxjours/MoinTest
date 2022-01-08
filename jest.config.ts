export default {
    preset: 'react-native',
    displayName: 'MoinTest',
    moduleDirectories: ['node_modules'],
    verbose: true,
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['/node_modules/(?!(@react-native|react-native|react-native-gesture-handler)/).*/'],
    moduleNameMapper: {
        'react-dom': 'react-native',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    },
};
