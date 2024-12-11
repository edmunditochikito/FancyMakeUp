import { showAlert, toastMessage, getCookie } from "../utils.js";
const csrfToken = getCookie("csrf_access_token");

function CargarDom(){

  document.addEventListener("DOMContentLoaded",async(e)=>{
      let inputs=document.querySelectorAll("input,textarea");
      let form=document.querySelector("form");
      
      inputs.forEach(input=>{
          input.addEventListener("blur",isValid)
      })
      form.addEventListener("submit",async(e)=>{
          e.preventDefault();
          let invalidFields=document.querySelectorAll(".is-invalid");
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
            let inputData={};
            inputs.forEach(input=>{
              inputData[input.id]=input.value
            })
            try{
                let response= await axios.post("/addCategory",inputData,{headers:{"X-CSRF-TOKEN":csrfToken}});
                let data=response.data;
                toastMessage(data.status, data.message);
  
                if (data.status == "success") {
                  e.target.reset();
                  inputs.forEach((input) => {
                    input.classList.remove("is-valid");
                    if (input.id == "name") input.focus();
                  });
                }
    
            }catch(e){
              console.log(e)
            }
  
      })
      
  })
}

export function isValid(e){
    if (e.target.id == "category_name") {
        let message = "";
        if (
          !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;!?'"-]{1,50}$/.test(e.target.value.trim())
        ) {
          message = "Formato no valido";
        } else if (e.target.value.length < 3) {
          message = "El nombre debe tener al menos 3 caracteres o maximo 50";
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
if(window.location.href=="http://127.0.0.1:3000/addCategory"){
  CargarDom()
}