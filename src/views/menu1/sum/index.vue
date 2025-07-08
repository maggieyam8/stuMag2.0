<!-- 成绩统计 -->
<template>
  <div class="container">
    <div class="search-item">
      <span class="search-title">课程名称：</span>
      <el-select v-model="selectedCourse" placeholder="请选择课程名称" class="search-input" @change="fetchChartData">
        <el-option v-for="course in courses" :key="course.courseId" :label="course.courseName" :value="course.courseId">
        </el-option>
      </el-select>
      <!-- 跳转到成绩管理界面 -->
      <!-- <router-link to="/addscore">
        <el-button type="primary" plain v-hasPermi="['sum_look']">查看详细成绩列表</el-button>
      </router-link> -->
    </div>

    <!-- 图表容器 -->
    <div v-if="loading" class="loading"> <i class="el-icon-loading"></i> 数据加载中...
    </div>
    <div class="score-charf">
      <div ref="barChart" class="chart-item" style="height: 600px;"></div>
      <div ref="pieChart" class="chart-item pie-item" style="height: 600px;"></div>
    </div>


  </div>
</template>

<script>
import { fetchGradeStatistics, fetchGradeDistribution, getCourInfo } from '../../../api/menu1/sum';
import echarts from 'echarts';
import axios from 'axios';
export default {
  data() {
    return {
      barChart: null, // ECharts 实例
      pieChart: null, // ECharts 实例
      gradeStatistics: [], // 成绩统计数据
      gradeDistribution: [],
      loading: true,
      error: null,
      selectedCourse: null,//选中的课程
      courses: [],
      courseName: '',
    };
  },
  mounted() {
    this.initCharts();
    this.loadCourses();


  },
  methods: {
    initCharts() {
      this.$nextTick(() => {
        this.barChart = echarts.init(this.$refs.barChart);
        this.pieChart = echarts.init(this.$refs.pieChart);
      });
    },

  
  async loadCourses() {
    try {
      const res = await getCourInfo();
      if (res.code === 200 && res.courses.length > 0) {
        this.courses = res.courses;
        this.selectedCourse = this.courses[0].courseId;
        this.fetchChartData(); // 加载默认课程数据
      }
    } catch (error) {
      this.$message.error('加载课程列表失败');
    }
  },
  // 获取图表数据（统一处理方法）
  async fetchChartData() {
    if (!this.selectedCourse) return;

    this.loading = true;
    try {
      // 并行请求两个接口
      const [statRes, distRes] = await Promise.all([
        fetchGradeStatistics(this.selectedCourse),
        fetchGradeDistribution(this.selectedCourse)
      ]);

      if (statRes.code === 200) {
        this.gradeStatistics = Array.isArray(statRes.data) ? statRes.data : [statRes.data];
      }

      if (distRes.code === 200) {
        this.gradeDistribution = Array.isArray(distRes.data) ? distRes.data : [distRes.data];
        const selected = this.courses.find(c => c.courseId === this.selectedCourse);
        this.courseName = selected ? selected.courseName : '';
      }

      this.renderChart();
    } catch (error) {
      this.$message.error('加载数据失败');
    } finally {
      this.loading = false;
    }
  },

  // 渲染
  renderChart() {

    // 提取数据
    const courseNames = this.gradeStatistics.map(item => item.CourseName);
    const avgGrades = this.gradeStatistics.map(item => item.AvgGrade);
    const maxGrades = this.gradeStatistics.map(item => item.MaxGrade);
    const minGrades = this.gradeStatistics.map(item => item.MinGrade);
    const distributions = this.gradeDistribution.map(item => {
      if (item) {
        return {
          label: `${item.grade}分`,
          value: item.count
        };
      }
      return null;
    }).filter(item => item !== null);

    // 配置图表选项
    const barOption = {
      title: {
        text: '课程成绩统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['平均成绩', '最高成绩', '最低成绩'],
        bottom: 10
      },
      xAxis: {
        type: 'category',
        data: courseNames
      },
      yAxis: {
        type: 'value',
        name: '成绩'
      },
      series: [
        {
          name: '平均成绩',
          type: 'bar',
          data: avgGrades,
          itemStyle: {
            color: '#6E9EF7'  // 蓝色
          }
        },
        {
          name: '最高成绩',
          type: 'bar',
          data: maxGrades,
          itemStyle: {
            color: '#67C23A'  // 绿色
          }
        },
        {
          name: '最低成绩',
          type: 'bar',
          data: minGrades,
          itemStyle: {
            color: '#F56C6C'  // 红色
          }
        }
      ]
    };

    this.barChart.setOption(barOption);


    //配置图表选项
    const pieOption = {
      title: {
        text: `${this.courseName} 成绩区间分布`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        data: ['分布'],
        bottom: 5
      },
      series: [
        {
          name: '分布',
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data: distributions.map(d => ({ value: d.value, name: `${d.label}` })),
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 1,
            borderColor: '#aaa'
          },

          color: ['#F56C6C', '#909399', '#67C23A', '#6E9EF7', '#E6A23C', '#FC8452', '#9A60B4', '#EA7C30']
        }
      ]
    };
    // 设置图表选项
    this.pieChart.setOption(pieOption);

    // 窗口大小变化时，调整图表大小
    window.addEventListener('resize', () => {
      this.barChart.resize();
      this.pieChart.resize();
    });

    window.addEventListener('resize', this.resizeHandler);

  },

  resizeHandler() {
    if (this.barChart) this.barChart.resize();
    if (this.pieChart) this.pieChart.resize();

  },
  beforeDestroy() {
    if (this.barChart) this.barChart.dispose();
    if (this.pieChart) this.pieChart.dispose();
    window.removeEventListener('resize', this.resizeHandler);
  }
}
};
</script>

<style scoped>
.container {
  max-width: 100%;
  /* 设置最大宽度 */
  margin: 0 auto;
  /* 居中 */
  padding: 20px;
  /* 内边距 */
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 16px;
  color: #666;
}

.el-icon-loading {
  font-size: 24px;
  margin-right: 10px;
  color: #409EFF;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 10px;
  /* 设置标签和输入框之间的间距 */
}


.search-title {
  font-size: 14px;
  color: #606266;
}

.el-button {
  margin: 3px 20px;
  /* 按钮之间的间距 */
}

.score-charf {
  display: flex;
  gap: 20px;
  /* 图表间距 */
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chart-item {
  flex: 1;
  height: 500px !important;
  /* 统一高度 */
  min-width: 0;
  /* 防止溢出 */
  background: #f9fafc;
  border-radius: 6px;
  padding: 15px;
  border: 1px solid #ebeef5;
}

/* 图例样式 */
.echarts-legend {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.pie-item {
  margin: 5px 0;
}
</style>