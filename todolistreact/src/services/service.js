import axios from 'axios'

const baseURL = "http://localhost:5000/tasks"

class todoListService {
    //get
    getList(){
        return axios.get(baseURL);
    }

    //post
    createTask(task){
        return axios.post(baseURL, task);
    }

    //put
    updateTask(id, task){
        return axios.put(`${baseURL}/${id}`, task);
    }

    //delete
    deleteTask(id){
        return axios.delete(`${baseURL}/${id}`)
    }
}

export default new todoListService();