import { toastMessage,showAlert} from "../utils.js";

document.addEventListener("DOMContentLoaded", (e) => {
  let form = document.querySelector("form");
  let inputs = document.querySelectorAll("input");
 

  inputs.forEach((input) => {
    input.addEventListener("blur", validation);
  });

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
        console.log(data)
        toastMessage(data.status,data.message)
       
        if(data.status=="success"){
           e.target.reset()
           sessionStorage.setItem("token",data.tokens.access)
           axios.get("/test",{
            headers:{'Authorization': `Bearer ${sessionStorage.getItem("token")}`}
           }).then((data)=>{
               window.location.href="/test"
           })
           inputs.forEach((input) => {
            input.classList.remove("is-valid")
            if(input.id=="username") input.focus()
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

