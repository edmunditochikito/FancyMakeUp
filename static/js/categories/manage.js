import {updateDatatable,createDatatable,getCookie} from '../utils.js'
import {isValid} from './add.js'
const csrfToken = getCookie("csrf_access_token");

document.addEventListener("DOMContentLoaded",async(e)=>{

    createDatatable({
        id: "Tabla",
        ajaxUrl: {
          url: "/dtCategories",
          type: "GET",
        },
        searchBuilder: true,
        buttons: true,
        columns: [
          { data: "category_name", className: "text-center" },
          { data: "description", className: "text-center",
            render:function (data, type, row, meta){
              if(type === 'display' && data.length > 40){
                return '<span class="descripcion-corta" title="Haga clic para ver más">' + data.substr(0, 40) + '...</span>';
              }
              return data;
            }
           },
          {
            title: "Acciones",
            className: "text-center",
            orderable: false,
            searchable: false,
            data:null
          },
        ],
        buttonsEvents: {
          targets: -1,
          data: null,
          render: function (data, type, row, meta) {
            return `<button class="btn btn-sm btn-danger remove-btn" onclick="sweetConfirmDelete(${data.category_id})"><i class="bi bi-ban"></i></button>
                    <button class="btn btn-sm btn-primary edit-btn" onclick="openModal(${data.category_id})"><i class="bi bi-pencil"></i></button>`;
          },
        },
        columnsExport: [0, 1],
        columnsPrint: [0, 1],
      
      });

      let form =document.querySelector("form")
      let inputs = form.querySelectorAll("input, textarea");
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
  
    let response = await axios.post("/getCategory/"+id,{},
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
      title: "¿Estas seguro de que deseas actualizar esta Categoria?",
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
            updateCategory(id);
          },
        });
      }
    });
  };

  async function updateCategory (id)  {

    try {
      const formData = new FormData(document.querySelector("form"));
  
      const response = await axios.post("/updateCategory/"+id,formData,{ headers: {
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
          updateDatatable("/dtCategories");
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
      title: "¿Estas seguro de que deseas eliminar esta categoria?",
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
            deleteCategory(id);
          },
        });
      }
    });
  };
  
  async function deleteCategory(id){
    try {
      let response=await axios.post("/delteCategory/"+id,{},{ headers: {
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
        updateDatatable("/dtCategories");
      } else {
        console.error("Error al Eliminar la categoria:", data.message);
      }
    } catch (error) {
      console.error("Error al Eliminar la categoria:", error);
    }
  };