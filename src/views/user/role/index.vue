<!-- 权限管理 -->
<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-wNameth="68px"
            @submit.native.prevent>
            <el-form-item label="权限名称">
                <el-input v-model.trim="queryParams.RName" size="small" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <!-- 当表格为空时可新增 -->
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd2"
                    v-show="DataList.length == 0">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="DataList" style="width: 100%;margin-bottom: 20px;" row-key="RID" border default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :row-class-name="tableRowClassName"
            :height="THeight">
            <el-table-column label="权限名称" align="left" key="RName" prop="RName" />
            <el-table-column label="权限标识" align="center" key="RKey" prop="RKey" />
            <el-table-column label="备注" align="center" key="RRemark" prop="RRemark" />
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-plus" size="mini" @click="handleAdd2(scope.row)"
                        v-hasPermi="['role_add']" :disabled="!scope.row.disabledAdd">新增</el-button>
                    <el-button type="text" icon="el-icon-edit" size="mini" @click="handleEdit2(scope.row)"
                        v-hasPermi="['role_edit']" :disabled="!scope.row.disabledEdit && account != 'admin'">修改</el-button>
                    <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete2(scope.row)"
                        v-hasPermi="['role_delete']"
                        :disabled="!scope.row.disabledEdit || scope.row.children.length != 0">删除</el-button>
                    <el-button type="text" icon="el-icon-view" size="mini" @click="handleLook(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="handleClose"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-card class="box-card">
                <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                    <!-- 1 -->
                    <el-row :gutter="10">
                        <el-col :span="11">
                            <el-form-item label="权限名称" prop="RName">
                                <el-input v-model.trim="form.RName" size="small"
                                    :disabled="title == '修改' || title == '新增管理员'" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="权限标识" prop="RKey">
                                <el-input v-model.trim="form.RKey" size="small"
                                    :disabled="title == '修改' || title == '新增管理员'" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="备注" prop="RRemark">
                                <el-input v-model="form.RRemark" size="small" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 2 -->
                    <el-row :gutter="10">
                        <el-col :span="22">
                            <el-form-item label="菜单权限">
                                <el-checkbox v-model="menuExpand"
                                    @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
                                <el-checkbox v-model="menuNodeAll"
                                    @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
                                <span style="color:#e6a23c">注意:</span> <el-checkbox v-model="checked2" :disabled="true" />
                                为无效菜单<br />
                                <el-tree class="tree-border" :data="menuOptions" show-checkbox ref="menu" node-key="MID"
                                    :check-strictly="false" empty-text="加载中，请稍候" :props="defaultProps"
                                    :default-checked-keys="hadMenuList"></el-tree>
                                <div><span style="color:#f56c6c">Tips: </span> 请谨慎修改, 子权限的有效菜单会因父权限的修改而改变.</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" size="small" @click="handleSubmit" v-prevent-re-click v-show="title != '查看'">确
                    定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { reqGetRoleInfo, reqGetMenuTree, reqGetRoleMenuByRID, reqAddRoleInfo, reqUpdateRoleInfo, reqDeleteRoleInfo } from '@/api/Menu2/RoleConfig'
