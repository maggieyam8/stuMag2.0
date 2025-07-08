<template>
    <div class="container">
        <!-- 搜索框和按钮 -->
        <div class="search-bar">
            <div class="search-item">
                <span class="search-title">姓名：</span>
                <el-input v-model="stuName" placeholder="请输入学生姓名" class="search-input"></el-input>
            </div>
            <div class="search-item">
                <span class="search-title">班级：</span>
                <el-input v-model="stuClass" placeholder="请输入班级" class="search-input"></el-input>
            </div>
            <el-button type="primary" icon="el-icon-search" size="mini" plain @click="findStu">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="clearSearch">重置</el-button>

        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
            <el-button type="primary" icon="el-icon-plus" size="mini" plain @click="showAddStuDialog = true" v-hasPermi="['stu_add']">新增</el-button>
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="selectedRows.length != 1" plain @click="openEditDialog"
                v-hasPermi="['stu_edit']">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="selectedRows.length <= 0" plain @click="delStu"
                v-hasPermi="['stu_delete']">删除</el-button>
            <el-button type="warning" plain  icon="el-icon-upload" size="mini" @click="upload.open = true" v-hasPermi="['stu_upload']">导入</el-button>
            <el-button type="info" icon="el-icon-document-copy" size="mini" plain @click="exportDialogVisible = true"
                v-hasPermi="['stu_export']">导出</el-button>
        </div>
        <!-- 学生表格 -->
        <el-table :data="tableData" class="table" @row-click="handleRowClick" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column prop="SequenceNumber" label="学生编号">
            </el-table-column>
            <el-table-column prop="Account" label="账号"></el-table-column>
            <el-table-column prop="stuName" label="学生姓名">
            </el-table-column>
            <el-table-column prop="stuNumber" label="学号"></el-table-column>
            <el-table-column prop="stuClass" label="班级"></el-table-column>
            <el-table-column prop="stuMajor" label="专业"></el-table-column>

            <!-- 操作列 -->
            <!-- <el-table-column label="操作" align="center" v-hasPermi="['stu_edit']">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="openEditDialog(scope.row)" plain
                    v-hasPermi="['stu_edit']">修改</el-button>
                    <el-button type="danger" size="mini" @click="handleDeleteSingle(scope.row)" plain
                    v-hasPermi="['stu_delete']">删除</el-button>
                </template>
