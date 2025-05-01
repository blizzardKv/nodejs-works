const { Worker } = require('worker_threads');
const { performance, PerformanceObserver } = require('perf_hooks');

const arr = Array.from({length: 300000}, (_, i) => i + 1);
const arrClone = structuredClone(arr);

const performanceObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}`);
    });
});
performanceObserver.observe({ entryTypes: ['measure'] });

const splitArrayIntoParts = (arr, partsCount = 8) => {
    const result = [];
    const baseSize = Math.floor(arr.length / partsCount);
    let remainder = arr.length % partsCount;
    let start = 0;

    for (let i = 0; i < partsCount; i++) {
        const extra = remainder > 0 ? 1 : 0;
        const end = start + baseSize + extra;
        result.push(arr.slice(start, end));
        start = end;
        remainder--;
    }

    return result;
}

const calculateSync = (arrClone) => {
    performance.mark('sync calc start');

    arrClone.filter((it) => it % 3 === 0)?.length;

    performance.mark('sync calc end');
    performance.measure('sync', 'sync calc start', 'sync calc end');
}

const workerFunction = (arr) => {
    return new Promise((resolve, reject) => {
        const arrSplitByCoresCount = splitArrayIntoParts(arr);

        performance.mark('worker start');
        let results = [];
        let completed = 0;

        let acc = 0;
        for (let i = 0; i < arrSplitByCoresCount.length; i++) {
            const worker = new Worker('./worker.js', {
                workerData: arrSplitByCoresCount[i],
            });

            worker.on('message', (msg) => {
                results.push(msg);
                completed++;

                if (completed === arrSplitByCoresCount.length) {
                    const total = results.reduce((a, b) => a + b, 0);

                    performance.mark('worker end');
                    performance.measure('worker', 'worker start', 'worker end');

                    resolve(total);
                }
            })
        }
    })
}

// при больших значениях - worker работает быстрее, при небольших - синхронные вычисления быстрее
const fn = async () => {
    try {
        calculateSync(arrClone);
        await workerFunction(arr);
    } catch (e) {
        console.error(e.message);
    }
}

fn();