<template>
    <div>
        <el-row :gutter="16">         <!--   :gutter="" 间隔 -->
            <el-col :span="4" >

                <div class="label-wrap category" >
                    <label for="">分类:</label>
                    <div class="wrap-content">
                        <el-select v-model="category_value" placeholder="请选择" style="width: 100%">
                            <el-option
                                v-for="item in options.category"
                                :key="item.id"
                                :label="item.category_name"
                                :value="item.id">
                            </el-option>
                    </el-select>
                    </div>
                </div>
            </el-col>

            <el-col :span="7">
                <div class="label-wrap date">
                    <label for="">日期:&nbsp;&nbsp;</label>
                    <div class="wrap-content">
                        <el-date-picker
                            v-model="date_value"
                            type="daterange"
                            align="right"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :defalut-time="['00:00:00', '23:59:59']"
                            style="width : 100%">
                        </el-date-picker>
                    </div>
                </div>
            </el-col>

            <el-col :span="4">
                <div class="label-wrap key-word">
                    <label for="">关键字:&nbsp;&nbsp;</label>
                    <div class="wrap-content">
                        <el-select v-model="search_key" style="width: 100%">
                            <el-option
                                v-for="item in search_option"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                    </el-select>
                    </div>
                </div>
            </el-col>

            <el-col :span="3">
                <el-input v-model="search_keyWord" placeholder="请输入内容" style="width : 100%"></el-input>
            </el-col>

            <el-col :span="2">
                <el-button type="danger" style="width : 100%" @click="getList">搜索</el-button>
            </el-col>

            <el-col :span="2"></el-col>

            <el-col :span="2">
                <el-button type="danger" class="pull-right" style="width : 100%" @click="dialog_info = true">新增</el-button>
            </el-col>

        </el-row>

        <!-- 表格数据 -->
        <div class="black-space-30"></div>
        <el-table :data="table_data.item" v-loading="loadingData" @selection-change="handleSelectionChange" border style="width: 100%">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="title" label="标题" width="480"></el-table-column>
            <el-table-column prop="categoryId" label="类型" width="100" :formatter="toCategory"></el-table-column>
            <el-table-column prop="createDate" label="日期" width="200" :formatter="toData"></el-table-column>
            <el-table-column prop="user" label="管理人" width="100"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="small" @click="deleteItem(scope.row.id)">删除</el-button>
                    <el-button type="success" size="small" @click="editInfo(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="black-space-30"></div>
        
        <!-- 底部分页 -->
        <el-row>
            <el-col :span="10">
                <el-button @click="deleteAll">批量删除</el-button>
            </el-col>
            <el-col :span="14">
                <el-pagination 
                class="pull-right"
                background 
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"  
                :page-sizes="[10, 20, 50, 100]"
                :total="total"> 
                </el-pagination>  <!-- total:总共页数，prev、next:左右箭头，pager：数字, jumper:跳往第几页-->
            </el-col>
        </el-row>

        <!-- 新增弹窗 -->
        <!-- 子组件DialogInfo 接收父组件的值是通过属性的方式 sync为修饰器 -->
        <DialogInfo :flag.sync="dialog_info" :category="options.category" />     <!-- 通过自定义参数 :category 来接收变量 -->     

        <!-- 编辑弹窗 -->
        <DialogEditInfo :flag.sync="dialog_info_edit" :id="infoId" :category="options.category" @getListEmit="getList" />

    </div>
</template>

<script>
import { GetCategory, GetList, DeleteInfo } from "@/api/news";
import DialogInfo from "./dialog/info";     //引用组件(子组件)
import DialogEditInfo from "./dialog/edit";
import { global } from "@/utils/global_V3.0";
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import { timestampToTime } from "@/utils/common";

