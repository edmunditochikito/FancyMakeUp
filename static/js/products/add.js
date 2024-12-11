import { showAlert, toastMessage, getCookie } from "../utils.js";
const csrfToken = getCookie("csrf_access_token");

function loadAddProductDocument(){
  document.addEventListener("DOMContentLoaded", async (e) => {
    let category = document.querySelector("#category_id");
    let response = await axios.get("getCategories");
    let data = response.data;
    data.forEach((data) => {
      let option = document.createElement("option");
      option.value = data["category_id"];
      option.text = data["category_name"];
      category.append(option);
    });
  
    let form = document.querySelector("form");
    let inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", isValid);
    });
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
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
          showAlert(input, "Este campo es obligatorio.");
        });
        emptyFields[0].focus();
        return;
      }
      let formData = new FormData(form);
  
      let response = await axios.post("/addProduct", formData, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      });
      let data = response.data;
      toastMessage(data.status, data.message);
      if (data.status == "success") {
        e.target.reset();
        inputs.forEach((input) => {
          input.classList.remove("is-valid");
          if (input.id == "product_name") input.focus();
        });
      }
    });
  });
}

export function isValid(e) {
  if (e.target.id == "product_name") {
    let message = "";
    if (
      !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;!?'"-]{1,100}$/.test(e.target.value.trim())
    ) {
      message = "Formato no valido";
    } else if (e.target.value.length < 3) {
      message = "El nombre debe tener al menos 3 caracteres o maximo 100";
    }
    showAlert(e.target, message);
  }

  if (e.target.id == "price") {
    let message = "";
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(e.target.value)) {
      message = "precio no valido";
    } else if (e.target.value <= 0) {
      message = "el precio no puede ser igual o menor que 0";
    }
    showAlert(e.target, message);
  }

  if (e.target.id == "stock") {
    let message = "";
    if (!/^\d{1,3}$/.test(e.target.value)) {
      message = "cantidad no valida";
    } else if (e.target.value <= 0) {
      message = "la cantidad no puede ser igual o menor que 0";
    }
    showAlert(e.target, message);
  }
  if (e.target.id == "image_url") {
    let message = "";
    if (e.target.value.trim() == "") {
      message = "Debe seleccionar una imagen";
    }
    showAlert(e.target, message);
  }
  if (e.target.id == "description") {
    let message = "";
    if (
      !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;!?'"-]{1,250}$/.test(e.target.value.trim())
    ) {
      message = "Descripcion no valida";
    }
    showAlert(e.target, message);
  }
}

if(window.location.href=="http://127.0.0.1:3000/addProduct"){
  loadAddProductDocument()
}