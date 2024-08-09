本项目可提供前端监控的sdk
目前只支持在vue3项目中使用
使用方法：

```javascript
import {createApp} from 'vue';
import App from './App';
const app = createApp();
app.use(mysentry, {
  // reportUrl 上传错误的地址
  reportUrl: '/addError',
})；
```
