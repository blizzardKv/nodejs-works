// use node-notifier to send notifications
const notifier = require('node-notifier');

function startTimer() {
    const receivedTime = process.argv[2];

    if (!receivedTime) {
        console.error('no received time passed');
        return null;
    }

    // принимаем '1h 30m 20s' pattern
    const parsedTime = receivedTime.split(' ');

    const millisecondsDelay = parsedTime.reduce((acc, timePart) => {
        if (timePart.includes('h')) {
            acc = acc + (timePart.replace('h', '') * 3600000);
        }

        if (timePart.includes('m')) {
            acc = acc + (timePart.replace('m', '') * 60000);
        }

        if (timePart.includes('s')) {
            acc = acc + (timePart.replace('s', '') * 1000);
        }

        return acc;
    }, 0);

    if (!millisecondsDelay) {
        console.error('passed incorrect time');
        return null;
    }

    setTimeout(() => {
        notifier.notify({
            title: 'Timer Notification',
            message: 'Time is up! Bing bing!',
            sound: true,
            wait: false
        });
    }, millisecondsDelay);
}

startTimer();