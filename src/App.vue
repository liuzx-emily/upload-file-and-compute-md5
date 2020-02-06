<style lang="scss">
input[type="button"],
.dropArea {
  display: inline-block;
  padding: 20px;
  margin: 15px 10px 0;
  cursor: pointer;
  vertical-align: top;
  font-size: 30px;
  background: white;
  border: 5px solid #bd7096;
  color: #bd7096;
  outline: none;
}
.dropArea {
  background: #fafafa;
  border-color: #aaa;
}
table {
  border-collapse: collapse;
  margin-top: 10px;
  width: 100%;
}
th,
td {
  border: 1px solid #bbb;
  text-align: center;
}
</style>
<template>
  <section>
    <input type="button" value="上传文件♥" ref="uploadFileButton" />
    <input type="button" value="上传文件夹♥" ref="uploadDirectoryButton" />
    <section class="dropArea" ref="dropArea">把文件拽进来</section>
    <table>
      <thead>
        <tr>
          <th width="40%">名称</th>
          <th>完整路径</th>
          <th>状态</th>
          <th>md5</th>
          <!-- <th>操作</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in uploader?uploader.list:[]" :key="task.id">
          <td>{{task.file.name}}</td>
          <td>{{task.path}}</td>
          <td>{{task.state}}</td>
          <td>{{task.md5}}</td>
          <!-- <td>
            <input type="button" value="移除" @click="removeFromList(index)" />
          </td>-->
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { LzxUploader, TASK_STATE } from "./LzxUploader/main";

export default {
  data() {
    return {
      uploader: null
    };
  },
  mounted() {
    this.uploader = new LzxUploader({
      uploadFileEl: this.$refs.uploadFileButton,
      uploadDirectoryEl: this.$refs.uploadDirectoryButton,
      dropAreaEl: this.$refs.dropArea
    });
  },
  methods: {
    removeFromList(index) {
      // this.uploader.list.splice(index, 1);
    }
  }
};
</script>