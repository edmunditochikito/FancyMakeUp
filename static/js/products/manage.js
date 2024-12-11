import {updateDatatable,createDatatable,getCookie} from '../utils.js'
import {isValid} from './add.js'
const csrfToken = getCookie("csrf_access_token");

document.addEventListener("DOMContentLoaded",async(e)=>{

  let category = document.querySelector("#category_id");
  let response = await axios.get("getCategories");
  let data = response.data;
  data.forEach((data) => {
    let option = document.createElement("option");
    option.value = data["category_id"];
    option.text = data["category_name"];
    category.append(option);
  });


    createDatatable({
        id: "Tabla",
        ajaxUrl: {
          url: "/getProducts",
          type: "GET",
        },
        searchBuilder: true,
        buttons: true,
        columns: [
          { data: "product_name", className: "text-center" },
          { data: "description", className: "text-center",
            render:function (data, type, row, meta){
              if(type === 'display' && data.length > 40){
                return '<span class="descripcion-corta" title="Haga clic para ver más">' + data.substr(0, 40) + '...</span>';
              }
              return data;
            }
           },
          { data: "price", className: "text-center" },
          { data: "stock", className: "text-center" },
          { data: "category", className: "text-center" },
          {
            data: "status",
            className: "text-center",
          },
          {
            title: "Acciones",
            className: "text-center",
            orderable: false,
            searchable: false,
          },
        ],
        buttonsEvents: {
          targets: -1,
          data: null,
          render: function (data, type, row, meta) {
            return `<button class="btn btn-sm btn-danger remove-btn" onclick="sweetConfirmDelete(${data.id})"><i class="bi bi-ban"></i></button>
                    <button class="btn btn-sm btn-primary edit-btn" onclick="openModal(${data.id})"><i class="bi bi-pencil"></i></button>`;
          },
        },
        columnsExport: [0, 1, 2, 3, 4],
        columnsPrint: [0, 1, 2, 3, 4],
      
      });

      let form =document.querySelector("form")
      let inputs = form.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        input.addEventListener("blur", isValid);
      });
})

window.openModal=async(id)=>{
  let modalElement = document.querySelector(".modal");
  let modal = new bootstrap.Modal(modalElement);
  let form = modalElement.querySelector("form");
  let inputs = form.querySelectorAll("input, textarea, select");

  modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
  modalElement.addEventListener("hidden.bs.modal", handleModalClose);

  let response = await axios.post("/getProduct/"+id,
    { headers: {
       "X-CSRF-TOKEN":csrfToken
     }},);
   let data = response.data;
   populateModal(inputs, data);

   form.removeEventListener("submit",sweetConfirmUpdate)

   form.addEventListener("submit",(e)=>{
    e.preventDefault()
    let invalidFields = form.querySelectorAll(".is-invalid");
    let emptyFields = Array.from(inputs).filter((input) => {
      return input.value.trim() === "";
    });

    if (invalidFields.length > 0) {
      invalidFields[0].focus();
      return;
    }
    if (emptyFields.length > 0) {
      emptyFields.forEach((input) => {
        input.classList.add("is-invalid");
      });
      emptyFields[0].focus();
      return;
    }

    sweetConfirmUpdate(id)
    modal.hide();
  })
  modal.show();
}

function handleModalClose(e) {
  let invalidelements = e.target.querySelectorAll(".is-invalid");
  let validelements = e.target.querySelectorAll(".is-valid");
  invalidelements.forEach((element) => {
    element.classList.remove("is-invalid");
  });
  validelements.forEach((element) => {
    element.classList.remove("is-valid");
  });
}
function populateModal(inputs, data) {
  inputs.forEach((input) => {
    input.value=data[input.id]
  });
}
async function sweetConfirmUpdate (id) {
  Swal.fire({
    icon: "question",
    title: "¿Estas seguro de que deseas actualizar este Producto?",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Actualizar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `<h4 class="fw-bold m-0">Actualizando...</h4>`,
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          updateProduct(id);
        },
      });
    }
  });
};

async function updateProduct (id)  {

  try {
    const formData = new FormData(document.querySelector("form"));

    const response = await axios.post("/updateProduct/"+id,formData,{ headers: {
      "X-CSRF-TOKEN":csrfToken
    }},);
    const data=response.data
    console.log(data)

    if (response) {
      Swal.fire({
        position: "center",
        icon: data.status,
        title: data.title,
        text: data.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
        updateDatatable("/getProducts");
    } else {
      console.error("Error al actualizar el Producto:", data.message);
    }
  } catch (error) {
    console.error("Error al actualizar el Producto:", error);
  }
};

window.sweetConfirmDelete = async (id) => {
  Swal.fire({
    icon: "warning",
    title: "¿Estas seguro de que deseas eliminar este Producto?",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `<h4 class="fw-bold m-0">Eliminando...</h4>`,
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          deleteProduct(id);
        },
      });
    }
  });
};

async function deleteProduct(id){
  try {
    let response=await axios.post("/deleteProduct/"+id,{},{ headers: {
      "X-CSRF-TOKEN":csrfToken
    }},)
    let data=response.data

    if (response) {
      Swal.fire({
        position: "center",
        icon: data.status,
        title: data.title,
        text: data.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      updateDatatable("/getProducts");
    } else {
      console.error("Error al Eliminar el producto:", data.message);
    }
  } catch (error) {
    console.error("Error al Eliminar el Producto:", error);
  }
};