const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

 export function toastMessage(type,message){
      Toast.fire({
        icon: type,
        title: message
      });
  }


  export function addDivAlert(message) {
    let div = document.createElement("div");
    div.classList.add("has-danger");
    div.textContent = message;
    return div;
  }
  
  export function showAlert(target, message) {
    let div = addDivAlert(message);
    let existingAlert = target.parentNode.querySelector(".has-danger");
  
    if (message) {
      target.classList.add("is-invalid");
      if (!existingAlert) {
        target.parentNode.appendChild(div);
  
        setTimeout(() => {
          div.remove();
      
        }, 2000);
      }
    } else {
      target.classList.remove("is-invalid");
      target.classList.add("is-valid");
      if (existingAlert) existingAlert.remove();
    }
  }

  export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

  // let generatedOtp = Math.floor(Math.random() * 10000).toString();

  // Email.send({
  //   SecureToken: "449974c5-af29-4841-b2e2-21d0d6a92ca7",
  //   To: inputData.email,
  //   From: "Pauloandrestrada@gmail.com",
  //   Subject: "Verificación de correo electrónico",
  //   Body: `Tu código de verificación es: ${generatedOtp}`,
  // }).then( (message) => {
  //   if (message == "OK") {
  //     toastMessage("success","Correo de verificación enviado")
  //     modal.show()
      
  //   } else {
  //     console.log(generatedOtp)
  //     console.log(inputData.email)
  //     console.log(message)
  //     toastMessage("error","no se pudo enviar el correo")
  //   }
  // });