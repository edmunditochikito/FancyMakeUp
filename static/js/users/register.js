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

        let response = await axios.post("/Register",inputData);
        let data = response.data;
        
        toastMessage(data.status,data.message)
       
        if(data.status=="success"){
           e.target.reset()
           inputs.forEach((input) => {
            input.classList.remove("is-valid")
            if(input.id=="username") input.focus()
          });
          setTimeout(() => {
            window.location.href = "/Login";
          }, 2000);
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

  if (e.target.id == "phone") {
    phoneValidation(e);
  }

  if (e.target.id == "username") {
    nameValidation(e);
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

function phoneValidation(number) {
  let message = "";
  if (!/^[0-9\s-]+$/.test(number.target.value)) {
    message = "El teléfono solo puede contener números, espacios o guiones.";
  } else if (
    number.target.value.length < 8 ||
    number.target.value.length > 14
  ) {
    message = "El número debe tener entre 8 y 14 dígitos.";
  }
  showAlert(number.target, message);
}

function nameValidation(name) {
  let message = "";
  if (!/^[a-zA-Z\s]+$/.test(name.target.value)) {
    message = "El nombre solo puede contener letras y espacios.";
  } else if (name.target.value.length < 3) {
    message = "El nombre debe tener al menos 3 caracteres.";
  }
  showAlert(name.target, message);
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


