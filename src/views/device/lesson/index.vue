<!-- 课程列表 -->
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
      <el-button type="primary" icon="el-icon-search" size="mini" plain @click="findCourse">搜索</el-button>
      <el-button plain icon="el-icon-refresh" size="mini" @click="clearSearch">重置</el-button>

    </div>
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="success" icon="el-icon-plus" size="mini" plain @click="showAddCourseDialog = true" v-hasPermi="['course_add']">新增</el-button>
      <el-button type="info" icon="el-icon-edit" size="mini" :disabled="selectedRows.length != 1" plain @click="openEditDialog"
        v-hasPermi="['course_edit']">修改</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="selectedRows.length <= 0" plain @click="delCourse"
        v-hasPermi="['course_delete']">删除</el-button>
      <el-button type="warning" icon="el-icon-upload" size="mini" plain @click="upload.open = true" v-hasPermi="['course_upload']">导入</el-button>
      <el-button type="primary" icon="el-icon-document-copy" size="mini" plain @click="exportDialogVisible = true" v-hasPermi="['course_export']">导出</el-button>
    </div>
    <!-- 课程表  -->
    <el-table :data="tableData" class="table" @row-click="handleRowClick" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="SequenceNumber" label="序号">
      </el-table-column>
      <el-table-column prop="courseName" label="课程名称">
      </el-table-column>
      <el-table-column prop="courseCode" label="课程编号" align="center"></el-table-column>
      <el-table-column prop="teacherName" label="教师" align="center"></el-table-column>
      <el-table-column prop="teacherNum" label="职工号" align="center"></el-table-column>
      <!-- <el-table-column label="状态" align="center" v-if="0">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#409EFF"
            inactive-color="#ff4949" @change="(value) => updateStatus(scope.row, value)"></el-switch>
        </template>
</el-table-column> -->
      <el-table-column prop="courseCredits" label="学分" align="center"></el-table-column>
      <el-table-column prop="courseType" label="课程类型" align="center"></el-table-column>
      <!-- <el-table-column prop="classTime" label="上课时间" align="center"></el-table-column>
      <el-table-column prop="location" label="上课地点" align="center"></el-table-column> -->
      <el-table-column prop="maxStudents" label="限制人数" align="center"></el-table-column>
      <el-table-column prop="studentCount" label="已选人数" align="center"></el-table-column>

      <!-- 操作列 -->
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openEditDialog(scope.row)" plain
            :disabled="!can('course_edit')">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDeleteSingle(scope.row)" plain
            :disabled="!can('course_delete')">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 50]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增课程表单 -->
    <el-dialog title="新增课程" :visible.sync="showAddCourseDialog" width="25%">
      <el-form :model="newCourse" label-width="100px">
        <el-form-item label="课程名称" required>
          <el-input v-model="newCourse.courseName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程编号" required>
          <el-input v-model="newCourse.courseCode" placeholder="C25xxx"></el-input>
        </el-form-item>
        <el-form-item label="任课老师" required>
          <el-select v-model="newCourse.teacherName" placeholder="请选择教师" @change="onNameChange" filterable>
            <el-option v-for="teacherName in teacherNames" :key="teacherName" :label="teacherName"
              :value="teacherName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职工号" required>
          <el-select v-model="newCourse.teacherNum" placeholder="请选择职工号" @change="onAccountChange" filterable>
            <el-option v-for="teacherNum in accountOptions" :key="teacherNum" :label="teacherNum"
              :value="teacherNum"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学分" required>
          <el-input v-model="newCourse.courseCredits" placeholder="请输入学分"></el-input>
        </el-form-item>
        <el-form-item label="课程类型" required>
          <el-select v-model="newCourse.courseType" placeholder="请选择课程类型">
            <el-option v-for="type in courseTypes" :key="type" :label="type" :value="type"></el-option>
          </el-select> </el-form-item>
        <el-form-item label="上课时间" required>
          <el-input v-model="newCourse.classTime" placeholder="周一上午8:00"></el-input>
        </el-form-item>
        <el-form-item label="上课地点" required>
          <el-input v-model="newCourse.location" placeholder="北楼505"></el-input>
        </el-form-item>
        <el-form-item label="限制人数" required>
          <el-input v-model.number="newCourse.maxStudents" placeholder="请输入限制人数"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态" required>
          <el-radio-group v-model="newCourse.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddCourseDialog = false">取消</el-button>
        <el-button type="primary" @click="addCourse">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改课程表单 -->
    <el-dialog title="修改课程" :visible.sync="showEditCourseDialog" width="25%">
      <el-form :model="selectedCourse" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="selectedCourse.courseName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程编号">
          <el-input v-model="selectedCourse.courseCode" placeholder="请输入课程编号"></el-input>

        </el-form-item>
        <el-form-item label="教师">
          <el-input v-model="selectedCourse.teacherName" placeholder="请输入教师" readonly></el-input>
        </el-form-item>
        <el-form-item label="职工号">
          <el-input v-model="selectedCourse.teacherNum" placeholder="请输入职工号" readonly></el-input>
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model.number="selectedCourse.courseCredits" placeholder="请输入学分"></el-input>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="selectedCourse.courseType" placeholder="请选择课程类型">
            <el-option v-for="type in courseTypes" :key="type" :label="type" :value="type"></el-option>
          </el-select> </el-form-item>
        <el-form-item label="上课时间">
          <el-input v-model="selectedCourse.classTime" placeholder="请输入上课时间"></el-input>
        </el-form-item>
        <el-form-item label="上课地点">
          <el-input v-model="selectedCourse.location" placeholder="请输入上课地点"></el-input>
        </el-form-item>
        <el-form-item label="限制人数">
          <el-input v-model.number="selectedCourse.maxStudents" placeholder="请输入限制人数"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="selectedCourse.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditCourseDialog = false">取消</el-button>
        <el-button type="primary" @click="editCourse">确定</el-button>
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
        <el-checkbox v-model="exportOptions.onlySelected" :disabled="selectedRows.length <= 0">仅导出选中数据</el-checkbox>
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
import { getAllList, searchCourse, insertCourse, changeStatus, updateCourse, delCourse, exportCourse, getTchAccount } from '@/api/device/lesson'


