<!-- 成绩查询 -->
<template>
    <div class="container">
        <!-- 搜索框和按钮 -->
        <div class="search-bar">
            <div class="search-item">
                <span class="search-title">课程名称：</span>
                <el-select v-model="selectedCourse" placeholder="请选择课程名称" class="search-input" @change="getAll">
                    <el-option v-for="course in courses" :key="course.courseId" :label="course.courseName"
                        :value="course.courseName">
                    </el-option>
                </el-select>

                <span class="search-title">学年：</span>
                <el-select v-model="selectedAcademicYear" placeholder="请选择学年" class="search-input" @change="getAll">
                    <el-option v-for="year in academicYears" :key="year" :label="year" :value="year">
                    </el-option>
                </el-select>

            </div>
            <el-button plain icon="el-icon-refresh" size="mini" @click="clearSearch">重置</el-button>
        </div>
        <!-- 操作按钮 -->
        <div class="action-buttons">

            <el-button type="primary"icon="el-icon-document-copy" size="mini" plain @click="exportDialogVisible = true"
            :disabled="!$store.state.user.isStudent">导出</el-button>
                <!-- <el-button type="primary"icon="el-icon-document-copy" size="mini" plain @click="exportDialogVisible = true"
                v-hasPermi="['findScore_export']">导出</el-button> -->
        </div>
        <!-- 成绩表 @row-click="handleRowClick" -->
        <el-table :data="tableData" class="table" @selection-change="handleSelectionChange" >
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column prop="SequenceNumber" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="courseName" align="center" label="课程名称">
            </el-table-column>
            <el-table-column prop="grade" align="center" label="成绩"></el-table-column>
            <el-table-column prop="teacherName" align="center" label="教师"></el-table-column>
            <el-table-column prop="courseCredits" align="center" label="学分"></el-table-column>
            <el-table-column prop="academicYear" align="center" label="学年"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" plain @click="showDetail(scope.row)"
                        v-hasPermi="['findScore_look']">查看</el-button>

                </template>
            </el-table-column>
        </el-table>





        <!-- 成绩详情 -->
        <el-dialog :visible.sync="showGradeDialog" title="成绩详情" width="1120px">
            <el-table :data="gradeDetail" style="width: 100%">
                <el-table-column prop="stuNumber" label="学号" width="180"></el-table-column>
                <el-table-column prop="courseName" label="课程名称" width="180"></el-table-column>
                <el-table-column prop="grade" label="成绩" width="180"></el-table-column>
                <el-table-column prop="regularGrade" label="平时成绩40%" width="180"></el-table-column>
                <el-table-column prop="examGrade" label="考试成绩60%" width="180"></el-table-column>
                <el-table-column prop="academicYear" label="学年" width="180"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showGradeDialog = false">关闭</el-button>
            </span>
        </el-dialog>

        <!-- 导出 -->
        <el-dialog title="导出数据" :visible.sync="exportDialogVisible" width="400px" append-to-body>
            <div class="export-content">
                <p>请选择导出选项：</p>
                <el-checkbox v-model="exportOptions.includeHeader">包含表头</el-checkbox>
                <el-checkbox v-model="exportOptions.onlySelected"
                    :disabled="selectedRows.length <= 0">仅导出选中数据</el-checkbox>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="exportDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleExport">确 定</el-button>
            </div>
        </el-dialog>

        <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
        </div>
    </div>
</template>

<script>
import { getMyScore, exportScore } from '../../../api/menu1/find'
import { getCourInfo } from '../../../api/menu1/addscore'
import axios, { Axios } from 'axios'
import { mapState } from 'vuex';

