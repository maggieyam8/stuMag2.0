<!-- 人员管理 -->
<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
            <el-form-item label="登录账号">
                <el-input v-model="queryParams.Account" size="small" clearable placeholder="请输入登录账号" />
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="queryParams.UName" size="small" clearable placeholder="请输入名称" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['user_add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleEdit"
                    v-hasPermi="['user_edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['user_delete']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" icon="el-icon-bell" size="mini" @click="handleGoAssign" :disabled="single"
                    v-show="account == 'admin'">超级管理员管理</el-button>
            </el-col>
            <!--   <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="handleAddRole"
                    v-hasPermi="['user_addRole']">维护权限下拉框</el-button>
            </el-col> -->
        </el-row>

        <el-table v-loading="loading" :data="DataList" border :height="THeight" :stripe="true"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="序号" align="center" key="Index" prop="Index" />
            <el-table-column label="登录账号" align="center" key="Account" prop="Account" />
            <el-table-column label="名称" align="center" key="UName" prop="UName" />
            <!-- <el-table-column label="职位" align="center" key="UPost" prop="UPost" />
            <el-table-column label="部门" align="center" key="UDept" prop="UDept" /> -->
            <el-table-column label="联系方式" align="center" key="Phone" prop="Phone" />
            <el-table-column label="邮箱" align="center" key="Email" prop="Email" />
            <!-- <el-table-column label="权限" align="center" key="BtnLimits" prop="BtnLimits" /> -->
            <el-table-column label="当前系统权限" align="center">
                <template slot-scope="scope">
                    {{ scope.row["SysPerValue"][SystemName] && scope.row["SysPerValue"][SystemName]["Permisson"] }}
                </template>
            </el-table-column>
            <el-table-column label="上级" align="center" key="Superior" prop="Superior" />
            <el-table-column label="备注" align="center" key="Remark" prop="Remark" />
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="handleClose"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-card class="box-card">
                <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                    <!-- 1 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="登录账号" prop="Account">
                                <el-input v-model="form.Account" size="small" :disabled="title == '修改'" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="名称" prop="UName">
                                <el-input v-model="form.UName" size="small" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="职位" prop="UPost">
                                <el-input v-model="form.UPost" size="small" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="部门" prop="UDept">
                                <el-input v-model="form.UDept" size="small" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 2 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="联系方式">
                                <el-input v-model="form.Phone" size="small" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱">
                                <el-input v-model="form.Email" size="small" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上级">
                                <el-input v-model="form.Superior" size="small" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注">
                                <el-input v-model="form.Remark" size="small" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 3 -->
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="权限" prop="Permisson">
                                <!-- <el-select v-model="form.Permisson" size="small" filterable collapse-tags multiple>
                                    <el-option v-for="item in RoleListOption" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select> -->
                                <el-select v-model="form.Permisson" size="small" filterable>
                                    <el-option v-for="item in RoleListOption" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密码" prop="UPwd">
                                <el-input v-model="form.UPwd" size="small" v-if="title == '新增'" />
                                <el-tooltip class="item" effect="dark" content="123456" placement="right"
                                    v-if="title == '修改'">
                                    <el-button size="small" @click="handleResetPwd">重置密码</el-button>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" size="small" @click="handleSubmit" v-prevent-re-click>确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增权限 -->
        <el-dialog title="权限表格" :visible.sync="openR1" width="600px" append-to-body :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-card class="box-card">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddRole2">新增</el-button>
                    </el-col>
                    <el-col :span="1.5" style="float: right;">
                        <el-input v-model="SearchText" placeholder="请输入关键字搜索" size="mini" clearable></el-input>
                    </el-col>
                </el-row>
                <el-table v-loading="loading" :data="RoleDataList" border height="450" :stripe="true">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column type="index" label="序号" align="center" width="70" />
                    <el-table-column label="权限名称" align="center" key="RName" prop="RName" />
                    <el-table-column label="权限标识" align="center" key="RKey" prop="RKey" />
                </el-table>
                <!-- <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                </el-form> -->
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="openR1 = false">关 闭</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新增权限" :visible.sync="openR2" width="600px" append-to-body :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-card class="box-card">
                <el-form ref="formRole" :model="formRole" label-width="80px" :rules="rulesRole">
                    <!-- 1 -->
                    <el-row :gutter="10">
                        <el-col :span="11">
                            <el-form-item label="权限名称" prop="RName">
                                <el-input v-model="formRole.RName" size="small" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="权限标识" prop="RKey">
                                <el-input v-model="formRole.RKey" size="small" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <span style="font-size: 13px;">Tips: 若有需要, 推荐设定系统前缀</span>
                </el-form>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" size="small" @click="handleSubmit2" v-prevent-re-click>确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { reqGetUserInfo, reqGetRoleList, reqGetUserInfoByUID, reqAddUserInfo, reqUpdateUserInfo, reqResetPwdUserInfo, reqDeleteUserInfo2, reqGetAPPDBRoleInfo, reqAddAPPDBRoleInfo } from '@/api/Menu2/UserConfig'
import { reqGetRoleInfo } from '@/api/Menu2/RoleConfig'
import { mapGetters } from 'vuex'
import md5 from 'js-md5'
export default {
    name: "Page01Index",
    data() {
        return {
            APPName: APPName,
            SystemName: SystemName,
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 选中数据
            ids: [],
            IndexIds: [],
            // 总条数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                Account: undefined,
                UName: undefined
            },
            // 表格数据
            DataList: [],
            // 表格高度
            THeight: 500,
            // 对话框是否显示
            open: false,
            // 对话框标题
            title: "新增",
            // 表单
            form: {},
            rules: {
                Account: { required: true, message: "必填项", trigger: "blur" },
                UName: { required: true, message: "必填项", trigger: "blur" },
                UPost: { required: true, message: "必填项", trigger: "blur" },
                UDept: { required: true, message: "必填项", trigger: "blur" },
                BtnLimits: { required: true, message: "必填项", trigger: "blur" },
                UPwd: { required: true, message: "必填项", trigger: "blur" },
                Permisson: { required: true, message: "必填项", trigger: "blur" },
            },
            RoleListOption: [],

            openR1: false,
            RoleDataList: [],
            LogRoleDataList: [],
            openR2: false,
            formRole: {},
            rulesRole: {
                RName: { required: true, message: "必填项", trigger: "blur" },
                RKey: { required: true, message: "必填项", trigger: "blur" },
            },
            SearchText: "",
            RoleInfoList: [],
            orPwd: undefined,
            orPermisson: undefined
        }
    },
    computed: {
        ...mapGetters([
            'name',
            'account'
        ]),
    },
    watch: {
        SearchText(newV, oldV) {
            this.RoleDataList = [];
            this.RoleDataList = this.LogRoleDataList.filter(data => !this.SearchText || data.RName.toLowerCase().includes(this.SearchText.toLowerCase()) || data.RKey.toLowerCase().includes(this.SearchText.toLowerCase()))
        }
    },
    created() {
        this.THeight = window.innerHeight - 250;
    },
    mounted() {
        this.getList();
        reqGetRoleList().then(res => {
            this.RoleListOption = res.rows;
        })
        reqGetRoleInfo().then(res2 => {
            this.RoleInfoList = res2.rows.map(item => { return item.RName })
        })
    },
    methods: {
        // 获取数据
        getList() {
            this.loading = true;
            reqGetUserInfo(this.queryParams).then(response => {
                this.DataList = response.rows;
                this.total = Number(response.total);
                this.loading = false;
            })
        },
        // 查询按钮
        handleQuery() {
            this.getList();
        },
        // 重置按钮
        resetQuery() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 20,
                Account: undefined,
                UName: undefined
            }
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.UID);
            this.IndexIds = selection.map(item => item.Index);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        // 关闭函数
        async handleClose() {
            this.form = {};
            // this.getList();
        },
        // 按钮新增
        handleAdd() {
            this.open = true;
            this.title = '新增';
        },
        // 按钮修改
        // 只可修改比自己权限低的用户 
        handleEdit() {
            const UIds = this.ids;
            if (UIds.map(Number).indexOf(1) != -1) {
                this.$modal.msgWarning("系统固定超级管理员不可修改");
            } else {
                this.title = '修改';
                reqGetUserInfoByUID(this.ids[0]).then(response => {
                    // var Permisson = this.form.SysPerValue[this.SystemName] ? this.form.SysPerValue[this.SystemName].Permisson.split(",") : [];
                    var LowIndex = this.RoleListOption.findIndex(item => { return item.value == response.data.Permisson });
                    // 情况: 该权限已被删除,(判给 处于无权限状态) 则任何人可给予赋值
                    var InIndex = this.RoleInfoList.indexOf(response.data.Permisson);
                    if (response.data.Permisson && LowIndex == -1 && InIndex != -1) {
                        this.$modal.msgWarning("当前选择用户的权限不低于自身, 无法操作修改");
                    } else {
                        this.form = JSON.parse(JSON.stringify(response.data));
                        this.open = true;
                    }
                })
            }
        },
        // 提交
        handleSubmit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.title == "新增") {
                        this.orPwd = this.form.UPwd;
                        this.orPermisson = this.form.Permisson;
                        this.form.UPwd = md5(this.form.UPwd);
                        this.form.SysPerValue = {
                            [this.SystemName]: {
                                Permisson: this.form.Permisson
                            }
                        }
                        // delete this.form.Permisson;
                        this.form.Permisson = undefined
                        reqAddUserInfo([this.form], `${this.APPName}-${this.name}-新增`).then(() => {
                            this.open = false;
                            this.handleClose();
                            this.getList();
                            this.$message.success('操作成功');
                        }).catch(() => {
                            this.form.UPwd = this.orPwd;
                            this.form.Permisson = this.orPermisson;
                        })
                    } else {
                        this.form.SysPerValue = {
                            ...this.form.SysPerValue,
                            [this.SystemName]: {
                                Permisson: this.form.Permisson
                            }
                        }
                        this.form.Permisson = undefined
                        reqUpdateUserInfo([this.form], `${this.APPName}-${this.name}-修改`).then(() => {
                            this.open = false;
                            this.handleClose();
                            this.getList();
                            this.$modal.msgSuccess("操作成功");
                        })
                    }
                }
            })
        },
        // 重置密码
        handleResetPwd() {
            reqResetPwdUserInfo(this.form.UID, md5('123456'), `${this.APPName}-${this.name}-重置密码`).then(() => {
                this.$modal.msgSuccess("重置成功");
            })
        },
        /** 删除按钮操作 */
        handleDelete() {
            const ids = this.ids;
            const UIds = this.IndexIds;
            if (UIds.map(Number).indexOf(1) != -1) {
                this.$modal.msgWarning("系统固定超级管理员不可删除");
            } else {
                // 判断操作用户是否比自己高权限
                // 1. 当前权限存在, 且低于自身 => 可删除
                // 2. 当前权限不存在 => 可删除 
                var flag = true;
                // 当前所选用户的所有权限
                var HasPer = [];
                this.DataList.forEach(item => {
                    if (ids.indexOf(item.UID) != -1) {
                        item.SysPerValue[this.SystemName] ? HasPer.push(item.SysPerValue[this.SystemName]["Permisson"]) : undefined
                    }
                })
                //! 优化: 使用while可提前跳出循环 => 减少循环次数
                let i = -1;
                while (++i < HasPer.length) {
                    console.log("111");
                    var InIndex = this.RoleInfoList.indexOf(HasPer[i]);
                    if (InIndex != -1) {
                        var Index = this.RoleListOption.findIndex(item2 => { return item2.value == HasPer[i] });
                        if (Index == -1) {
                            flag = false;
                            break;
                        }
                    }
                }
                // HasPer.forEach(item => {
                //     console.log("111");
                //     var InIndex = this.RoleInfoList.indexOf(item);
                //     if (InIndex != -1) {
                //         var Index = this.RoleListOption.findIndex(item2 => { return item2.value == item });
                //         if (Index == -1) {
                //             flag = false
                //         }
                //     }
                // })

                if (flag) {
                    this.$alert(`<div>是否确认<span style="color:#ff4949">删除</span>序号为${UIds}的数据项？</div>`, '请注意', {
                        dangerouslyUseHTMLString: true
                    }).then(() => {
                        reqDeleteUserInfo2(ids, `${this.APPName}-${this.name}-删除`).then(res => {
                            if (res.MsgNO) {
                                this.$alert(`<div>已操作</div><div>其中用户: ${res.MsgNO}, 在其他系统中存在权限, 不可删除</div><div>若坚持要删除, 请联系'超级管理员'</div>`, "Tips", { dangerouslyUseHTMLString: true })
                            } else {
                                this.$message.success('删除成功');
                            }
                        })
                        // return reqDeleteUserInfo(ids, `${this.APPName}-${this.name}-删除`);
                    }).then(() => {
                        this.getList();
                    }).catch(() => { });
                } else {
                    this.$modal.msgWarning("当前选择用户的权限不低于自身, 无法操作删除");
                }
            }
        },
        handleAddRole() {
            this.openR1 = true;
            reqGetAPPDBRoleInfo().then(response => {
                this.RoleDataList = response.rows;
                this.LogRoleDataList = JSON.parse(JSON.stringify(response.rows));
            })
        },
        handleAddRole2() {
            this.openR2 = true;
            this.formRole = {};
        },
        handleSubmit2() {
            this.$refs["formRole"].validate(valid => {
                if (valid) {
                    reqAddAPPDBRoleInfo(this.formRole, `${this.APPName}-${this.name}-新增`).then(() => {
                        this.openR2 = false;
                        this.$message.success('操作成功');
                        reqGetAPPDBRoleInfo().then(response => {
                            this.RoleDataList = response.rows;
                            this.LogRoleDataList = JSON.parse(JSON.stringify(response.rows));
                            reqGetRoleList("1").then(res => {
                                this.RoleListOption = res.rows;
                            })
                        })
                    })
                }
            })
        },
        // 处理权限下拉
        MakeRole(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].children.length > 0) {
                    this.MakeRole(arr[i].children)
                } else {
                    delete arr[i].children
                }
            }
        },
        handleGoAssign() {
            this.$router.push({
                name: "AssignPer",
                query: {
                    UID: this.ids[0]
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
}
::v-deep .el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
    background-color: #f0f8ff !important;
}

::v-deep .el-dialog__body {
    padding: 5px 20px !important;
}

::v-deep .box-card .el-form-item {
    margin-bottom: 10px !important;
}

::v-deep .el-input.is-disabled .el-input__inner {
    color: #515a6e !important;
}

::v-deep .el-form-item__error {
    font-size: 11px !important;
    padding-top: 0px !important;
}
</style>