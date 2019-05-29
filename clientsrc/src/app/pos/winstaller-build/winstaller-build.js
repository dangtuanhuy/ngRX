var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './release/packages/POS-win32-x64',
    outputDirectory: './release/POS_winstaller',
    authors: 'Me',
    exe: 'POS.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));