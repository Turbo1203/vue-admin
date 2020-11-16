<template>
    <div id="category">
        <el-button type="danger" @click="addFirst({ type: 'category_first_add' })">添加一级分类</el-button>
        <hr class="hr-e9e9e9" />
        <div>
            <el-row :gutter="30">
                <el-col :span="8">
                    <div class="category-wrap">
                        <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
                            <h4>
                                <svg-icon icon-class="plus"></svg-icon>
                                {{firstItem.category_name}}
                                <div class="button-group">
                                    <el-button size="mini" type="danger" round @click="editCategory({ data: firstItem, type: 'category_first_edit'})">编辑</el-button>
                                    <el-button size="mini" type="success" round @click="handlerAddchildren({ data: firstItem, type: 'category_children_add'})">添加子级</el-button>
                                    <el-button size="mini" round @click="deleteCategoryConfirm(firstItem.id)">删除</el-button>
                                </div>
                            </h4>
                            <!-- 子级分类 -->
                            <ul v-if="firstItem.children">
                                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                                    {{childrenItem.category_name}}
                                    <div class="button-group">
                                        <el-button size="mini" type="danger" round>编辑</el-button>
                                        <el-button size="mini" round>删除</el-button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <h4 class="menu-title">一级分类编辑</h4>
                    <el-form  label-width="142px" class="form-wrap" ref="categoryForm">
                        <el-form-item label="一级分类名称" prop="categoryName" v-if="category_first_input">
                            <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类名称" prop="secCategoryName" v-if="category_children_input">
                            <el-input v-model="form.setCategoryName" :disabled="category_children_disabled"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="submit" :loading="submit_button_loading" :disabled="submit_button_disabled">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { AddFirstCategory, AddChildrenCategory, GetCategory, GetCategoryAll, DeleteCategory, EditCategory,} from "@/api/news" ;
