<script setup lang="ts">
import { nextTick, ref } from 'vue'
import axios from 'axios'
import { findCodeBySourceMap } from '@/utils/sourceMap'
import hljs from 'highlight.js/lib/core'

const tableData = ref([])
const dialogVisible = ref<boolean>(false)
const hightCodeDiv = ref()

// 获取错误列表
const getErrorList = () => {
  axios.get('/getErrorList').then((res) => {
    console.log(res.data, '<==res')
    tableData.value = res.data.data
    console.log(tableData.value, '<==tableData')
  })
}

// 此错误类型会被Vue.config.errorHandler捕获
const handleClick = () => {
  let a = undefined
  if (a.length) {
    console.log('111')
  }
  // getErrorList()
}

// 此类型错误会被全局的error事件捕获
const handleAsync = () => {
  setTimeout(() => {
    JSON.parse('')
  })
}

const handlePromise = () => {
  // new Promise((resolve, reject) => {
  //   let person = {}
  //   // person.name.age()
  //   resolve()
  //   // reject('error')
  // })
  new Promise((resolve) => {
    // this.getTableData();
    let person = {}
    person.name.age()
    resolve(true)
  })
}

const handleHttp = () => {
  axios
    .get('https://abc.com/test/api')
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
}

const handlePostHttp = () => {
  axios.post('/1231', { a: 1, b: 2 }).then((res) => console.log(res))
}

const handleFetchGet = () => {
  fetch('/getList', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      console.log(res, '<+++fetch res')
      return res
    })
    .then((res) => {
      console.log('featch-res', res)
    })
}
const handleFetchPost = () => {
  fetch('/getList', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => console.log(res))
    .then((res) => {
      console.log('featch-res', res)
    })
}

const resourceError = () => {
  let script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://abc.com/index.js'
  document.body.appendChild(script)
}

const handlecheckSource = async (row) => {
  const sourceRes = await findCodeBySourceMap(row)
  console.log(sourceRes, '<===sourceRes');
  
  const lightCode = render(sourceRes.code.join('\n'), 'js', [[4, 'error']])
  dialogVisible.value = true
  nextTick(() => {
    hightCodeDiv.value.innerHTML = lightCode
  })
}
const handleGetErrorList = () => {
  getErrorList()
}

function render(content: string, language: string, styleList: any[]) {
  let html = hljs.highlight(content, { language }).value
  return html
    .split('\n')
    .map(
      (s, i) =>
        `<div class="${styleList.find((s) => s[0] === i)?.[1] || ''}"><line>${i}</line>${s}</div>`
    )
    .join('\n')
}

function format(time: string) {
  const str = new Date(time)
  return str.toLocaleDateString().replace(/\//g, '-') + ' ' + str.toTimeString().substr(0, 8)
}
</script>

<template>
  <main>
    <button @click="handleClick">点击错误</button>
    <button @click="handleAsync">异步错误</button>
    <button @click="handlePromise">Promise错误</button>
    <button @click="handleHttp">axios get请求错误</button>
    <button @click="handlePostHttp">axios post请求错误</button>
    <button @click="handleFetchGet">fetch get错误</button>
    <button @click="handleFetchPost">fetch post错误</button>
    <button @click="resourceError">资源错误</button>
    <button @click="handleGetErrorList">获取错误列表</button>
    <el-table :data="tableData">
      <el-table-column label="type" prop="type" width="auto"></el-table-column>
      <el-table-column label="message" prop="message" width="auto"></el-table-column>
      <el-table-column label="time">
        <template #default="scope">
          <span>{{ format(scope.row.time) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            v-if="scope.row.type === 'error'"
            @click="handlecheckSource(scope.row)"
            >查看源码</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="查看源码">
      <!-- <highlightjs autodetect :code="code" /> -->
      <div class="hight-code" ref="hightCodeDiv"></div>
    </el-dialog>
  </main>
</template>

<style>
line {
  color: #97979790;
  left: 10px;
  width: 30px;
  margin-right: 4px;
  display: inline-block;
  border-right: 1px solid #97979790;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.error {
  background-color: #ff000030;
}
</style>
