const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner(
  {
    serverUrl: 'http://192.168.99.101:9000',
    options: {
      'sonar.sources': './src',
    },
  },
  () => {}
);
