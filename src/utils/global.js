import { MessageBox } from "element-ui";
export default {
    install (Vue, options) {
        Vue.prototype.confirm =  (params) => {     // params 传参
            MessageBox.confirm(params.content, params.tip || '提示', {
                confirmButtonText: params.yes1 || params.yes2,
                cancelButtonText: params.no1 || params.no2,
                type: params.type1 || params.type2,
                center: true 
            }).then(() => {
                /* root.$message({
                    type: 'success',
                    message: '删除成功'
                }); */
                params.fn && params.fn(params.id)  // == if( params.fn ) { params.fn(params.id) } , (params.id) == (value)值
            }).catch(() => {
                /* root.$message({
                    type: 'info',
                    message: '删除失败'
                }); */
            });
        }
    }

}         //引用方法：直接root.xxx()即可

