const { app, BrowserWindow } = require('electron');
const electron = require('electron');
const path = require('path');
const url = require('url');
const squirrelUrl = 'http://178.128.212.67:80';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function sendStatusToWindow(text) {
  win.webContents.send('message', text);
}

const handleSquirrelEvent = () => {
  if (process.argv.length === 1) {
    return false;
  }

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
    case '--squirrel-uninstall':
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      app.quit();
      return true;
  }
};

if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const startAutoUpdater = squirrelUrl => {
  // The Squirrel application will watch the provided URL
  electron.autoUpdater.setFeedURL(`${squirrelUrl}/`);

  // Display a success message on successful update
  electron.autoUpdater.addListener('checking-for-update', () => {
    sendStatusToWindow('checking for update');
  });

  // Display a success message on successful update
  electron.autoUpdater.addListener('update-available', () => {
    sendStatusToWindow('update available');
  });

  // Display a success message on successful update
  electron.autoUpdater.addListener('update-not-available', () => {
    sendStatusToWindow('update not available');
  });

  electron.autoUpdater.on('download-progress', progressObj => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message =
      log_message +
      ' (' +
      progressObj.transferred +
      '/' +
      progressObj.total +
      ')';
    sendStatusToWindow(log_message);
  });

  // Display a success message on successful update
  electron.autoUpdater.addListener(
    'update-downloaded',
    (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
          'A new version has been downloaded. Restart the application to apply the updates.'
      };
      electron.dialog.showMessageBox(dialogOpts, response => {
        if (response === 0) {
          electron.autoUpdater.quitAndInstall();
        }
      });
    }
  );

  // Display an error message on update error
  electron.autoUpdater.addListener('error', error => {
    electron.dialog.showMessageBox({ message: 'Auto updater error: ' + error });
  });

  // tell squirrel to check for updates
  electron.autoUpdater.checkForUpdates();
};

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    icon: path.join(__dirname, 'favicon.ico'),
    fullscreen: true
    // width: 1400,
    // height: 800
  });

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index-pos.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow();
  setTimeout(function () {
    startAutoUpdater(squirrelUrl);
  }, 1000);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
