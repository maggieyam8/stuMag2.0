<!-- 成绩列表 -->
<template>
    <div class="container">
        <!-- 搜索框和按钮 -->
        <div class="search-bar">
            <div class="search-item">
                <span class="search-title">学生姓名：</span>
                <el-input v-model="stuName" placeholder="请输入学生名称" class="search-input"></el-input>
            </div>
            <!-- <div class="search-item">
                <span class="search-title">授课老师：</span>
                <el-input v-model="teacherName" placeholder="请输入教师姓名" class="search-input"></el-input>
            </div> -->
            <!-- <div class="search-item">
                <span class="search-title">课程名称：</span>
                <el-select v-model="selectedCourse" placeholder="请选择课程名称" class="search-input"
                    @change="fetchGradesByCourse">
                    <el-option v-for="course in courses" :key="course.courseCode" :label="course.courseName"
                        :value="course.courseName">
                    </el-option>
                </el-select>
            </div> -->
            <el-button type="primary" icon="el-icon-search" size="mini" plain @click="findGrade">搜索</el-button>
            <el-button plain icon="el-icon-refresh"size="mini"  @click="clearSearch">重置</el-button>

        </div>
        <!-- 操作按钮 -->
        <div class="action-buttons">
            <el-button type="success" icon="el-icon-plus" size="mini" plain @click="showAddGradeDialog = true" v-hasPermi="['score_add']">新增</el-button>
            <el-button type="info" icon="el-icon-edit" size="mini" :disabled="selectedRows.length != 1" plain @click="openEditDialog"
                v-hasPermi="['score_edit']">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="selectedRows.length <= 0" plain @click="delGrade"
                v-hasPermi="['score_delete']">删除</el-button>
            <el-button type="warning"  icon="el-icon-upload" size="mini" plain @click="upload.open = true" v-hasPermi="['score_upload']">导入</el-button>
            <el-button type="primary" icon="el-icon-document-copy" size="mini" plain @click="exportDialogVisible = true"
                v-hasPermi="['score_export']">导出</el-button>
        </div>
        <!-- 成绩表 @row-click="handleRowClick" -->
        <el-table :data="tableData" class="table" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column prop="SequenceNumber" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="stuName" align="center" label="学生姓名"></el-table-column>
            <el-table-column prop="stuNumber" align="center" label="学号"></el-table-column>
            <el-table-column prop="courseName" align="center" label="课程名称">
            </el-table-column>
            <el-table-column prop="grade" align="center" label="成绩"></el-table-column>
            <el-table-column prop="teacherName" align="center" label="教师"></el-table-column>
            <el-table-column prop="courseCredits" align="center" label="学分"></el-table-column>
            <el-table-column prop="academicYear" align="center" label="学年"></el-table-column>
            <!-- <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)"
                        :disabled="!can('score_edit')">修改</el-button>
                    <el-button size="mini" type="danger" plain @click="handleDeleteSingle(scope.row)"
                        :disabled="!can('score_delete')">删除</el-button>
                </template>
