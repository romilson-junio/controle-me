import axios from 'axios'

const baseURL = process.env.REACT_APP_API_URL;

export const httpClient = axios.create({
    baseURL: baseURL,
    withCredentials: true

})

function urlRequest(base, url){
    return `${base}${url}`;
}

class ApiService{
    
    constructor(apiUrl){
        this.apiUrl = apiUrl;
    }

    static registrarToken(token){
        if(token){
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
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