const fs = require('fs');
const path = require('path');
const plist = require('plist');

// Читаем версию из package.json
const packageJson = require('../package.json');
const version = packageJson.version;

// Обновляем Info.plist для iOS
const infoPlistPath = path.join(__dirname, '../ios/OpenWebUIReact/Info.plist');
const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
infoPlist.CFBundleShortVersionString = version;
infoPlist.CFBundleVersion = version;
fs.writeFileSync(infoPlistPath, plist.build(infoPlist)); 