</el-table-column> -->

        </el-table>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pagination.currentPage" :page-sizes="[30, 60, 90]" :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
        </div>

        <!-- 新增成绩表单 -->
        <el-dialog title="新增成绩" :visible.sync="showAddGradeDialog" width="25%">
            <el-form :model="newGrade" label-width="100px">

                <el-form-item label="学生姓名" required>
                    <el-select v-model="newGrade.stuId" placeholder="请选择学生" @change="handleStudentChange" filterable>
                        <el-option v-for="student in studentList" :key="student.value" :label="student.text"
                            :value="student.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程名称" required>
                    <el-select v-model="newGrade.courseId" placeholder="请选择课程" :disabled="!newGrade.stuId"
                        @change="handleCourseChange">
                        <el-option v-for="course in availableCourses" :key="course.value" :label="course.text"
                            :value="course.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item for="regularGrade" label="平时成绩" required>
                    <el-input v-model="newGrade.regularGrade" type="number" id="regularGrade" name="regularGrade"
                        placeholder="请输入平时成绩" @input="updateTotalGrade"></el-input>
                </el-form-item>
                <el-form-item for="examGrade" label="考试成绩" required>
                    <el-input v-model="newGrade.examGrade" type="number" id="examGrade" name="examGrade"
                        placeholder="请输入考试成绩" @input="updateTotalGrade"></el-input>
                </el-form-item>
                <el-form-item for="grade" label="成绩" required>
                    <el-input v-model="newGrade.grade" type="number" id="grade" name="grade" placeholder="请输入成绩"
                        readonly></el-input>
                </el-form-item>

                <el-form-item label="学年" required>
                    <el-select v-model="newGrade.academicYear" placeholder="请选择学年">
                        <el-option v-for="year in academicYears" :key="year" :label="year" :value="year">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddGradeDialog = false">取消</el-button>
                <el-button type="primary" @click="addGrade">确定</el-button>
            </div>
        </el-dialog>

        <!-- 修改成绩表单 -->
        <el-dialog title="修改成绩" :visible.sync="showEditGradeDialog" width="25%">
            <el-form :model="selectedGrade" label-width="100px">

                <el-form-item label="学生姓名">
                    <el-input v-model="selectedGrade.stuName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="课程名称">
                    <el-input v-model="selectedGrade.courseName" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="平时成绩">
                    <el-input v-model="selectedGrade.regularGrade" placeholder="请输入平时成绩"
                        @input="updateTotalGradeEdit"></el-input>
                </el-form-item>
                <el-form-item label="考试成绩">
                    <el-input v-model="selectedGrade.examGrade" placeholder="请输入考试成绩"
                        @input="updateTotalGradeEdit"></el-input>
                </el-form-item>
                <el-form-item label="成绩">
                    <el-input v-model="selectedGrade.grade" placeholder="请输入成绩：" readonly></el-input>
                </el-form-item>
                <el-form-item label="学年">
                    <el-select v-model="selectedGrade.academicYear" placeholder="请选择学年" :disabled="true">
                        <el-option v-for="year in academicYears" :key="year" :label="year" :value="year">
                        </el-option>
                    </el-select> </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showEditGradeDialog = false">取消</el-button>
                <el-button type="primary" @click="editGrade">确定</el-button>
            </div>
        </el-dialog>

        <!-- 导入 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
            <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :on-error="handleFileError"
                :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip text-center" slot="tip">
                    <div>
                        <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的课程数据
                    </div>
                    <span>仅允许导入xls、xlsx格式文件。</span>
                    <el-link type="primary" :underline="false" style="font-size:12px; vertical-align: baseline"
                        @click="importTemplate">下载模板</el-link>

                </div>
            </el-upload>

            <div slot="footer" class="dialog-footer">
                <el-button @click="upload.open = false">取 消</el-button>
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
            </div>
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


    </div>
</template>

<script>
import axios from 'axios'
import { getAllScore, searchScore, searchByCourse, insertScore, updateScore, delScore, exportScore, getCourInfo } from '@/api/menu1/addscore'

