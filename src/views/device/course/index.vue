<!-- 选课报名 -->
<template>
    <div class="container">
        <!-- 搜索框和按钮 -->
        <div class="search-bar">
            <div class="search-item">
                <span class="search-title">课程名称：</span>
                <el-input v-model="courseName" placeholder="请输入课程名称" class="search-input"></el-input>
            </div>
            <div class="search-item">
                <span class="search-title">授课老师：</span>
                <el-input v-model="teacherName" placeholder="请输入教师姓名" class="search-input"></el-input>
            </div>
            <!-- <div class="search-item">
                <span class="search-title">课程类型：</span>
                <el-select v-model="selectedType" placeholder="请选择课程类型" class="search-input" @change="fetchType">
                    <el-option v-for="courseType in courseTypes" :key="courseType" :label="courseType"
                        :value="courseType"></el-option>
                </el-select>
            </div> -->
            <el-button type="primary" icon="el-icon-search"size="mini" plain @click="findCourse">搜索</el-button>
            <el-button plain icon="el-icon-refresh"size="mini" @click="clearSearch">重置</el-button>
            <el-button plain type="primary" @click="showMine" size="mini":disabled="!$store.state.user.isStudent">我的选修</el-button>


        </div>

        <!-- 课程表  -->
        <el-table :data="tableData" class="table">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column prop="SequenceNumber" label="序号">
            </el-table-column>
            <el-table-column prop="courseName" label="课程名称">
            </el-table-column>
            <el-table-column prop="courseCode" label="课程编号" align="center"></el-table-column>
            <el-table-column prop="teacherName" label="教师" align="center"></el-table-column>
            <el-table-column prop="teacherNum" label="职工号" align="center"></el-table-column>
            <el-table-column prop="courseCredits" label="学分" align="center"></el-table-column>
            <el-table-column prop="studentCount" label="已选人数" align="center"></el-table-column>
            <!-- 
      <el-table-column prop="courseType" label="课程类型" align="center"></el-table-column>
      <el-table-column prop="classTime" label="上课时间" align="center"></el-table-column>
      <el-table-column prop="location" label="上课地点" align="center"></el-table-column>
      <el-table-column prop="maxStudents" label="限制人数" align="center"></el-table-column> -->
            <!-- 操作列 -->
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="showDetail(scope.row)" v-hasPermi="['selCourse_look']"
                        plain>查看</el-button>
                    <el-button type="primary" size="mini" @click="confirmCourse(scope.row)"
                        :disabled="!$store.state.user.isStudent" plain>选择</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 课程详情 -->
        <el-dialog :visible.sync="showCourseDialog" title="课程详情" width="1250px">
            <el-table :data="courseDetail" style="width: 100%">
                <el-table-column prop="courseName" label="课程名称"></el-table-column>
                <el-table-column prop="courseCode" label="课程编号" align="center"></el-table-column>
                <el-table-column prop="teacherName" label="教师" align="center"></el-table-column>
                <el-table-column prop="teacherNum" label="职工号" align="center"></el-table-column>
                <el-table-column prop="courseCredits" label="学分" align="center"></el-table-column>
                <el-table-column prop="courseType" label="课程类型" align="center"></el-table-column>
                <el-table-column prop="classTime" label="上课时间" align="center"></el-table-column>
                <el-table-column prop="location" label="上课地点" align="center"></el-table-column>
                <el-table-column prop="maxStudents" label="限制人数" align="center"></el-table-column>
                <el-table-column prop="studentCount" label="已选人数" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showCourseDialog = false">关闭</el-button>
            </span>
        </el-dialog>

        <!-- 查看我的课程 -->
        <el-dialog :visible.sync="myCourseDialog" title="我的选课" width="1350px">
            <el-table :data="myCourse" style="width: 100%">
                <el-table-column type="selection" width="50" align="center"></el-table-column>
                <el-table-column prop="courseId" label="课程序号" v-if="0"></el-table-column>
                <el-table-column prop="courseName" label="课程名称"></el-table-column>
                <el-table-column prop="courseCode" label="课程编号" align="center"></el-table-column>
                <el-table-column prop="teacherName" label="教师" align="center"></el-table-column>
                <el-table-column prop="teacherNum" label="职工号" align="center"></el-table-column>
                <el-table-column prop="courseCredits" label="学分" align="center"></el-table-column>
                <el-table-column prop="courseType" label="课程类型" align="center"></el-table-column>
                <el-table-column prop="classTime" label="上课时间" align="center"></el-table-column>
                <el-table-column prop="location" label="上课地点" align="center"></el-table-column>
                <el-table-column prop="maxStudents" label="限制人数" align="center"></el-table-column>
                <el-table-column prop="studentCount" label="已选人数" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="cancelCourse(scope.row)" plain>取消选课</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeMine">关闭</el-button>
            </span>
        </el-dialog>

        <!-- 分页 -->
        <div class="block">
            <span class="demonstration"></span>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 50]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>


<script>
import { getAllCourseList, getCourseByType, searchCourse, selectCourse, getMyCourse, cancelSelect } from '../../../api/device/course';
import axios from 'axios'
import hasPermi from '../../../directive/permission/hasPermi';
import { mapState } from 'vuex';