export default {
    name: "GradeList",
    computed: {
        ...mapState(['isStudent'])
    },
    created() {
        this.$store.dispatch('fetchPermission');

    },
    data() {
        return {
            selectedCourse: '', // 绑定下拉框的选中值
            selectedAcademicYear: '',
            //分页查询参数
            pagination: {
                currentPage: 1, //当前页码
                pageSize: 10, //每页条数
                total: 0
            },

            tableData: [], //列表数据
            gradeDetail: {
                stuNumber: '',
                courseName: '',
                grade: 0,
                regularGrade: 0,
                examGrade: 0,
                academicYear: ''
            },
            courses: [],
            academicYears: ['2023-202401', '2023-202402', '2024-202501', '2024-202502', '2025-202601', '2025-202602'],            selectedGrade: {},//当前选中的
            showGradeDialog: false,
            selectedRows: [],//当前选中的行
            exportDialogVisible: false,
            exportOptions: {
                includeHeader: true, //是否包含表头
                onlySelected: false, //是否仅导出选中数据
            },
        }
    },
    methods: {
        async loadInfo() {
            try {
                const res = await getCourInfo();
                if (res.code === 200 && res.courses.length > 0) {
                    this.courses = res.courses;
                    this.getAll();

                }
            } catch (error) {
                this.$message.error("加载列表失败");
            }

        },
        async getAll() {
            try {
                const params = {
                    pageIndex: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    courseName: this.selectedCourse || "",
                    academicYear: this.selectedAcademicYear || "",

                }
                const resp = await getMyScore(params);


                if (resp.code === 200) {
                    this.tableData = resp.grades;
                    this.pagination.total = resp.total;

                } else {
                    this.$message.error(resp.msg);
                }

            } catch (error) {
                console.error('获取成绩失败：', error);
                this.$message.error('获取成绩失败，请检查网络');
            }
        },

        submitFileForm() {
            //提交文件表单的方法
            this.$refs.upload.submit();
        },
        createDownloadLink(blob, filename) {
            //创建下载链接
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename); //设置下载文件名
            document.body.appendChild(link);
            link.click();//触发下载
            document.body.removeChild(link); //移除链接
            window.URL.revokeObjectURL(url);
        },

        //处理导出操作
        async handleExport() {
            try {
                const params = {
                    includeHeader: this.exportOptions.includeHeader,
                    onlySelected: this.exportOptions.onlySelected,
                    selectedIds: this.selectedRows.length > 0 && this.exportOptions.onlySelected
                        ? this.selectedRows.map(row => row.id.toString()).join(',')
                        : undefined //将选中的成绩编号以逗号分隔的字符串形式发送
                };
                this.exportLoading = true

                //调用导出接口
                const resp = await exportScore(params);

                this.createDownloadLink(resp.data, "学生个人成绩表.xlsx");
                console.log("导出数据成功");
                this.$message({ type: 'success', message: '导出成功' });


            } catch (error) {
                console.error("导出失败", error);
                this.$message.error(error.response?.data?.message || '导出失败，请重试');
            } finally {

                this.exportLoading = false
                this.exportDialogVisible = false;
            }

        },
        // 处理选中行数据
        handleSelectionChange(rows) {
            this.selectedRows = rows;
        },
        handleSizeChange(size) {
            this.pagination.pageSize = size;
            this.getAll();
        },
        handleCurrentChange(page) {
            this.pagination.currentPage = page;
            this.getAll();
        },
        showDetail(row) {
            this.gradeDetail = [Object.assign({}, row)]; // 将对象转换为数组
            this.showGradeDialog = true; // 打开修改弹窗
        },
        //重置
        clearSearch() {
            this.selectedAcademicYear = '';
            this.selectedCourse = '';
            this.getAll();
        },

    },
    //生命周期函数，加载页面自动列表用户表
    mounted() {
        this.loadInfo();
    },
}

</script>


<style scoped>
.container {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
}

.el-input {
    width: 69%;
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


.search-input,
.el-select .el-input__inner {
    width: 310px;
    margin-right: 10px;
    margin-left: 15px;

}

.class-search {
    margin-left: 65px;
}



.action-buttons {
    margin-bottom: 12px;
}


.dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.dialog-footer .el-button {
    margin-left: 10px;
}

.el-button {
    margin: 0 5px;
}

.table {
    margin-top: 10px;
}

.el-table {
    margin-top: 20px;
}
</style>
