<template>
    <el-dialog title="编辑" :visible.sync="data.dialog_info_flag" @close="close" width="580px" @open="openDialog" >
        <el-form :model="data.form" ref="addInfoForm">
            <el-form-item label="分类：" :label-width="data.formLabelWidth" prop="category">
                <el-select v-model="data.form.category" placeholder="请选择活动区域">
                    <el-option v-for="item in data.categoryOption" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题：" :label-width="data.formLabelWidth" prop="title">
                <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="概况：" :label-width="data.formLabelWidth" prop="content">
                <el-input type="textarea" v-model="data.form.content" placeholder="请输入内容" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="danger" :loading="data.submitLoading" @click="submit">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { AddInfo, GetList, EditInfo } from "@/api/news";
import { reactive, ref, watch } from '@vue/composition-api';
export default {
    name: 'dialogInfo',
    props: {
        flag: {
            type: Boolean,
            defalut: false
        },
        category: {
            type: Array,
            defalut: () => [],
        },
        id: {
            type: String,
            defalut: ""
        },
    },
    setup(props, { root, emit, refs}){
        const data = reactive({
            dialog_info_flag: false,       //弹窗标记
            formLabelWidth: '70px',
            form: {
                category: '',
                title: '',
                content: '',
            },
            categoryOption: [],         //分类下拉
            submitLoading: false,        //按钮加载
        })

        watch(() => data.dialog_info_flag = props.flag);

        //vue 2.0  methods
        const close = () => {
            data.dialog_info_flag = false;
            resetForm();
            emit("update:flag", false);
        }

        const openDialog = () => {
            data.categoryOption = props.category         //将数据赋值给数组对象categoryOption里的数组item,利用item进行v-for循环
            getInfo()
        }

        const getInfo = () => {
            let requestData = {
                pageNumber: 1,
                pageSize: 1,
                id: props.id,
            }
            GetList(requestData).then(response => {
                let responseData = response.data.data.data[0]
                data.form = {
                    category: responseData.categoryId,
                    title: responseData.title,
                    content: responseData.content,
                }
            })
        }

        //清除内容
        const resetForm = () => {
            refs.addInfoForm.resetFields();
        }

        const submit = () => {
            let requestData = {
                id: props.id,
                category: data.form.category,
                title: data.form.title,
                content: data.form.content,
            }
            if(!data.form.category) {
                root.$message({
                    message: "分类不能为空！！！",
                    type: "error",
                })
                return false;
            }
            data.submitLoading = true
            EditInfo(requestData).then(response => {
                let responseData = response.data
                root.$message({
                    message: data.message,
                    type: "success",
                })
                data.submitLoading = false

                /**
                 * 两者刷新数据方法：
                 * 1、直接刷新接口
                 * 2、返回列表，手动修改指定的数据
                 */
                emit("getListEmit");                            //回调父组件的东西


                //重置表单
                //resetForm()
                
                
            }).catch(error => {
                data.submitLoading = false
            })
        }

        return {
            data,
            close, openDialog, submit,
        }
    }
    /* watch: {      //监听
        flag: {
            handler(newValue, oldValue) {
                this.dialog_info_flag = newValue;
            }
        }
    } */
}
</script>

<style scoped>

</style>