/* il faut faire encore:
    => page connexion
    => optimiser le code en utilisant DOM.js
    => mettre en secret le API code
    => proteger contre injection SQL
*/


/*======================================================================================== */
/*                              Formulaire sur la page Contact */
/* ======================================================================================== */

const form = document.querySelector("#contact-form");
document.addEventListener("DOMContentLoaded", (event) => {

    // const form = document.querySelector("#contact-form");

    //écouter la modification actuel du nom
    form.nom.addEventListener("change", function(){
        validNom(this);
    });

    //écouter la modification actuel de l'email
    form.email.addEventListener("change", function(){
        validEmail(this);
    });

    //écouter la modification actuel du sujet
    form.sujet.addEventListener("change", function(){
        validSujet(this);
    });

    //écouter la modification actuel du message
    form.message.addEventListener("change", function(){
        validMessage(this);
    });

    form.egyetertes.addEventListener("change", function(){
        validCheckbox(this);
    })
})

// ************************Validation NOM******************************************************
const validNom = function(){

    let inputNom = document.querySelector("#nom");
    //Creation de la reg exp pour la validation nom
    let nomRegExp = new RegExp('^[A-Z]{1}[a-zA-Z\\s\\-]{2,50}$', "g");
   
    //récuperation de la balise SMALL
    let smallNom = document.getElementById("small-nom");
    
    //test de l'expression reguliere
    if(!nomRegExp.test(inputNom.value)){
        smallNom.innerHTML = "Veuillez saisir un nom valide commençant par une lettre majuscule";
        smallNom.classList.remove("text-success");
        smallNom.classList.add("text-danger");
        inputNom.classList.remove("megfelelo");
        inputNom.classList.add("nem-megfelelo");
        return false;
    }else{
        smallNom.innerHTML = " ";
        smallNom.classList.remove("text-danger");
        smallNom.classList.add("text-success"); 
        inputNom.classList.remove("nem-megfelelo");
        inputNom.classList.add("megfelelo");
        return true
    }
};

// ************************Validation EMAIL******************************************************
const validEmail = function(){
    
    let inputEmail = document.querySelector("#email");
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', "g");
    let spanEmail = inputEmail.nextElementSibling;
    
    if(emailRegExp.test(inputEmail.value)){
        spanEmail.innerHTML = " ";
        spanEmail.classList.remove("text-danger");
        spanEmail.classList.add("text-success");
        inputEmail.classList.remove("nem-megfelelo");
        inputEmail.classList.add("megfelelo");
        return true
    }else{
        spanEmail.innerHTML = "Veuillez saisir une adresse email valide.";
        spanEmail.classList.remove("text-success");
        spanEmail.classList.add("text-danger");
        inputEmail.classList.remove("megfelelo");
        inputEmail.classList.add("nem-megfelelo");
        return false;
    }
};

// ************************Validation SUJET******************************************************
const validSujet = function(){
   
    let inputSujet = document.querySelector("#sujet");
    let sujetRegExp = new RegExp('^[a-zA-Z0-9\'\\s]{5,50}$', "g");
    let spanSujet = inputSujet.nextElementSibling;
    
    if(!sujetRegExp.test(inputSujet.value)){
        spanSujet.innerHTML = "Veuillez entrer minimum 5 caractères sans les caractères spéciaux";
        spanSujet.classList.remove("text-success");
        spanSujet.classList.add("text-danger");
        inputSujet.classList.remove("megfelelo");
        inputSujet.classList.add("nem-megfelelo");
        return false;
    }else{
        spanSujet.innerHTML = " ";
        spanSujet.classList.remove("text-danger");
        spanSujet.classList.add("text-success");
        inputSujet.classList.remove("nem-megfelelo");
        inputSujet.classList.add("megfelelo");
        return true;
    }
};

// ************************Validation MESSAGE******************************************************
const validMessage = function(){
    
    let inputMessage = document.querySelector("#message");
    let messageRegExp = new RegExp('^[a-zA-Z0-9.-_()!:;,?%\'\"\^\\s]{2,500}$', "g");
    let smallMessage = inputMessage.nextElementSibling;
    
    if(inputMessage.value.length < 3){
        smallMessage.innerHTML = "Veuillez entrer minimum 5 caractères sans les caractères spéciaux";
        smallMessage.classList.remove("text-success");
        smallMessage.classList.add("text-danger");
        inputMessage.classList.remove("megfelelo");
        inputMessage.classList.add("nem-megfelelo")
        return false;
    }else if(!messageRegExp.test(inputMessage.value)){
        smallMessage.innerHTML = "Votre texte n'est pas conform avec un text normal. Veuillez enlever les caractères spéciaux";
        smallMessage.classList.remove("text-success");
        smallMessage.classList.add("text-danger");
        inputMessage.classList.remove("megfelelo");
        inputMessage.classList.add("nem-megfelelo")
        return false;
    }else{
        smallMessage.innerHTML = " ";
        smallMessage.classList.remove("text-danger");
        smallMessage.classList.add("text-success");
        inputMessage.classList.remove("nem-megfelelo");
        inputMessage.classList.add("megfelelo"); 
        return true;
    };
};

// ************************************ Validation CHECKBOX *******************************************

 const validCheckbox = function(){
    let inputCheckBox = document.getElementById("egyetertes");
        if(inputCheckBox.checked){
            return true;
        }else{
            return false;
        }
 }

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

const inputs = document.querySelectorAll("input");

//Ecouter la soumission du formulaire
document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

    if(validNom(form.nom) && validEmail(form.email) && validSujet(form.sujet) && validMessage(form.message) && validCheckbox()){
        form.submit();

        //pour vider les champs apres la validation
        for(let i = 0; i < inputs.length; i++){
            document.getElementsByTagName("input")[i].value = "";
        };
        document.getElementById("message").value = ""; 

        //ne fonctionne pas encore
        // document.getElementById("egyetertes").value = "";
    }else{
        console.log("il ne fonctionne pas");
    }
});


/* ======================================================================================== */
/*                          Activation du bouton "scroll top"*/
/* ======================================================================================== */

window.addEventListener("scroll", function(){
    let scrollTopBtn = document.getElementById("scroll-top");

    if(window.scrollY > 200){
        scrollTopBtn.classList.add("active");
    }else{
        scrollTopBtn.classList.remove("active");
    }
})