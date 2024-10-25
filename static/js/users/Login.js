import { toastMessage,showAlert,} from "../utils.js";

document.addEventListener("DOMContentLoaded", (e) => {
  let form = document.querySelector("form");
  let inputs = document.querySelectorAll("input");
  

  inputs.forEach((input) => {
    input.addEventListener("blur", validation);
  });
  form.addEventListener("keydown", (e) =>e.key=="Enter"?e.preventDefault():null);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let invalidFields = form.querySelectorAll(".is-invalid");
    if (invalidFields.length > 0) {
      invalidFields[0].focus();
    } else {
      let inputData = {};
      inputs.forEach((input) => {
        inputData[input.id] = input.value;
      });

      try {

        let response = await axios.post("/Login",inputData);
        let data = response.data;
        toastMessage(data.status,data.message)
       
        if(data.status=="success"){

            e.target.reset()
            inputs.forEach((input) => {
            input.classList.remove("is-valid")
            if(input.id=="name") input.focus()
            setTimeout(()=>{
              window.location.href=data.url_for},2000)
          });
        }
        
        
      } catch (e) {
        console.log(e);
      }
    }
  });
});

function validation(e) {
  
  if (e.target.id == "email") {
    emailValidation(e);
   
  }

  if (e.target.id == "password") {
    passwordValidation(e);
  }
}

function emailValidation(email) {
  let message = "";

  if (!/^\w+([.-_+]?\w+)*$/.test(email.target.value)) {
    message = "El nombre de usuario del correo es inválido.";
  } else if (!/@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email.target.value)) {
    message = "El dominio del correo es inválido.";
  }
  showAlert(email.target, message);
}



function passwordValidation(password) {
  let message = "";

  if (password.target.value.length < 8) {
    message = "La contraseña debe tener al menos 8 caracteres.";
  } else if (!/[A-Z]/.test(password.target.value)) {
    message = "La contraseña debe tener al menos una letra mayúscula.";
  } else if (!/[!@#$%^&*.,;:]/.test(password.target.value)) {
    message = "La contraseña debe tener al menos un carácter especial.";
  }

  showAlert(password.target, message);
}


