import { TASK_STATE } from "./state";
let __uuid = 0;
class Task {
    constructor(params) {
        this.id = __uuid++;
        this.state = TASK_STATE.INITIALIZATION;
        this.errMsg = "";
        this.file = params.file;
        this.path = params.path;
        this.md5 = null;
        // 计算md5
        this.state = TASK_STATE.COMPUTING_MD5;
        params.computingMd5Factory.addFile(this.file).then(md5 => {
            this.md5 = md5;
            this.state = TASK_STATE.FINISHED;
        }).catch(errMsg => {
            this.errMsg = errMsg;
            this.state = TASK_STATE.ERROR;
        });
    }
}
export default Task;