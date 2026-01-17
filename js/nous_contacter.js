
/*======================================================================================== */
/*                           UJ   Formulaire sur la page Contact */
/* ======================================================================================== */

const form = document.querySelector("#contact-form");
const submitBtn = document.querySelector("#submit-btn");

// fonction"générale" pour valider les champs
function validerField(inputId, validateFn){
    const input = document.getElementById(inputId);
    const feedback = input.nextElementSibling;
    const value = sanitizeInput(input.value);

    const errors = validateFn(value);

    if(errors.length > 0){
        feedback.innerHTML = errors[0];
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

//valider le champ nom
const validNom = () => {
    return validerField("nom", (value) => {
        if(!value || value.trim() ===''){
            return ["Le nom est obligatoire"];
        }
        return validateNom (value, "nom");
    });
 
};

//valider email
const validEmail = () => {
    return validerField("email", (value) => {
        return validateEmail(value);
    });
};

//valider sujet
const validSujet = () => {
    return validerField("sujet", (value) => {
        const errors = [];
        
        if (!value || value.trim() === '') {
            errors.push("Le sujet est obligatoire");
            return errors;
        }
        
        if (value.length < 5 || value.length > 100) {
            errors.push("Le sujet doit contenir entre 5 et 100 caractères");
        }
        
        // vérifier les caractères autorisés (lettres, chiffres, espaces, ponctuation courante)
        const sujetRegex = /^[a-zA-ZàâæçéèêëïîôùûüÿÀÂÆÇÉÈÊËÏÎÔÙÛÜ0-9\s\-'.,!?]{5,100}$/;
        if (!sujetRegex.test(value)) {
            errors.push("Le sujet contient des caractères non autorisés");
        }
        
        if (containsSQLInjection(value)) {
            errors.push("Le sujet contient des caractères invalides (SQL)");
        }
        
        if (containsXSS(value)) {
            errors.push("Le sujet contient des caractères invalides (XSS)");
        }
        
        return errors;
    });
};

//valider message
const validMessage = () => {
    return validerField("message", (value) => {
        const errors = [];
        
        if (!value || value.trim() === '') {
            errors.push("Le message est obligatoire");
            return errors;
        }
        
        if (value.length < 10 || value.length > 1000) {
            errors.push("Le message doit contenir entre 10 et 1000 caractères");
        }
        
        if (containsSQLInjection(value)) {
            errors.push("Le message contient des caractères invalides (SQL)");
        }
        
        if (containsXSS(value)) {
            errors.push("Le message contient des caractères invalides (XSS)");
        }
        
        return errors;
    });
};


//valider checkbox
const validCheckbox = function(){
    const inputCheckBox = document.getElementById("egyetertes");
    return inputCheckBox.checked;
}


//réinitialiser tous les styles de validation
function resetValidationStyles() {

    document.querySelectorAll(".megfelelo, .nem-megfelelo").forEach(element => {
        element.classList.remove("megfelelo", "nem-megfelelo");
    });

    document.querySelectorAll("small").forEach(small => {
        small.textContent = "";
        small.classList.remove("text-danger", "text-success");
    });
}

//afficher le message de confirmation
function showConfirmation(){
    const confirmation = document.getElementById("form-confirmation");
    confirmation.classList.remove("hidden");
    confirmation.classList.add("visible");

    //masquer le message après 5 secondes
    setTimeout(() => {
        confirmation.classList.remove("visible");
        confirmation.classList.add("hidden");
    }, 5000);
}

//gestion de l'état du bouton de soumission
function setSubmitBtnLoading(isLoading){
    if(isLoading){
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours...';
    }else{
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Envoyer';
    }
}

//DOMContentLoaded => attendre que le DOM soit chargé html
//window.onload => attendre que toute la page soit chargée (html, css, js, images...)

//initialisation des événements de validation
document.addEventListener("DOMContentLoaded", () => {

    //blur => validation en temps réel sur perte de focus
    form.nom.addEventListener("blur", validNom);
    form.email.addEventListener("blur", validEmail);
    form.sujet.addEventListener("blur",validSujet);
    form.message.addEventListener("blur",validMessage);

    //validation immédiate pour le checkbox
    form.egyetertes.addEventListener("change", () => {
        if(!validCheckbox){
            alert("Vous devez accepter que vos données servent uniquement à vous recontacter.");
        }
    });
});


//gestion de le soumission du formulaire
form.addEventListener("submit", async function(e) {

    //empêche le rechargement de page
    e.preventDefault();

    // Validation complète du formulaire
    const isNomValid = validNom();
    const isEmailValid = validEmail();
    const isSujetValid = validSujet();
    const isMessageValid = validMessage();
    const isCheckboxValid = validCheckbox();

    if (isNomValid && isEmailValid && isSujetValid && isMessageValid && isCheckboxValid) {

        try{
            //valider le spinner
            setSubmitBtnLoading(true);

            const formData = new FormData(this);

            const response = await fetch("https://formspree.io/f/xaneaygb", {

                method: "POST", 
                body: formData,
                headers: {
                    'Accept' : 'application.json'
                }
            });

            if(response.ok){

                //afficher la confirmation
                showConfirmation();

                //réinitialiser le formulaie
                form.reset();
                resetValidationStyles();
            }else{
                const data = await response.json();

                // throw => interrompre le fonctionnement normal et "donne" le control au catch
                throw new Error(data.error || "Erreur lors de l'envoi.");
                
            }
        } catch (error){
            console.error("Erreur Formspree: ", error);
            alert("Une erreur est survenu lors de l'envoi. Veuillez réessayer.")
        } finally {

            //désactiver le spinner
            setSubmitBtnLoading(false);
        }

    }else {
        console.warn("Formulaire invalide !");
        alert("Veuillez corriger les erreurs dans le formulaire.");
    } 
});
