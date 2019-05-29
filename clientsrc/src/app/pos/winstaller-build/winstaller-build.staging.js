var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './release/packages/POSStaging-win32-x64',
    outputDirectory: './release/POS_winstaller',
    authors: 'Me',
    exe: 'POSStaging.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));