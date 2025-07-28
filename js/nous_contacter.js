/* il faut faire encore:
    => page connexion
    => optimiser le code en utilisant DOM.js
    => mettre en secret le API code
    => proteger contre injection SQL
*/

/*======================================================================================== */
/*                           UJ   Formulaire sur la page Contact */
/* ======================================================================================== */


function validerField({inputId, regex, errorMsg, errorSelector}){
    const input = document.getElementById(inputId);
    const feedback =  errorSelector ? document.querySelector(errorSelector) : input.nextElementSibling;

    if(!regex.test(input.value)){
        feedback.innerHTML = errorMsg;
        feedback.classList.remove("text-success");
        feedback.classList.add("text-danger");
        input.classList.remove("megfelelo");
        input.classList.add("nem-megfelelo");
        return false;
    }else{
        feedback.innerHTML = " ";
        feedback.classList.remove("text-danger");
        feedback.classList.add("text-success");
        input.classList.remove("nem-megfelelo");
        input.classList.add("megfelelo");
        return true;
    }
}

const validNom = () => validerField({
    inputId: "nom",
    regex: /^[A-Z]{1}[a-zA-Z\s\-]{2,50}$/,
    errorMsg: "Veuillez saisir un nom valide commençant par une majuscule",
    errorSelector: "#small-nom"
});

const validEmail = () => validerField({
    inputId: "email",
    regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,10}$/,
    errorMsg: "Veuillez saisir une adresse email valide"
});

const validSujet = () => validerField({
    inputId: "sujet",
    regex: /^[a-zA-Z0-9'\s]{5,50}$/,
    errorMsg: "Veuillez entrer minimum 5 caractères sans caractères spéciaux"
});

const validMessage = () => validerField({
    inputId: "message",
    regex: /^[a-zA-Z0-9 ._()!:;,?%'"^\\s]{3,500}$/,
    errorMsg: "Veuillez entrer minimum 5 caractères"
});

const validCheckbox = function(){
let inputCheckBox = document.getElementById("egyetertes");
    if(inputCheckBox.checked){
        return true;
    }else{
        return false;
    }
}

const form = document.querySelector("#contact-form");
document.addEventListener("DOMContentLoaded", () => {

    form.nom.addEventListener("change", validNom);
    form.email.addEventListener("change", validEmail);
    form.sujet.addEventListener("change",validSujet);
    form.message.addEventListener("change",validMessage);
    form.egyetertes.addEventListener("change",validCheckbox);
})


form.addEventListener("submit", function(e) {
    //empêche le rechargement de page
    e.preventDefault();
    if (validNom() && validEmail() && validSujet() && validMessage() && validCheckbox()) {

        const formData = new FormData(this);

        fetch("https://formspree.io/f/xaneaygb", {
            method: "POST", 
            body: formData,
            headers: {
                'Accept' : 'application.json'
            }
        })
        .then(reponse =>{
            if(reponse.ok){
                const confirmation = document.getElementById("form-confirmation");

                confirmation.classList.remove("hidden");
                confirmation.classList.add("visible");
                
                //vider le formulaire
                form.reset();

                document.querySelectorAll(".megfelelo, .nem-megfelelo").forEach(el => {
                    el.classList.remove("megfelelo", "nem-megfelelo");
                })

            }else{
                 return reponse.json().then(data => {
                    // throw => interrompre le fonctionnement normal et "donne" le control au catch
                    throw new Error(data.error || "Erreur lors de l'envoi.");
                });
            }
        })
        .catch(error =>{
            console.error("Erreur Formspree: ", error);
            alert("Une erreur est survenu lors de l'envoi.Veuillez réessayer.")
        })

    }else {
        console.warn("Formulaire invalide !");
    }
    
});


























/*======================================================================================== */
/*                           régi darab kod*/
/* ======================================================================================== */



// az ALAP ellenorzes volt ez
// function validCheckbox(){
//     document.getElementById("egyetertes").addEventListener("change", function(){
//         if(this.checked){
//             // console.log("la case a été coché");
//             return true;
//         }else{
//             // console.log("il n'a pas été coché");
//             return false;
//         };
//     });
// };

// ******************************* Validation de L'ENVOI EMAIL ******************************************

// const inputs = document.querySelectorAll("input");

//Ecouter la soumission du formulaire
// document.getElementById("contact-form").addEventListener("submit", function(e) {
//     e.preventDefault();

//     if(validNom(form.nom) && validEmail(form.email) && validSujet(form.sujet) && validMessage(form.message) && validCheckbox()){
//         form.submit();

//         //pour vider les champs apres la validation
//         for(let i = 0; i < inputs.length; i++){
//             document.getElementsByTagName("input")[i].value = "";
//         };
//         document.getElementById("message").value = ""; 

//         //ne fonctionne pas encore
//         // document.getElementById("egyetertes").value = "";
//     }else{
//         console.log("il ne fonctionne pas");
//     }
// });