export default {
    name: "CourseList",
    computed: {
        ...mapState(['isStudent'])
    },
    created() {
        this.$store.dispatch('fetchPermission');

    },
    data() {
        return {
            currentStudent: { id: 10 },
            courseName: '',
            teacherName: '',
            selectedType: '',
            //分页查询参数
            queryInfo: {
                pagenum: 1, //当前页码
                pagesize: 10, //每页条数
            },
            courseTypes: ['选修', '必修'],
            total: 0, //总条数
            tableData: [], //课程列表数据
            courseDetail: {
                courseName: "",
                courseCode: "",
                teacherName: "",
                teacherNum: "",
                courseCredits: "",
                courseType: "",
                classTime: "",
                location: "",
                maxStudents: "",
                status: 1,
            },
            myCourse: [],
            selectedCourse: {},
            showCourseDialog: false,
            myCourseDialog: false,
            showSelectCourseDialog: false,
            selectedRows: [],
            showImportCourseDialog: false,
        }
    },
    methods: {
        // can(perm) {
        //     return this.$store.getters.permissions?.includes(perm)
        // },
        //分页
        //每页条数改变时触发
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.queryInfo.pagenum = 1; //重置为第一页
            this.getAll();
        },

        //当前页码改变时触发
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getAll();

        },
        //获取全部课程信息
        async getAll() {
            try {
                const { pagenum, pagesize } = this.queryInfo;
                const response = await getAllCourseList({
                    params: {
                        pageIndex: pagenum, //当前页码
                        pageSize: pagesize, //每页条数
                    },
                });

                if (response.code === 200) {
                    this.tableData = response.course;//更新课程列表
                    this.total = response.total;//更新总条数
                } else {
                    this.$message.error("获取课程列表失败");
                }
            } catch (error) {
                this.$message.error("请求失败，请检查网络");
                console.error(error);
            }

        },
        async fetchType() {
            try {
                const resp = await getCourseByType({

                    pageIndex: this.queryInfo.currentPage,
                    pageSize: this.queryInfo.pageSize,
                    courseType: this.selectedType

                });
                if (resp.code === 200) {
                    this.tableData = resp.course;
                    this.total = resp.total;
                } else {

                    this.$message.error(resp.msg);
                }
            }
            catch (error) {
                console.error('获取失败：', error);
                this.$message.error('获取失败，请检查网络');
            }
        },
        viewElectives() {
            if (!this.isStudent) {
                this.$message.warning('只有学生可以查看选修课程');
                return;
            }
        },
        async findCourse() {

            if (!this.courseName.trim() && !this.teacherName.trim()) {
                this.$message.error("请输入有效的课程名称或授课老师姓名！");
                return;
            }
            try {

                const params = {
                    courseName: this.courseName.trim(),
                    teacherName: this.teacherName.trim(),
                    pageIndex: this.queryInfo.pagenum,
                    pageSize: this.queryInfo.pagesize,
                };
                const resp = await searchCourse(params);

                //根据返回的数据进行处理
                if (resp.code == 200) {
                    this.$message(resp.msg);
                    this.tableData = resp.course;
                    this.total = resp.total;
                } else {
                    this.$message.error(resp.msg);
                }
            }
            catch (error) {
                console.error("查找失败", error);
                this.$message.error("查找失败，请重试")
            }

        },
        async confirmCourse(row) {
            const courseId = row.id;
            try {
                await this.$confirm('确定选择该课程吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                });


                const response = await selectCourse(courseId);

                if (response.code === 200) {
                    this.$message.success('选课成功');
                    this.getAll(); // 刷新课程列表
                } else {
                    this.$message.error(response.msg);
                }

            } catch (error) {
                if (error !== 'cancel') { // 排除用户主动取消的情况
                    console.error('选课失败：', error);
                    this.$message.error(error.response?.msg || '选课失败，请重试');
                }
            }
        },
        showMine() {
            this.myCourseDialog = true; // 打开修改弹窗
            this.getMine();
        },
        async getMine() {
            const resp = await getMyCourse();


            this.myCourse = resp.course;
            if (resp.code == 200) {
                console.log(resp.msg);
            } else {
                this.$message.error(resp.msg);
            }

        },
        closeMine() {
            this.myCourseDialog = false;
            this.getAll();
        },
        async cancelCourse(row) {
            const courseId = row.courseId;
            try {
                await this.$confirm('此操作将取消选择该课程, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                });

                const resp = await cancelSelect(courseId);

                if (resp.code == 200) {
                    this.$message.success(resp.msg);
                    this.getMine();

                } else {
                    this.$message.error(resp.msg)
                }
            } catch (error) {
                if (error !== 'cancel') { // 排除用户主动取消的情况
                    console.error('选课失败：', error);
                    this.$message.error(error.response?.msg || '选课失败，请重试');
                }
            }
        },





        clearSearch() {
            this.courseName = '';
            this.teacherName = '';
            this.selectedType = '';
            this.getAll();
        },

        showDetail(row) {
            this.courseDetail = [Object.assign({}, row)];
            this.showCourseDialog = true;
        },




    },
    mounted() {
        this.getAll();
    },
}
</script>


<style scoped>
.container {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;

}



.search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 15px;

}

.search-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-title {
    font-size: 14px;
    color: #606266;
}


.search-input {
    width: 310px;
    flex: 1;
    min-width: 120px;
    margin-right: 5px;

    margin-left: 15px;

}

.class-search {
    margin-left: 65px;
}



.action-buttons {
    margin-bottom: 12px;
}

.el-button {
    margin: 0 5px;
}

.table {
    margin-top: 10px;
}


@media (max-width: 768px) {
    .search-item {
        flex: 1 1 100%;
        /* 小屏幕下每项占满一行 */
    }

    .search-input {
        min-width: 100%;
    }
}
</style>