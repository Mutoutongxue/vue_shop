import Vue from 'vue'
//import 'element-ui/lib/theme-chalk/index.css' //引入样式，这里是引入全部样式，你也可以单独引入某个组件样式
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main ,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,   //breadcrumb-item简写成
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox  //引入elmement ui的MessageBox弹框，
} from 'element-ui';           //按需求导入elemnet ui，需要的组件模块

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message=Message    //挂载Message消息弹框组件到Vue对象的原型链上，成为全局任何组件都可调用
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm=MessageBox.confirm