export default {
    name : "infoIndex",
    components: { DialogInfo, DialogEditInfo },              //定义组件
    setup(props,{root}) {
        const { str: aaa, confirm } = global();              //str: aaa  重命名，将str命名为aaa
        watch(() => {
            console.log(aaa.value)
        })
        /**
         * 数据
         */
        const dialog_info = ref(false);
        const dialog_info_edit = ref(false);
        const category_value = ref('');
        const date_value = ref('');
        const search_key=ref('id');  //默认值
        const search_keyWord=ref('');
        const total = ref(0);
        const deleteInfoId = ref('');
        const infoId = ref('');

        //loading
        const loadingData = ref(false);

        // ref()基础数据,reactive()对象数据

        const options = reactive ({
            category: []
        });

        //搜索关键字
        const search_option = reactive([
            {value: "id", label: "ID"},
            {value: "title", label: "标题"},
        ]);

        //页码
        const page = reactive({
            pageNumber: 1,
            pageSize: 10
        })

        //表格数据
        const table_data = reactive ({
            item: []
            /* {
                title: '肇庆市市长杨燃彬宣布退出省长竞选，杨冬辰发微博回应',
                category: '国内信息',
                date: '2020-10-29 16:59:30',
                user: '管理员'
            }, 
            {
                title: '肇庆市市长杨燃彬宣布退出省长竞选，杨冬辰发微博回应',
                category: '国内信息',
                date: '2020-10-29 16:59:30',
                user: '管理员'
            }, 
            {
                title: '肇庆市市长杨燃彬宣布退出省长竞选，杨冬辰发微博回应',
                category: '国内信息',
                date: '2020-10-29 16:59:30',
                user: '管理员'
            }, 
            {
                title: '肇庆市市长杨燃彬宣布退出省长竞选，杨冬辰发微博回应',
                category: '国内信息',
                date: '2020-10-29 16:59:30',
                user: '管理员'
            },  */
            
        });

        /**
         * vue2.0  methods
         */ 
        const handleSizeChange = (val) => {
            page.pageSize = val
        }

        const handleCurrentChange = (val) => {
            page.pageNumber = val
            getList()
        }


        /**
         * 搜索条件处理
         */
        const formatData = () => {
            let requestData = {
                pageNumber: page.pageNumber,
                pageSize: page.pageSize,
            };
            //分类ID
            if(category_value.value) { requestData.categoryId == category_value.value }
            //日期
            if(date_value.value.length > 0) {
                requestData.startTime = date_value.value[0];
                requestData.endTime = date_value.value[1]
            }
            //关键字
            if(search_keyWord.value) {
                requestData[search_key.value] = search_keyWord.value
            }
            return requestData
        }

        const editInfo = (id) => {
            infoId.value = id;
            dialog_info_edit.value = true;
            
        }


        const getList = () => {
            //单独处理数据
            let requestData = formatData();
            //加载状态
            loadingData.value = true;
            GetList(requestData).then(response => {
                let data = response.data.data
                //更新数据
                table_data.item = data.data
                //页面统计数量total
                total.value = data.total
                //加载状态
                loadingData.value = false;
            }).catch(error => {
                loadingData.value = false;
            })
        }

        /**
         * 删除数据
         */
        
        const deleteItem = (id) => {
            deleteInfoId.value = [id]
            confirm ({
                content: "是否删除当前信息？",
                tip: "警告",
                fn: confirmDelete,
            })
        }

        const deleteAll = () => {
            if(!deleteInfoId.value || deleteInfoId.value.length == 0 ) {
                root.$message({
                    message: "请选择要删除的数据！！！",
                    type: "error",
                })
                return false;
            }
            confirm ({
                content: "是否批量删除已选中的信息？",
                tip: "警告",
                fn: confirmDelete,
            })
        }

        const confirmDelete = (value) => {
            DeleteInfo({id: deleteInfoId.value}).then(response => {
                deleteInfoId.value = '';
                getList()
            })
        }

        //vuex方法
        const getInfoCategory = () => {
            root.$store.dispatch('common/getInfoCategory').then(response => {    
                options.category = response
            })
        }

        const toData = (row, column, cellValue, index) => {
            return timestampTotime(row.createDate);
        }

        const toCategory = (row) => {
            //调用一个函数，返回一个新的值，替换原来的值
            let categoryId = row.categoryId;
            let categoryData = options.category.filter(item => item.id == categoryId)[0];
            return category.category_name;
        }

        const handleSelectionChange = (val) => {
            let id = val.map(item => item.id);
            deleteInfoId.value = id;
        }

        /**
         * 生命周期
         */

        //挂载完成后执行
        onMounted(() => {
        
            //获取分类,获取信息分类里面的数据
            getInfoCategory()
            //获取列表
            getList();
        })

        /**
         *   监听 vue3.0
         * 监听common.js 里面的categoryItem 的值，若值发生改变，则做出相应行为
         */

        /* watch(() => categoryItem.item, (value) => {     //获取数组item的数据值
            options.category = value                //将数据赋值给对象opitions里面的数组category
        }) */

        

        return {
            //  ref
            dialog_info,
            dialog_info_edit,
            date_value,
            category_value,
            search_key,
            search_keyWord,
            total,
            loadingData,
            infoId,

            // reactive
            options,
            search_option,
            table_data,

            // vue 2.0 methods
            handleSizeChange,
            handleCurrentChange,
            editInfo,
            deleteItem,
            deleteAll,
            getList,
            toData,
            toCategory,
            handleSelectionChange,
            
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss"; 
.label-wrap {
    &.category { @include labelDom(left, 60, 40); }
    &.date { @include labelDom(right, 93, 40); }
    &.key-word { @include labelDom(right, 99, 40); }
    
}
</style>