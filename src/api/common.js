

//  获取信息分类 vue 3.0方法
import { GetCategory, GetCategoryAll} from "@/api/news";
import { reactive } from "@vue/composition-api";
export function common () {
    const categoryItem = reactive({
        item: [],
    });


    /**
     * 获取分类
     */
    const getInfoCategory = () => {
        GetCategory({}).then(response => {
            categoryItem.item = response.data.data.data          //获取信息分类的数据，并赋值给item数组
        }).catch(error => {

        })
    }

    /**
     * 获取全部分类
     */
    const getInfoCategoryAll = () => {
        GetCategoryAll({}).then(response => {
            console.log(response)
            categoryItem.item = response.data.data   
        }).catch(error => {

        })
    }

    return {
        getInfoCategory,
        getInfoCategoryAll,
        categoryItem,
    }
}