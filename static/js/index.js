
document.addEventListener("DOMContentLoaded",async(e)=>{
    const input = document.getElementById("search");
    const cardBodyContent = document.getElementById("cardBodyContent");
    const products = await getProducts("/getProducts");
    generateHTML(products,cardBodyContent)
   
})

async function getProducts(url){
    try{
        const response = await axios.get(url);
        const data=response.data;
        return data.data
    }catch{
        return null;
    }
   
}

const generateHTML = (data, container) => {
    container.innerHTML = "";
    let divContainer = document.createElement("div");
    divContainer.className = "row row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 g-4";

    const content = data.map((product) => createCard(product)).join(" ");
    divContainer.innerHTML = content;

    container.append(divContainer);
};

const createCard = (product) => {
    console.log(product.image_url);
    return `
        <div class="col">
            <div class="card shadow rounded-1 h-100 bg-light-subtle">
                <div class="card-header bg-primary">
                    <h4 class="text-white text-capitalize">${product.product_name}</h4>
                </div>
                <div class="card-body">
                    <img src="${product.image_url}" class="card-img img-fluid w-100 h-100" alt="${product.product_name}">
                </div>
            </div>
        </div>
    `;
};
