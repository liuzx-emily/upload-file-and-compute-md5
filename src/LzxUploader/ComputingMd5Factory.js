import { TASK_STATE } from "./state";

import ComputingMd5Worker from 'worker-loader!./ComputingMd5Worker.js';

class MD5Factory {

    constructor() {
        this.waitingList = [];
        this.workingCount = 0;
        this.maxWorkingCount = 5;
    }


    addFile(file) {
        return new Promise((addFileResolve, addFileReject) => {
            if (this.workingCount < this.maxWorkingCount) {
                this.workingCount++;
                this.computeMd5({ file, addFileResolve, addFileReject });
            } else {
                this.waitingList.push({ file, addFileResolve, addFileReject });
            }
        });

    }

    // 分块计算md5
    computeMd5({ file, addFileResolve, addFileReject }) {

        const worker = new ComputingMd5Worker();
        worker.postMessage({ file });
        worker.addEventListener("message", e => {
            if (e.data.isSuccessful) {
                addFileResolve(e.data.md5);
            } else if (e.data.isFailed) {
                addFileReject(e.data.errMsg);
            }
            if (this.waitingList.length > 0) {
                this.computeMd5(this.waitingList.shift());
            } else {
                this.workingCount--;
            }
            // 立刻终止worker
            worker.terminate();
        });


    }

}
export default MD5Factory;