</el-table-column> -->

        </el-table>
        <!-- 分页 -->
        <div class="block">
            <span class="demonstration"></span>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[30, 60, 90]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <!-- 新增学生表单 -->
        <el-dialog title="新增学生" :visible.sync="showAddStuDialog" width="25%">
            <el-form :model="newStu" label-width="100px">
                <el-form-item label="账号" required>
                    <el-select v-model="newStu.Account" placeholder="请选择用户账号" @change="onAccountChange" filterable>
                        <el-option v-for="Account in accountOptions" :key="Account" :label="Account"
                            :value="Account"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" required>
                    <el-select v-model="newStu.stuName" placeholder="请选择用户名" @change="onNameChange" filterable>
                        <el-option v-for="stuName in stuNames" :key="stuName" :label="stuName"
                            :value="stuName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学号">
                    <el-input v-model="newStu.stuNumber" placeholder="请输入学号"></el-input>

                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="newStu.stuClass" placeholder="请输入班级"></el-input>
                </el-form-item>
                <el-form-item label="专业">
                    <el-input v-model="newStu.stuMajor" placeholder="请输入专业名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddStuDialog = false">取消</el-button>
                <el-button type="primary" @click="addStu">确定</el-button>
            </div>
        </el-dialog>

        <!-- 修改学生对话框 -->
        <el-dialog title="修改学生信息" :visible.sync="showEditStuDialog" width="25%">
            <el-form :model="selectedStu" label-width="100px">
                <el-form-item label="账号">
                    <el-input v-model="selectedStu.Account" placeholder="请选择用户账号" readonly></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="selectedStu.stuName" placeholder="请输入姓名" readonly></el-input>
                </el-form-item>
                <el-form-item label="学号">
                    <el-input v-model="selectedStu.stuNumber" placeholder="请输入学号"></el-input>

                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="selectedStu.stuClass" placeholder="请输入班级"></el-input>
                </el-form-item>
                <el-form-item label="专业">
                    <el-input v-model="selectedStu.stuMajor" placeholder="请输入专业名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showEditStuDialog = false">取消</el-button>
                <el-button type="primary" @click="editStu">确定</el-button>
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
                        <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
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
import { API_BASE_URL } from '@/config';
import axios, { Axios } from 'axios'
import { getAllStu, searchStu, insertStu, updateStu, delStu, exportStu, getAccounts } from '@/api/manage/list'
export default {
    name: "StuList",
    data() {
        return {
            accountOptions: [],
            stuNames: [],
            accountNameMap: {},
            nameAccountMap: {},
            stuName: '',
            stuClass: '',
            //分页查询参数
            queryInfo: {
                pagenum: 1, //当前页码
                pagesize: 30, //每页条数
            },
            total: 0, //总条数
            tableData: [], //学生列表数据
            newStu: {
                stuName: "",
                stuNumber: "",
                stuClass: "",
                stuMajor: "",
                Account: "",

            },
            selectedStu: {
                id: '',
                Account: '',
                stuName: '',
                stuNumber: '',
                stuClass: '',
                stuMajor: ''
            },//当前选中的学生
            showAddStuDialog: false,
            showEditStuDialog: false,
            selectedRows: [],//当前选中的行
            showImportStuDialog: false,
            upload: {
                title: '导入学生数据',
                open: false,
                url: `${BASE_URL}/StuList/ImportStu`,
                headers: {},
                updateSupport: false,
                isUploading: false,

            },
            exportDialogVisible: false,
            exportOptions: {
                includeHeader: true, //是否包含表头
                onlySelected: false, //是否仅导出选中数据
            },


        };
    },
    //生命周期函数，加载页面自动列表学生表
    mounted() {
        this.getAll();
        this.fetchAccounts();

    },
    methods: {
        async fetchAccounts() {
            try {
                const response = await getAccounts();
                if (response.code === 404) {
                    this.$message.warning(response.msg);
                    this.accountOptions = [];
                    this.stuNames = [];
                    return;
                }
                if (response.code !== 200) {
                    throw new Error(response.msg);
                }
                const userDatas = response.data || [];

                this.accountOptions = userDatas.map(item => item.Account);
                this.stuNames = userDatas.map(item => item.UName);

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
            this.newStu.stuName = this.accountNameMap[account] || '';
        },

        // 当姓名选择变化时更新账号
        onNameChange(name) {
            this.newStu.Account = this.nameAccountMap[name] || '';
        },

        // 确保can方法能访问最新store数据
        // can(perm) {
        //     // 调试输出
        //     console.log('校验权限:', perm, '当前权限:', this.$store.getters.permissions);
        //     return this.$store?.getters?.permissions?.includes(perm) ?? false;
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
        //获取全部学生信息
        async getAll() {
            try {
                const { pagenum, pagesize } = this.queryInfo;
                const params = {
                    pageIndex: pagenum, //当前页码
                    pageSize: pagesize, //每页条数
                };
                const response = await getAllStu(params);

                if (response.code === 200) {
                    this.tableData = response.student;//更新学生列表
                    this.total = response.total;//更新总条数
                } else {
                    this.$message.error("获取学生列表失败");
                }
            } catch (error) {
                this.$message.error("请求失败，请检查网络");
                console.error(error);
            }

        },
        //查找学生
        async findStu() {
            try {
                if (!this.stuName.trim() && !this.stuClass.trim()) {
                    this.$message.error("请输入有效的学生姓名或班级！");
                    return;
                }
                const params = {
                    stuName: this.stuName.trim(),
                    stuClass: this.stuClass.trim(),
                    pageIndex: this.queryInfo.pagenum,
                    pageSize: this.queryInfo.pagesize,

                };
                const resp = await searchStu(params);

                this.total = resp.total;
                this.tableData = resp.student;

                if (resp.code == 200) {
                    this.$message(resp.msg);
                } else {
                    this.$message.error(resp.msg);
                }
            }
            catch (error) {
                console.error("查找失败", error);
                this.$message.error("查找失败，请重试")
            };
        },
        clearSearch() {
            this.stuName = '';
            this.stuClass = '';
            this.getAll();
        },

        async addStu() {
            try {
                const resp = await insertStu(this.newStu);

                if (resp.code == 200) {
                    this.$message(resp.msg);
                    this.getAll();
                    this.showAddStuDialog = false;
                    this.newStu = {
                        stuName: "",
                        stuNumber: "",
                        stuClass: "",
                        stuMajor: ""
                    };
                } else {
                    this.$message.error(resp.msg)
                }
            }
            catch (error) {
                console.log("新增学生失败：", error);
                this.$message.error("新增学生失败，请检查后端服务！")
            };


        },

        //点击行时触发 
        handleRowClick(row) {
            this.selectedStu = { ...row };
        },
        //选中行时激发
        handleSelectionChange(rows) {
            this.selectedRows = rows;
            if (rows.length === 1) {
                this.selectedStu = { ...rows[0] };
            }
        },

        openEditDialog() {
            if (this.selectedRows.length === 1) {
                this.selectedStu = { ...this.selectedRows[0] }; // 使用展开运算符创建新对象
                this.showEditStuDialog = true;
            } else {
                this.$message.warning("请选择且仅选择一个用户进行修改");
            }
        },

        async editStu() {

            try {
                const resp = await updateStu(this.selectedStu);
                console.log(resp);
                if (resp.code == 200) {
                    this.$message.success(resp.msg);
                    this.getAll();
                    this.showEditStuDialog = false;

                } else {
                    console.log(resp.msg);
                    this.$message.error(resp.msg)
                }
            }
            catch (error) {
                console.log("修改用户失败：", error);
                this.$message.error("修改用户失败，请检查后端服务！");
            };
        },

        // 删除单条数据
        async handleDeleteSingle(row) {
            try {
                const ids = row.id.toString();
                await this.$confirm('确定删除该条学生记录吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                const response = await delStu({ ids });

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
        async delStu() {
            try {
                if (this.selectedRows.length === 0) {
                    this.$message.warning('请选择要删除的记录');
                    return;
                }

                await this.$confirm('确定删除选中的学生记录吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                const ids = this.selectedRows.map(row => row.id).join(',');
                const response = await delStu({ ids });

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
            window.open(`${BASE_URL}/StuList/DownloadTemplate`);
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

            this.upload.isUploading = false;
            this.$message.error('文件上传失败：' + err.message);
        },
        submitFileForm() {

            this.$refs.upload.submit();
        },

        createDownloadLink(blob, filename) {
            //创建下载链接
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },

        //处理导出操作
        async handleExport() {
            try {
                const params = {
                    includeHeader: this.exportOptions.includeHeader,
                    onlySelected: this.exportOptions.onlySelected,
                    selectedStuNums: this.selectedRows.length > 0 && this.exportOptions.onlySelected
                        ? this.selectedRows.map(row => row.stuNumber.trim()).join(',')
                        : undefined //将选中的学号以逗号分隔的字符串形式发送
                };

                const resp = await exportStu(params);


                this.createDownloadLink(resp.data, "学生表.xlsx");
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
</style>