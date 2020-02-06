
import Task from './Task'
import ComputingMd5Factory from './ComputingMd5Factory'


class Uploader {
    constructor({ uploadFileEl, uploadDirectoryEl, dropAreaEl }) {
        this.computingMd5Factory = new ComputingMd5Factory();
        this.list = [];
        uploadFileEl && this.initUploadFile(uploadFileEl);
        uploadDirectoryEl && this.initUploadDirectory(uploadDirectoryEl);
        dropAreaEl && this.initDragAndDrop(dropAreaEl);
    }

    addTask({ file, path }) {
        const task = new Task({ file, path, computingMd5Factory: this.computingMd5Factory })
        this.list.push(task)
    }

    initUploadFile(el) {
        const oRealButton = document.createElement("input");
        oRealButton.setAttribute("type", "file");
        oRealButton.setAttribute("multiple", true);
        oRealButton.style.display = "none";
        oRealButton.addEventListener("change", e => {
            let files = oRealButton.files;
            for (let i = 0; i <= files.length - 1; i++) {
                let file = files[i];
                // 这里的 file.webkitRelativePath 都是 "" ,不是我们想要的.要用 file.name
                this.addTask({ file, path: file.name })
            }
        });
        document.body.appendChild(oRealButton);
        el.addEventListener("click", e => {
            oRealButton.click();
        });
    }

    initUploadDirectory(el) {
        const oRealButton = document.createElement("input");
        oRealButton.setAttribute("type", "file");
        oRealButton.setAttribute("webkitdirectory", true);
        oRealButton.style.display = "none";
        oRealButton.addEventListener("change", e => {
            let files = oRealButton.files;
            for (let i = 0; i <= files.length - 1; i++) {
                let file = files[i];
                // 这里的 file.webkitRelativePath 就是我们想要的格式
                this.addTask({ file, path: file.webkitRelativePath });
            }
        })
        document.body.appendChild(oRealButton);
        el.addEventListener("click", e => {
            oRealButton.click();
        });
    }

    initDragAndDrop(el) {
        el.addEventListener("dragover", e => {
            e.preventDefault();
        });
        el.addEventListener("drop", e => {
            let items = e.dataTransfer.items;
            for (let i = 0; i <= items.length - 1; i++) {
                let item = items[i];
                if (item.kind === "file") {
                    let entry = item.webkitGetAsEntry();
                    this.getFileFromEntryRecursively(entry);
                }
            }
            e.preventDefault();
        });
    }

    getFileFromEntryRecursively(entry) {
        if (entry.isFile) {
            entry.file(file => {
                // 这里的 file.webkitRelativePath 都是 "" ,不是我们想要的.
                // entry.fullPath 是前面带斜杠的,要把斜杠去掉的
                let path = entry.fullPath.substring(1);
                this.addTask({ file, path });
            }, e => { console.log(e); });
        } else {
            let reader = entry.createReader();
            reader.readEntries(entries => {
                entries.forEach(entry => this.getFileFromEntryRecursively(entry));
            }, e => { console.log(e); });
        }
    }

}


export default Uploader;