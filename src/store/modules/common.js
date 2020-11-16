// 获取信息分类  vuex方法
import { GetCategory } from "@/api/news";

const actions = {
    getInfoCategory(content, responseData) {
        return new Promise((resolve, reject) => {
            GetCategory({}).then((response) => {
                resolve(response.data.data.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    actions,
    namespaced: true,
}