export default {
    name: "GradeList",
    data() {
        return {
            studentList: [], //学生列表
            availableCourses: [], //学生可选课程列表
            courseSelections: {},
            stuName: '',
            teacherName: '',
            selectedCourse: '', // 绑定下拉框的选中值
            //分页查询参数
            pagination: {
                currentPage: 1, //当前页码
                pageSize: 30, //每页条数
                total: 0
            },

            tableData: [],
            newGrade: {
                stuId: null,//改为存储学生id
                stuName: "",  //仅用于显示
                courseId: null,
                courseName: "",
                grade: "",
                regularGrade: 0,
                examGrade: 0,
                academicYear: "",
            },

            academicYears: ['2023-202401', '2023-202402', '2024-202501', '2024-202502'],
            selectedGrade: {},//当前选中的课程
            showAddGradeDialog: false,
            showEditGradeDialog: false,
            selectedRows: [],//当前选中的行
            showImportGradeDialog: false,
            upload: {
                title: '导入成绩数据',
                open: false,
                url: `${BASE_URL}/Score/ImportGrade`,
                headers: {},
                updateSupport: false,
                isUploading: false,

            },
            exportDialogVisible: false,
            exportOptions: {
                includeHeader: true, //是否包含表头
                onlySelected: false, //是否仅导出选中数据
            },
        }
    },

    methods: {
        // can(perm) {
        //     return this.$store.getters.permissions?.includes(perm)
        // },
        async fetchStudentsAndCourses() {
            try {
                const res = await getCourInfo();
                if (res.code === 200 && res.data) {
                    this.studentList = res.data.map(item => ({
                        value: Number(item.studentId),
                        text: item.studentName
                    }));
                    // 转换为 { 学生ID: 课程列表 } 的映射
                    this.courseSelections = {};
                    res.data.forEach(item => {
                        this.courseSelections[Number(item.studentId)] = item.courses.map(course => ({
                            value: Number(course.courseId),
                            text: course.courseName
                        }));
                    });

                    // console.log('处理结果:', {
                    //     students: this.studentList,
                    //     courses: this.courseSelections
                    // }); // 调试用
                }
            } catch (error) {
                console.error('获取学生和课程信息失败：', error);
                this.$message.error('获取学生和课程信息失败，请检查网络');
            }
        },


        // 学生选择变化时触发
        handleStudentChange(stuId) {
            // 1. 更新学生姓名显示
            const student = this.studentList.find(s => s.value === stuId);
            this.newGrade.stuName = student?.text || '';

            // 2. 更新可选课程（确保stuId是数字）
            this.availableCourses = this.courseSelections[Number(stuId)] || [];
            console.log('可选课程:', this.availableCourses); // 调试用

            // 3. 重置已选课程
            this.newGrade.courseId = null;
            this.newGrade.courseName = '';
        },

        // 课程选择变化时触发
        handleCourseChange(courseId) {
            const course = this.availableCourses.find(c => c.value === courseId);
            this.newGrade.courseName = course ? course.text : '';
        },


        async getAll() {
            try {
                const params = {
                    pageIndex: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize
                }
                const resp = await getAllScore(params);
                if (resp.code === 200) {
                    this.tableData = resp.grade;
                    this.pagination.total = resp.total;
                } else {
                    this.$message.error(resp.msg);
                }
            } catch (error) {
                console.error('获取数据失败：', error);
                this.$message.error('获取数据失败，请检查网络');
            }

        },
        //查找成绩
        async findGrade() {
            try {
                if (!this.stuName.trim()) {
                    this.$message.error("请输入有效的学生姓名姓名！");
                    return;
                }

                const params = {
                    stuName: this.stuName.trim(),
                    pageIndex: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,

                };
                const resp = await searchScore(params);
                if (resp.code === 200) {
                    this.$message("查找成功");
                    this.tableData = resp.grade;
                    this.pagination.total = resp.total;
                } else if (resp.code === 404) {
                    this.$message.warning(resp.msg);
                    this.tableData = [];
                    this.pagination.total = 0;
                } else {
                    this.$meaasge.error(resp.msg);
                }
            }
            catch (error) {
                console.error('查找成绩失败：', error);
                this.$message.error('查找成绩失败，请检查网络');
            };

        },
        async fetchGradesByCourse(courseName) {
            try {
                const params = {
                    pageIndex: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    courseName: courseName
                };

                const resp = await searchByCourse(params);

                if (resp.code === 200) {
                    this.tableData = resp.grades;
                    this.pagination.total = resp.total;
                } else {
                    this.$message.error(resp.msg);
                }
            }
            catch (error) {
                console.error('获取成绩失败：', error);
                this.$message.error('获取成绩失败，请检查网络');
            };
        },
        //重置
        clearSearch() {
            this.stuName = '';
            this.getAll();
        },
        async addGrade() {
            if (!this.newGrade.stuId || !this.newGrade.courseId) {
                this.$message.error("请选择学生和课程！");
                return;
            }
            try {
                const resp = await insertScore(this.newGrade);

                if (resp.code === 200) {
                    this.$message.success(resp.msg);
                    this.showAddGradeDialog = false;
                    this.newGrade = {
                        stuId: null,//改为存储学生id
                        stuName: "",  //仅用于显示
                        courseId: null,
                        courseName: "",
                        grade: "",
                        regularGrade: 0,
                        examGrade: 0,
                        academicYear: "",
                    };
                    this.availableCourses = [];
                    this.getAll();
                } else {
                    this.$message.error(resp.msg);
                }
            }
            catch (error) {
                console.error('新增成绩失败：', error);
                this.$message.error('新增成绩失败，请检查网络');
            };


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
        // 修改单条数据
        handleEdit(row) {
            this.selectedGrade = { ...row };
            this.showEditGradeDialog = true;
        },
        openEditDialog() {
            this.showEditGradeDialog = true;
            if (this.selectedRows.length !== 1) return;
            const selectedRow = this.selectedRows[0];
            this.selectedGrade = { ...selectedRow };
        },
        async editGrade() {
            try {
                const params = {
                    id: this.selectedGrade.id,
                    regularGrade: parseInt(this.selectedGrade.regularGrade),
                    examGrade: parseInt(this.selectedGrade.examGrade),
                    academicYear: this.selectedGrade.academicYear
                };
                const resp = await updateScore(params);

                if (resp.code === 200) {
                    this.$message.success(resp.msg);
                    this.showEditGradeDialog = false;
                    this.getAll();
                } else {
                    this.$message.error(resp.msg);
                }
            }
            catch (error) {
                console.error('修改成绩失败：', error);
                this.$message.error('修改成绩失败，请检查网络');
            };
        },
        // 新增成绩表单中计算总成绩
        updateTotalGrade() {
            const regularGrade = parseInt(this.newGrade.regularGrade) || 0;
            const examGrade = parseInt(this.newGrade.examGrade) || 0;
            const grade = regularGrade * 0.4 + examGrade * 0.6;
            this.newGrade.grade = Math.round(grade); // 四舍五入为整数
        },

        // 修改成绩表单中计算总成绩
        updateTotalGradeEdit() {
            const regularGrade = parseInt(this.selectedGrade.regularGrade) || 0;
            const examGrade = parseInt(this.selectedGrade.examGrade) || 0;
            const grade = regularGrade * 0.4 + examGrade * 0.6;
            this.selectedGrade.grade = Math.round(grade);
        },

        // 删除单条数据
        async handleDeleteSingle(row) {

            const ids = row.id.toString();
            await this.$confirm('确定删除该条成绩记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            });
            const response = await delScore({ ids });

            if (response.code === 200) {
                this.$message.success('删除成功');
                this.getAll();
            } else {
                this.$message.error('删除失败');
            }



        },
        // 批量删除
        async delGrade() {
            try {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择要删除的记录');
                    return;
                }

                await this.$confirm('确定删除选中的成绩记录吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                const ids = this.selectedRows.map(row => row.id).join(',');
                const response = await delScore({ ids });

                if (response.code === 200) {
                    this.$message.success('删除成功');
                    this.getAll();
                } else {
                    this.$message.error('删除失败', error);
                }
            }
            catch (error) {
                // 区分用户取消操作和真实错误
                if (error === 'cancel' || error.message === 'cancel') {
                    // 用户点击取消是正常操作，不需要提示错误
                    // console.log('用户取消了删除操作');
                } else {
                    // 真实的错误情况
                    console.error('删除失败：', error);
                    this.$message.error('删除失败，请检查网络');
                }
            };

        },

        importTemplate() {
            //下载模板
            window.open(`${BASE_URL}/Score/DownloadTemplate`);
        },
        handleFileUploadProgress(event, file, fileList) {
            //文件上传进度管理
            this.upload.isUploading = true;
        },
        handleFileSuccess(resp, file, fileList) {
            //文件上传成功处理
            this.upload.isUploading = false;
            if (resp.code === 200) {
                this.$message(resp.msg)

                this.upload.open = false;

            } else {
                this.$message.error(resp.msg);
            }
            this.getAll();
        },
        handleFileError(err, file, fileList) {
            //文件上传失败处理
            this.upload.isUploading = false;
            this.$message.error('文件上传失败：' + err.message);
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
                        : undefined
                };

                const resp = await exportScore(params);

                this.createDownloadLink(resp.data, "成绩表.xlsx");
                console.log("导出数据成功");
                this.$message({ type: 'success', message: '导出成功' });


            } catch (error) {
                console.error("导出失败", error);
                this.$message.error("导出失败，请重试");
            } finally {
                //关闭对话框
                this.exportDialogVisible = false;
            };

        },

    },

    mounted() {
        this.getAll();
        this.fetchStudentsAndCourses();

    },
}
</script>

<style scoped>
.container {
    max-width: 100%;
    box-sizing: border-box;

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
    flex: 1;
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
</style>
