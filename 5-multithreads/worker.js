const { parentPort, workerData } = require('worker_threads');

const calcItemsDividedByThree = (arr) => arr.filter((it) => it % 3 === 0)?.length;

parentPort.postMessage(calcItemsDividedByThree(workerData))