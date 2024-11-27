
document.addEventListener("DOMContentLoaded",async(e)=>{
    let category = document.querySelector("#category_id");
    let response= await axios.get("getCategories");
    let data=response.data;
    data.forEach(data=>{
        let option=document.createElement("option");
        option.value=data["category_id"]
        option.text=data["category_name"]
        category.append(option);
    })

    let form = document.querySelector("form");
    let textArea = document.querySelector("textarea");
    let status = document.querySelector("#status");
    let inputs = document.querySelectorAll("input");
    inputs.forEach(input=>{
        input.addEventListener("blur",isValid)
    })
})

function isValid(e){
    
}