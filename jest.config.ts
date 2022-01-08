export default {
    preset: 'react-native',
    displayName: 'MoinTest',
    moduleDirectories: ['node_modules'],
    verbose: true,
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['/node_modules/(?!(@react-native|react-native)/).*/'],
    moduleNameMapper: {
        'react-dom': 'react-native',
    },
};
