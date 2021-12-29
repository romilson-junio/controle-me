import axios from 'axios'

const httpClient = axios.create({
    baseURL: 'https://controle-me.herokuapp.com'

})

function urlRequest(base, url){
    return `${base}${url}`;
}

class ApiService{
    
    constructor(apiUrl){
        this.apiUrl = apiUrl;
    }

    post(url, object){
        return httpClient.post(
            urlRequest(this.apiUrl, url), object
        );
    }

    put(url, object){
        return httpClient.put(
            urlRequest(this.apiUrl, url), object
        );
    }

    delete(url){
        return httpClient.delete(
            urlRequest(this.apiUrl, url)
        );
    }

    get(url){
        return httpClient.get(
            urlRequest(this.apiUrl, url)
        );
    }

}

export default ApiService;