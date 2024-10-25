import { toastMessage,getCookie } from '../utils.js';



document.addEventListener('DOMContentLoaded', async (e) => {
    let button = document.querySelector("#logout");
    console.log(button);

    if (button) {
        button.addEventListener('click', async (e) => {
            e.preventDefault(); 
            try {
                const csrfToken = getCookie('csrf_access_token')
                console.log(csrfToken)
                let response = await axios.post("/logout", {}, {
                    headers: {
                        'X-CSRF-Token': csrfToken
                    }
                });
                let data = response.data;
                if (data) {
                    toastMessage(data.status, data.message);
                    if (data.status === "success") {
                        setTimeout(() => {
                            window.location.href = "/Login";
                        }, 1000);
                    }
                } else {
                    toastMessage("error", "No se recibió respuesta del servidor.");
                }
            } catch (error) {
                console.log(error.response ? error.response.data : error.message); 
                toastMessage("error", "Ocurrió un error al intentar cerrar sesión.");
            }
        });
    }
});