import { reqGetRoleList } from '@/api/Menu2/UserConfig'
import { mapGetters } from 'vuex'
export default {
    name: "Page03Index",
    data() {
        return {
            SystemName,
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
                RName: undefined
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
                RName: { required: true, message: "必填项", trigger: "blur" },
                RKey: { required: true, message: "必填项", trigger: "blur" },
            },
            menuExpand: false,
            menuNodeAll: false,
            defaultProps: {
                children: "children",
                label: "label"
            },
            // 菜单树形
            menuOptions: [],
            // 勾选数据
            hadMenuList: [],
            // 
            RoleListOption: [],
            // CurrentRid: null,
            LogDataList: [],
            checked2: true,
        }
    },
    computed: {
        ...mapGetters([
            'SysPerValue',
            'account'
        ]),
    },
    created() {
        this.THeight = window.innerHeight - 180;
    },
    mounted() {
        this.getList();
        reqGetRoleList().then(res => {
            this.RoleListOption = res.rows;
        })
    },
    methods: {
        // 获取数据
        getList() {
            this.loading = true;
            reqGetRoleInfo(this.queryParams).then(response => {
                this.DataList = response.TreeList;
                this.LogDataList = response.TreeList;
                this.total = response.total;
                this.loading = false;

                if (this.DataList.length > 0 && this.SysPerValue[this.SystemName]) {
                    this.findNode(this.DataList, this.SysPerValue[this.SystemName]["Permisson"])
                } else if (this.DataList.length > 0 && !this.SysPerValue[this.SystemName]) {
                    // 只有超级管理员登录会出现此问题
                    this.findNode(this.DataList, undefined)
                }
            })
        },
        // 搜索按钮
        handleQuery() {
            this.queryParams.RName ? this.DataList = [this.SearchNodeData(this.LogDataList, this.queryParams.RName)] : this.resetQuery();
        },
        // 重置按钮
        resetQuery() {
            this.queryParams = {
                RName: undefined,
            }
            this.DataList = this.LogDataList;
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.RID)
            this.IndexIds = selection.map(item => item.Index);
            this.single = selection.length != 1
            this.multiple = !selection.length
        },
        // 关闭
        handleClose() {
            this.form = {};
            this.hadMenuList = [];
            // 清空选中
            this.$refs.menu.setCheckedNodes([]);
        },
        // 树权限（展开/折叠）
        handleCheckedTreeExpand(value) {
            let treeList = this.menuOptions;
            for (let i = 0; i < treeList.length; i++) {
                this.$refs.menu.store.nodesMap[treeList[i].MID].expanded = value;
            }
        },
        // 树权限（全选/全不选）
        handleCheckedTreeNodeAll(value) {
            this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
            if (this.menuNodeAll) {
                this.hadMenuList = [];
                this.menuOptions.forEach(item => {
                    this.hadMenuList.push(item.MID);
                    item.children.forEach(item2 => {
                        this.hadMenuList.push(item2.MID);
                        item2.children.forEach(item3 => {
                            this.hadMenuList.push(item3.MID);
                        })
                    })
                });
            } else {
                this.hadMenuList = [];
            }
        },
        // 所有菜单节点数据
        getMenuAllCheckedKeys() {
            // 目前被选中的菜单节点
            let checkedKeys = this.$refs.menu.getCheckedKeys();
            // 半选中的菜单节点
            let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
            checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
            return checkedKeys;
        },
        // 修改
        handleEdit2(row) {
            var flag = true;
            this.DataList.forEach(item => {
                if (item.RID == this.ids[0] && item.RName == '超级管理员') {
                    flag = false
                }
            })
            if (flag) {
                this.title = "修改";
                reqGetRoleMenuByRID(row.RID).then(response => {
                    this.form = response.Info;
                    this.hadMenuList = response.rows;
                    reqGetMenuTree(row.PRID).then(res => {
                        this.menuOptions = res.rows
                    })
                    this.open = true;
                })
            } else {
                this.$message.warning("超级管理员不可修改")
            }
        },
        // 查看
        handleLook(row) {
            this.title = "查看";
            reqGetRoleMenuByRID(row.RID).then(response => {
                this.form = response.Info;
                this.hadMenuList = response.rows;
                reqGetMenuTree(row.PRID).then(res => {
                    this.menuOptions = res.rows
                })
                this.open = true;
            })
        },
        // 新增
        handleAdd2(row) {
            if (row.RID) {
                reqGetMenuTree(row.RID).then(res => {
                    this.menuOptions = res.rows
                })
                this.form.PRID = row.RID;
                this.form.Ancestors = row.Ancestors;
                this.title = "新增";
            } else {
                reqGetMenuTree("0").then(res => {
                    this.menuOptions = res.rows
                })
                this.form.PRID = "0";
                this.form.Ancestors = "0";
                this.form.RName = "管理员";
                this.form.RKey = "sysAdmin";
                this.title = "新增管理员";
            }
            this.open = true;
        },
        // 提交
        handleSubmit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    var menuIds = this.getMenuAllCheckedKeys();
                    // this.form.RName = this.RoleListOption.find(item => { return item.value == this.form.RKey }).label;
                    if (this.title == "新增" || this.title == "新增管理员") {
                        reqAddRoleInfo(this.form, menuIds).then(() => {
                            this.open = false;
                            this.handleClose();
                            this.getList();
                            this.$message.success('操作成功');
                        })
                    } else {
                        this.$alert("<div>请注意: 子权限的有效菜单会因父权限的修改而改变</div><div>是否确定修改?</div>", "Tips",
                            {
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: "我已知悉, 确定修改"
                            }
                        ).then(() => {
                            reqUpdateRoleInfo(this.form, menuIds).then(() => {
                                this.open = false;
                                this.handleClose();
                                this.getList();
                                this.$message.success('操作成功');
                            })
                        })
                    }
                }
            })
        },
        // 删除
        handleDelete2(row) {
            this.$modal.confirm('是否确认删除权限名称为"' + row.RName + '"的数据项？').then(function () {
                return reqDeleteRoleInfo(row.RID);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        // 自己权限高亮
        tableRowClassName({ row, rowIndex }) {
            if (this.SysPerValue[this.SystemName] && row.RName == this.SysPerValue[this.SystemName]["Permisson"]) {
                return "Own-row"
            }
            return '';
        },
        // 处理禁用
        findNode(arr, RName) {
            if (RName) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].RName === RName) {
                        arr[i].disabledEdit = false;   // 修改 + 删除  禁用
                        arr[i].disabledAdd = true;     // 新增  禁用
                        // 当前的list的disabled全部设为true
                        if (arr[i].children) {
                            this.Mak(arr[i].children)
                        }
                        return arr[i];
                    } else if (arr[i].children) {
                        var res = this.findNode(arr[i].children, RName);
                        if (res) {
                            return res;
                        }
                    }
                }
                return null;
            } else {  // 超级管理员
                for (var i = 0; i < arr.length; i++) {
                    arr[i].disabledEdit = true;   // 修改 + 删除  禁用
                    arr[i].disabledAdd = true;     // 新增  禁用
                    // 当前的list的disabled全部设为true
                    if (arr[i].children) {
                        this.Mak(arr[i].children)
                    }
                    var res = this.findNode(arr[i].children, RName);
                }
                return null;
            }
        },
        Mak(arr) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].disabledEdit = true;
                arr[i].disabledAdd = true;
                if (arr[i].children) {
                    this.Mak(arr[i].children)
                }
            }
        },
        // 输入权限名称查询
        SearchNodeData(arr, RName) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].RName === RName) {
                    return arr[i];
                } else if (arr[i].children) {
                    var res = this.SearchNodeData(arr[i].children, RName);
                    if (res) {
                        return res;
                    }
                }
            }
            return null;
        },
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

::v-deep .el-table .Own-row {
    background-color: #fcef34 !important;
}
</style>