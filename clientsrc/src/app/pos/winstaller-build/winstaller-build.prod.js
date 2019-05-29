var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './release/packages/POSProd-win32-x64',
    outputDirectory: './release/POS_winstaller',
    authors: 'Me',
    exe: 'POSProd.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));