// import { mapGetters } from 'vuex/dist/vuex.common.js';

export default {
  name: "CourseList",
  // computed: {
  //   ...mapGetters('permission', ['hasButtonPermission'])
  // },

  data() {
    return {
      accountOptions: [],
      teacherNames: [],
      accountNameMap: {},
      nameAccountMap: {},
      courseName: '',
      teacherName: '',
      //分页查询参数
      queryInfo: {
        pagenum: 1, //当前页码
        pagesize: 10, //每页条数
      },
      total: 0, //总条数
      tableData: [], //课程列表数据
      newCourse: {
        courseName: "",
        courseCode: "",
        teacherName: "",
        teacherNum: "",
        courseCredits: "",
        courseType: "",
        classTime: "",
        location: "",
        maxStudents: "",
        // status: 1,
      },
      courseTypes: ['选修', '必修'],
      selectedCourse: {},//当前选中的课程
      showAddCourseDialog: false,
      showEditCourseDialog: false,
      selectedRows: [],//当前选中的行
      showImportCourseDialog: false,
      upload: {
        title: '导入课程数据',
        open: false,
        url: `${BASE_URL}/Course/ImportCourse`,
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
  //生命周期函数，加载页面自动列表用户表
  mounted() {
    this.getAll();
    this.fetchAccounts();

  },
  methods: {
    async fetchAccounts() {
            try {
                const response = await getTchAccount();
                if (response.code === 404) {
                    this.$message.warning(response.msg);
                    this.accountOptions = [];
                    this.teacherNames = [];
                    return;
                }
                if (response.code !== 200) {
                    throw new Error(response.msg);
                }
                const userDatas = response.data || [];

                this.accountOptions = userDatas.map(item => item.Account);
                this.teacherNames = userDatas.map(item => item.UName);

                // 建立双向映射关系
                this.accountNameMap = {};
                this.nameAccountMap = {};
                userDatas.forEach(item => {

                    this.accountNameMap[item.Account] = item.UName;
                    this.nameAccountMap[item.UName] = item.Account;
                });
            } catch (error) {
                console.error('获取账号列表失败:', error);
                this.$message.error(error.message || '获取账号列表失败');

            }
        },
         // 当账号选择变化时更新姓名
         onAccountChange(account) {
            this.newCourse.teacherNames = this.accountNameMap[account] || '';
        },

        // 当姓名选择变化时更新账号
        onNameChange(name) {
            this.newCourse.teacherNum = this.nameAccountMap[name] || '';
        },
    // can(perm) {
    //   return this.$store.getters.permissions?.includes(perm)
    // },

    // hasPermi(permission) {
    //   const permissions = this.$store.state.permission.buttonPermissions.lesson || []
    //   return permissions.includes(permission);

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
        const response = await getAllList({
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
    async findCourse() {
      const params = {
        courseName: this.courseName.trim(),
        teacherName: this.teacherName.trim(),
        pageIndex: this.queryInfo.pagenum,
        pageSize: this.queryInfo.pagesize,
      }
      try {
        if (!this.courseName.trim() && !this.teacherName.trim()) {
          this.$message.error("请输入有效的课程名称或授课老师姓名！");
          return;
        }
        const resp = await searchCourse(params);

        if (resp.code == 200) {
          this.tableData = resp.course;
          this.total = resp.total;
          this.$message(resp.msg);
        } else {
          console.log(resp.course);
          this.$message.error(resp.msg);
        }
      }
      catch (error) {
        console.error("查找失败", error);
        this.$message.error("查找失败，请重试")
      };

    },
    clearSearch() {
      this.courseName = '';
      this.teacherName = '';
      this.getAll();


    },

    async addCourse() {
      try {
        const data = this.newCourse;
        const resp = await insertCourse(data);
        if (resp.code === 200) {
          this.$message(resp.msg);
          this.getAll();
          this.showAddCourseDialog = false; //关闭对话框
          this.newCourse = { // 重置新增课程表单
            courseName: "",
            courseCode: "",
            teacherName: "",
            teacherNum: "",
            courseCredits: "",
          };
        } else {
          this.$message.error(resp.msg);
        }
      }
      catch (error) {
        console.log("新增课程失败：", error);
        this.$message.error("新增课程失败，请检查后端服务！")
      };


    },

    //点击行时触发 
    handleRowClick(row) {
      this.selectedCourse = row;
    },
    // 选中行时触发
    handleSelectionChange(rows) {
      this.selectedRows = rows;

    },
    openEditDialog() {
      if (this.selectedRows.length === 1) {
        this.selectedCourse = { ...this.selectedRows[0] };
        this.showEditCourseDialog = true;
      } else {
        this.$message.warning("请选择一门课程进行修改");
      }
    },

    async updateStatus(course, value) {
      try {
        const data = {
          id: course.id,
          status: value,
        };
        const resp = await changeStatus(data);
        if (resp.code == 200) {
          this.$message.success(resp.msg);
        } else {
          this.$message.error(resp.msg)
        }
      }
      catch (error) {
        console.log("更新状态失败：", error);
        this.$message.error("更新状态失败，请检查后端服务！");
      };
    },
    async editCourse() {
      try {
        const data = this.selectedCourse;

        const resp = await updateCourse(data);
        if (resp.code == 200) {
          this.$message.success(resp.msg);
          this.getAll();
          this.showEditCourseDialog = false;
        } else {
          console.log(resp.msg);
          this.$message.error(resp.msg)
        }
      }
      catch (error) {
        console.log("修改课程失败：", error);
        this.$message.error("修改课程失败，请检查后端服务！");
      };

    },
    // 删除单条数据
    async handleDeleteSingle(row) {
      try {
        const ids = row.id.toString()
        await this.$confirm('确定删除该条课程记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const response = await delCourse({ ids });

        if (response.code === 200) {
          this.$message.success('删除成功');
          this.getAll();
        } else {
          this.$message.error('删除失败');
        }
      }
      catch (error) {
        if (error !== 'cancel') { // 排除用户主动取消的情况
          console.error('删除失败：', error);
          this.$message.error(error.response?.msg || '删除失败，请重试');
        }
      };

    },


    // 批量删除
    async delCourse() {
      try {
        if (this.selectedRows.length === 0) {
          this.$message.warning('请选择要删除的记录');
          return;
        }

        await this.$confirm('确定删除选中的课程记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const ids = this.selectedRows.map(row => row.id).join(','); // 获取选中行的 ID 列表
        const response = await delCourse({ ids });
        if (response.code === 200) {
          this.$message.success('删除成功');
          this.getAll();
        } else {
          this.$message.error('删除失败', error);
        }
      }
      catch (error) {
        if (error !== 'cancel') { // 排除用户主动取消的情况
          console.error('删除失败：', error);
          this.$message.error(error.response?.msg || '删除失败，请重试');
        }
      };

    },


    importTemplate() {
      //下载模板
      window.open(`${BASE_URL}/Course/DownloadTemplate`);
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
          selectedCourseCodes: this.selectedRows.length > 0 && this.exportOptions.onlySelected
            ? this.selectedRows.map(row => row.courseCode.trim()).join(',')
            : undefined   //将选中的课程编号以逗号分隔的字符串形式发送
        };
        //调用导出接口
        const resp = await exportCourse(params);

        this.createDownloadLink(resp.data, "课程表.xlsx");
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

}
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 0 auto;

  padding: 20px;

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
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.el-button {
  margin: 0 5px;

}

.table {
  margin-top: 10px;

}

/* 媒体查询：小屏幕调整 */
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