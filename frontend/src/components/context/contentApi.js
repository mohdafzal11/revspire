export function fetchAllContent(){
    return new Promise (async (resolve)=>{
         const response =await fetch("http:/localhost:3000/view-all-content")
         if(!response.ok){
            console.log(response)
         }
         const data=await response.json()
         console.log(data)
         return data;
    })
}