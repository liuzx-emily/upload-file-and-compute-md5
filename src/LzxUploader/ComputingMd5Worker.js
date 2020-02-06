
import SparkMD5 from 'spark-md5'

const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

// Read in chunks of 2MB
const chunkSize = 1024 * 1024 * 1024;

self.addEventListener("message", e => {
    computeMd5(e.data.file).then(md5 => {
        self.postMessage({ isSuccessful: true, md5: md5 });
    }).catch(errMsg => {
        self.postMessage({ isFailed: true, errMsg });
    })
});

function computeMd5(file) {
    return new Promise((resolve, reject) => {
        var chunksCount = Math.ceil(file.size / chunkSize);
        var currentChunk = 0;
        var spark = new SparkMD5.ArrayBuffer();
        var fileReader = new FileReader();
        fileReader.onload = e => {
            spark.append(e.target.result);
            currentChunk++;
            if (currentChunk < chunksCount) {
                loadNext();
            } else {
                const md5 = spark.end();
                // 成功了【为了看出来效果，故意加了个延时】
                setTimeout(() => {
                    resolve(md5);
                }, 500);
            }
        };
        fileReader.onerror = e => {
            // 出错了
            reject("Something went wrong when reading the file");
        };
        function loadNext() {
            var start = currentChunk * chunkSize;
            var end = Math.min(start + chunkSize, file.size);

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
    });
}