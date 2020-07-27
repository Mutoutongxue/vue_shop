<template>
  <div id="report">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

     <!-- 卡片视图 -->
    <el-card>
        <!-- 2.为Echarts准备一个Dom -->
        <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
//1.导入echarts图表制作插件
import echarts from 'echarts'

export default {
  name: 'report',

  data(){
      return{
    //需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
      
  },

    created() {},
    //此时页面上的元素已经被渲染完毕
    async mounted () {
        // 3.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        //向后台获取图表数据
        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) return this.$message('获取折线图数据失败!')

        //4.使用刚指定的配置项和数据显示图表。
        // var option = {
        //     title: {
        //         text: 'ECharts 入门示例'
        //     },
        //     tooltip: {},
        //     legend: {
        //         data:['销量']
        //     },
        //     xAxis: {
        //         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        //     },
        //     yAxis: {},
        //     series: [{
        //         name: '销量',
        //         type: 'bar',
        //         data: [5, 20, 36, 10, 10, 20]
        //     }]
        // };
         // 数据合并方式一。
        const result = _.merge(res.data, this.options)
        //数据合并方式二
        //const result = Object.assign (this.options,res,data);
        //result.xAxis[0].boundaryGap = false

        //5.使用刚指定的配置项和数据显示图表
        myChart.setOption(res.data);
    }


}
</script>

<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 15px;
}
</style>
