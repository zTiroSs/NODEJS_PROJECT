export const url = "http://localhost:3000/";
export const fetchAPI = async (url:string , option?:any) => {
    const response = await fetch(url,option);
    return response.json();
}