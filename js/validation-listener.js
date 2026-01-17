/***********************************************************************************************
                        ÉCOUTEURS DE VALIDATION - Formulaires Dynamiques
************************************************************************************************/

/**
 * Attache les écouteurs de validation à tous les champs du formulaire
 * Cette fonction peut être appelée après l'insertion dynamique du DOM
 * 
 * @returns {void}
 */
function attachValidationListeners() {
    
    // Récupérer tous les éléments du formulaire
    const form = {
        nom: document.getElementById("nom"),
        prenom: document.getElementById("prenom"),
        entreprise: document.getElementById("entreprise"),
        email: document.getElementById("email"),
        tel: document.getElementById("tel"),
        typeContact: document.getElementById("type-contact"),
        date: document.getElementById("date"),
        statut: document.getElementById("statut"),
        note: document.getElementById("note")
    };

    // Validation du nom au blur
    if (form.nom) {
        form.nom.addEventListener("blur", function() {
            const value = sanitizeInput(this.value.trim());
            const errors = validateNom(value, "nom");
            showFieldError("nom", errors);
        });
    }

    // Validation du prénom au blur
    if (form.prenom) {
        form.prenom.addEventListener("blur", function() {
            const value = sanitizeInput(this.value.trim());
            const errors = validateNom(value, "prénom");
            showFieldError("prenom", errors);
        });
    }

    // Validation de l'entreprise au blur
    if (form.entreprise) {
        form.entreprise.addEventListener("blur", function() {
            const value = sanitizeInput(this.value.trim());
            const errors = validateEntreprise(value);
            showFieldError("entreprise", errors);
        });
    }

    // Validation de l'email au blur
    if (form.email) {
        form.email.addEventListener("blur", function() {
            const value = this.value.trim();
            const errors = validateEmail(value);
            showFieldError("email", errors);
        });
    }

    // Validation du téléphone au blur
    if (form.tel) {
        form.tel.addEventListener("blur", function() {
            const value = this.value.trim();
            const errors = validateTelephone(value);
            showFieldError("tel", errors);
        });
    }

    // Validation du type de contact au changement
    if (form.typeContact) {
        form.typeContact.addEventListener("change", function() {
            const value = this.value;
            const errors = validateTypeContact(value);
            showFieldError("type-contact", errors);
        });
    }

    // Validation de la date au changement
    if (form.date) {
        form.date.addEventListener("change", function() {
            const value = this.value;
            const errors = validateDateRelance(value);
            showFieldError("date", errors);
        });
    }

    // Validation du statut au changement
    if (form.statut) {
        form.statut.addEventListener("change", function() {
            const value = this.value;
            const errors = validateStatutRelance(value);
            showFieldError("statut", errors);
        });
    }

    // Validation de la note au blur
    if (form.note) {
        form.note.addEventListener("blur", function() {
            const value = sanitizeInput(this.value.trim());
            const errors = validateNote(value);
            showFieldError("note", errors);
        });
    }

    console.log(" Validations attachées au formulaire");
}

// Appeler automatiquement au chargement de la page (pour les formulaires statiques)
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si le formulaire existe déjà (page ajouter.html)
    if (document.getElementById("nom")) {
        attachValidationListeners();
    }
});