import { global } from "@/utils/global_V3.0";
import { common } from "@/api/common";
import { reactive, ref ,onMounted, watch,} from "@vue/composition-api";
export default {
    name : "category",
    setup(props,{root, refs}) {
        //global  删除提示框
        const { confirm } = global();
        const { getInfoCategory, categoryItem, getInfoCategoryAll } = common();

        //reactive
        const form = reactive({
            categoryName: '',
            setCategoryName: ''
        });

        const category = reactive({
            item: []
        })


        //ref

        const submit_button_type = ref('');            //声明这个变量来区分 确定按钮

        const submit_button_loading = ref(false);
        const category_first_input = ref(true);           //基础类型，默认为true
        const category_children_input = ref(true);

        const category_first_disabled = ref(true);
        const category_children_disabled = ref(true);
        const submit_button_disabled = ref(true);
        const deleteId = ref('');
        

        //methods
        const submit = () => {
            if(submit_button_type.value == 'category_first_add') { addFirstCategory() }
            if(submit_button_type.value == 'category_first_edit') { editFirstCategory() }
            if(submit_button_type.value == 'category_children_add') { addChildrenCategory() }
        };
        const addFirstCategory = () => {
            if(!form.categoryName) {
                root.$message({
                    message: "分类名称不能为空！！！",
                    type: "error",
                }) 
                return false;
            }
            //按钮加载状态
            submit_button_loading.value = true
            AddFirstCategory( {categoryName: form.categoryName}).then(response => {   //调用接口
                let data = response.data
                if(data.resCode === 0 ) {
                    root.$message({
                        message: data.message,
                        type: "success", 
                    });
                    category.item.push(response.data.data)   //push:数组的方法，添加至数组的末尾
                }
                submit_button_loading.value = false
                //重置表单
                form.categoryName = ''
                form.setCategoryName = ''
                
            }).catch(error => {
                submit_button_loading.value = false
                form.categoryName = ''
                form.setCategoryName = ''
            })
        }


        const addFirst = (params) => {                    //前面click事件传了参数，这里自定义params获取
            submit_button_type.value = params.type
            category_first_input.value = true;
            category_children_input.value = false;
            category_first_disabled.value = false;
            submit_button_disabled.value = false;
        };

        //添加子级时点击确定按钮
        const addChildrenCategory = () => {
            /* if(!form.secCategoryName){
                root.$message({
                    message: "子级分类名称不能为空！！！",
                    type: "error",
                }) 
                return false
            } */
            let requestData = {
                categoryName: form.secCategoryName,
                parentId: category.current.id,
            }
            AddChildrenCategory(requestData).then(response => {
                let responseData = response.data.data;
                root.$message({
                    message: responseData.message,
                    type: "success",
                })
                //调用分类列表接口  刷新分类列表
                getInfoCategoryAll()
                //清空子级输入框内容
                form.secCategoryName = ''
            })
        }

        //添加子级
        const handlerAddchildren = (params) => {
            submit_button_type.value = params.type               //更新确定按钮的类型
            category.current = params.data                 //存储数据
            category_first_disabled.value = true           //禁用一级输入框
            category_children_disabled.value = false       //启用子级输入框
            submit_button_disabled.value = false           //启用确定按钮
            category_children_input.value = true           //显示子级输入框
            form.categoryName = params.data.category_name  //显示一级分类的内容
        }

        //编辑
        const editCategory = (params) => {
            submit_button_type.value = params.type
            category_children_input.value = false;
            category_first_disabled.value = false;
            submit_button_disabled.value = false;
            form.categoryName = params.data.category_name;    //显示出需要编辑的一级分类的名称
            category.current = params.data;                   //存储当前数据对象
            console.log(category.current)
        }
        const editFirstCategory = () => {
            if(category.current.length == 0) {
                    root.$message({
                        message: "未选择分类！！",
                        type: "warning"
                    })
                    return false
                }
            let requestData = {
                id: category.current.id,
                categoryName: form.categoryName,
            }
            EditCategory(requestData).then(response => {
                let responseData = response.data
                root.$message({
                    message: responseData.message,
                    type: "success",
                })
                category.current.category_name = responseData.data.data.categoryName    //未选择分类！！
                /**
                 *  相当于
                 *  let data = category.item.filter(item => item.id == category.current.id)   //声明一个新数组data
                 *  data[0].category_name = responseData.data.data.categoryName
                 */

                //清空输入框内容
                form.categoryName = ''
                category.current = []
            })
        }

        //删除
        const deleteCategoryConfirm = ( categoryID) => {
            deleteId.value = categoryID
            confirm({
                content: "是否删除当前信息???",
                tips: "警告",
                fn: deleteCategory,
                catchFn: () => {
                    deleted.value = '';
                },
            })
        }
        const deleteCategory = () => {
            /**
             * 操作数组
             * splice(起始位置， 数据的数量， 新数据)函数
             * splice(2, 2, {} )
             *  从第3个位置开始，删除2个元素，并替换成''
             */
            DeleteCategory({ categoryId: deleteId.value }).then(response => {
                let index = category.item.findIndex(item => item.id == deleteId.value);
                category.item.splice(index, 1)
                /**
                 * 过滤法filter 删除元素
                 * let newData = category.item.filter(item => item.id != deleteId.value);
                 * category.item = newData
                 */
            }).catch(error => {

            })
        }
        /**
         * 生命周期
         */
        onMounted(() => {     //挂载完成后调用方法执行 (页面DOM元素完成时，实例完成)
            getInfoCategoryAll()
        })

        /**
         * 监听
         */
        watch(() => categoryItem.item, (value) => {
            category.item = value;
        })

        return {
            category_first_input,        //基础类型
            category_children_input, 
            submit_button_loading, 
            category_first_disabled,  
            category_children_disabled,
            submit_button_disabled,
            form,                      //对象类型
            category,
            submit,                  //事件类型
            addFirst,  
            addChildrenCategory,
            handlerAddchildren,
            deleteCategory,  
            deleteCategoryConfirm,
            editCategory,
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap {
    div:first-child {
        &:before {
            top: 20px;
        }
    }
    div:last-child {
        &:before {
            bottom: 21px;
        }
    }
}
.menu-title {
    line-height: 44px;
    padding-left: 22px;
    background-color: #f3f3f3;
}
.category {
    position: relative;
    line-height : 44px;
    cursor: pointer;
    &::before {
        content: '';
        position: absolute;
        left: 22px;
        top: 0;
        bottom: 0;
        width: 32px;
        border-left: 1px dotted #000;
    }
    h4 {
        position: relative;
        padding-left: 40px;
    }
    svg {
        position: absolute;
        left: 14px;
        top: 15px;
        background-color: #fff;
        font-size: 17px;
    }
    li {
        padding-left: 40px;
        margin-left: 20px;
        position: relative;
        &::before {
            content: '';
            position: absolute;
            width: 32px;
            left: 0;
            top: 21px;
            border-bottom: 1px dotted #000;
        }
    }
    li,h4 {
        &:hover {
            @include webkit(transition, all .5s ease 0s);
            background-color: #f3f3f3;
            .button-group { display: block;}
        }
    }
}
.button-group {
    display: none;
    position: absolute;
    z-index: 2px;
    right: 11px;
    top: -1px;
    button {
        font-size: 12px;
    }
}
.form-wrap {
    width: 410px;
    padding-top: 26px;
}
.hr-e9e9e9 {
    width: calc( 100% + 60px );
    margin-left: -30px;
    margin-top: 30px;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #e9e9e9;
}
</style>