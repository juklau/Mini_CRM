/***********************************************************************************************
                        FONCTIONS DE VALIDATION RÉUTILISABLES
************************************************************************************************/

// nettoyage des inputs pour éviter les injections XSS et SQL
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    // supprimer les espaces au début et à la fin
    input = input.trim();
    
    // Supprimer les balises HTML/XML
    //<....> balise remplacé par  ''
    // [^>]* : correspond à n'importe quel caractère sauf '>' (zéro ou plusieurs fois)
    input = input.replace(/<[^>]*>/g, '');
    
    // Supprimer les caractères de contrôle dangereux
    // \x00-\x1F : caractères de contrôle ASCII de 0 à 31
    // \x7F : caractère de contrôle DEL
    // ex: "Hello\nWorld" → "HelloWorld" ou "ABC\u0000DEF" → "ABCDEF" ...
    input = input.replace(/[\x00-\x1F\x7F]/g, '');
    
    return input;
}


//détection d'injection SQL
function containsSQLInjection(input) {
    if (typeof input !== 'string') return false;
    
    // Patterns SQL dangereux
    // \b : délimiteur de mot
    // i : insensible à la casse
    // \s+ espaces obligatoires après OR/AND
    // \d+ un ou plusieurs chiffres
    // \s* espaces optionnels autour de =
    const sqlPatterns = [
        /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
        /(\bUNION\b.*\bSELECT\b)/i,
        /(\bOR\b\s+\d+\s*=\s*\d+)/i,
        /(\bAND\b\s+\d+\s*=\s*\d+)/i,
        /(--|\#|\/\*|\*\/)/,       //pour les commentaires SQL
        /(\bEXEC\b|\bEXECUTE\b)/i,
        /(\';|\"\;)/,           // fin de requête SQL
        /(\bxp_|\bsp_)/i,
        /(\bSLEEP\b|\bBENCHMARK\b)/i        // attaques par temporisation
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
}


//détection d'injection XSS 
function containsXSS(input) {
    if (typeof input !== 'string') return false;
    
    // Patterns XSS dangereux
    const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
        /<object[^>]*>.*?<\/object>/gi,
        /<embed[^>]*>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi, // onclick, onload, onerror, etc.
        /<img[^>]*onerror/gi,
        /vbscript:/gi,
        /data:text\/html/gi,
        /<svg[^>]*onload/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
}

// échappement HTML pour l'affichage sécurisé
function escapeHTML(input) {
    if (typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

//validation nom/prénom
function validateNom(nom, fieldName = "nom"){

    const errors = [];

     // vérifier la longueur
    if (nom.length < 2 || nom.length > 50) {
          errors.push(`Le ${fieldName} doit contenir entre 2 et 50 caractères`);
    }

    //vérifier que username contient seulement des caractères autorisés
    // const usernameRegex = /^[A-ZÀÂÆÇÉÈÊËÏÎÔÙÛÜ][a-zA-Zàâæçéèêëïîôùûüÿ\s\-]{1,49}$/;
    const nomRegex = /^[a-zA-ZàâæçéèêëïîôùûüÿÀÂÆÇÉÈÊËÏÎÔÙÛÜ\s\-]{1,49}$/;
    if(!nomRegex.test(nom)){
        errors.push(`Le ${fieldName} ne peut contenir que des lettres, espaces, tirets et apostrophes`);
    }

    // détecter les tentatives d'injectionSQL dans username
    if (containsSQLInjection(nom)) {
        errors.push(`Le ${fieldName} contient des caractères invalides (SQL)`);
    }

    //détecter les tentatives d'injection XSS dans username
    if (containsXSS(nom)) {
        errors.push(`Le ${fieldName} contient des caractères invalides (XSS)`);
    }

    return errors;
}

//validation de l'entreprise
function validateEntreprise(entreprise) {
    const errors = [];
    
    if (!entreprise || entreprise.trim() === '') {
        return errors; // Champ optionnel
    }
    
    // vérifier la longueur
    if (entreprise.length > 100) {
        errors.push("Le nom de l'entreprise ne peut pas dépasser 100 caractères");
    }
    
    // vérifier les caractères autorisés (lettres, chiffres, espaces, quelques symboles)
    const entrepriseRegex = /^[A-ZÀÂÆÇÉÈÊËÏÎÔÙÛÜa-zàâæçéèêëïîôùûüÿ0-9\s\-'&.()]+$/;
    if (!entrepriseRegex.test(entreprise)) {
        errors.push("Le nom de l'entreprise contient des caractères non autorisés");
    }
    
    // vérifier les injections
    if (containsSQLInjection(entreprise)) {
        errors.push("Le nom de l'entreprise contient des caractères invalides (SQL)");
    }
    
    if (containsXSS(entreprise)) {
        errors.push("Le nom de l'entreprise contient des caractères invalides (XSS)");
    }
    
    return errors;
}

//validation email
function validateEmail(email) {
    const errors = [];
    
    if (!email || email.trim() === '') {
        errors.push("L'email est obligatoire");
        return errors;
    }
    
    // vérifier la longueur
    if (email.length > 254) {
        errors.push("L'email est trop long");
    }
    
    // vérifier le format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,10}$/;
    if (!emailRegex.test(email)) {
        errors.push("Format d'email invalide");
    }
    
    // vérifier les injections
    if (containsSQLInjection(email)) {
        errors.push("L'email contient des caractères invalides (SQL)");
    }
    
    if (containsXSS(email)) {
        errors.push("L'email contient des caractères invalides (XSS)");
    }
    
    return errors;
}

//vérifier téléphone
function validateTelephone(tel) {
    const errors = [];
    
    if (!tel || tel.trim() === '') {
        errors.push("Le téléphone est obligatoire");
        return errors;
    }
    
    // nettoyer le numéro (enlever espaces et tirets pour la validation)
    const cleanTel = tel.replace(/[\s\-]/g, '');
    
    // vérifier la longueur (7 à 15 chiffres)
    if (cleanTel.length < 7 || cleanTel.length > 15) {
        errors.push("Le numéro de téléphone doit contenir entre 7 et 15 chiffres");
    }
    
    // vérifier le format (peut commencer par + et contenir des chiffres, espaces, tirets)
    const telRegex = /^\+?[0-9\s\-]{7,20}$/;
    if (!telRegex.test(tel)) {
        errors.push("Format de téléphone invalide");
    }
    
    return errors;
}

//vérifier la note
function validateNote(note) {
    const errors = [];
    
    if (!note || note.trim() === '') {
        return errors; // Champ optionnel
    }
    
    // vérifier la longueur
    if (note.length > 500) {
        errors.push("La note ne peut pas dépasser 500 caractères");
    }
    
    // vérifier les injections
    if (containsSQLInjection(note)) {
        errors.push("La note contient des caractères invalides (SQL)");
    }
    
    if (containsXSS(note)) {
        errors.push("La note contient des caractères invalides (XSS)");
    }
    
    return errors;
}

//validation le username
function validateUsername(username) {
    const errors = [];
    
    // vérifier la longueur
    if (username.length < 3 || username.length > 50) {
        errors.push("Le nom d'utilisateur doit contenir entre 3 et 50 caractères");
    }
    
    // vérifier le format
    const usernameRegex = /^[a-zA-ZàâæçéèêëïîôùûüÿÀÂÆÇÉÈÊËÏÎÔÙÛÜ\s\-]{3,50}$/;
    if (!usernameRegex.test(username)) {
        errors.push("Le nom d'utilisateur ne peut contenir que des lettres, espaces et tirets");
    }
    
    // vérifier les injections
    if (containsSQLInjection(username)) {
        errors.push("Le nom d'utilisateur contient des caractères invalides (SQL)");
    }
    
    if (containsXSS(username)) {
        errors.push("Le nom d'utilisateur contient des caractères invalides (XSS)");
    }
    
    return errors;
}


//validation le mdp
function validatePassword(password) {
    const errors = [];
    
    // vérifier la longueur
    if (password.length < 8 || password.length > 100) {
        errors.push("Le mot de passe doit contenir entre 8 et 100 caractères");
    }
    
    // vérifier la force (au moins une majuscule, une minuscule, un chiffre)
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordStrengthRegex.test(password)) {
        errors.push("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre");
    }
    
    return errors;
}

//validation du type de contact (select)
function validateTypeContact(typeContact) {
    const errors = [];
    
    if (!typeContact || typeContact === '' || typeContact === '-----') {
        errors.push("Veuillez sélectionner un type de contact");
        return errors;
    }
    
    // vérifier que c'est une valeur valide
    const validTypes = ['Client', 'Prospect', 'Partenaire'];
    if (!validTypes.includes(typeContact)) {
        errors.push("Type de contact invalide");
    }
    
    return errors;
}


//validation de la date de relance
function validateDateRelance(date) {
    const errors = [];
    
    if (!date || date.trim() === '') {
        return errors; // Champ optionnel ??????
    }
    
    // érifier le format de la date (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        errors.push("Format de date invalide");
        return errors;
    }
    
    // vérifier que la date est valide
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        errors.push("Date invalide");
        return errors;
    }
    
    // vérifier que la date n'est pas dans le passé => plus tard
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // if (dateObj < today) {
    //     errors.push("La date de relance ne peut pas être dans le passé");
    // }
    
    return errors;
}


//validation du statut de relance (select)
function validateStatutRelance(statut) {
    const errors = [];
    
    if (!statut || statut === '' || statut === '-----') {
        errors.push("Veuillez sélectionner un statut de relance");
        return errors;
    }
    
    // Vérifier que c'est une valeur valide
    const validStatuts = ['A relancer', 'Fait'];
    if (!validStatuts.includes(statut)) {
        errors.push("Statut de relance invalide");
    }
    
    return errors;
}

//afficher les erreurs dans un champ
function showFieldError(fieldId, errors){
    const smallElement = document.getElementById(`small-${fieldId}`);

    if(!smallElement) return;

    if(errors.length > 0){
        smallElement.textContent = errors[0];
        smallElement.classList.add("text-danger");
        smallElement.classList.remove("text-muted");
        return false;
    }else{
        smallElement.textContent = '';
        return true;
    }
}

//réinitialiser les erreurs
function clearAllErrors() {
    const smallElements = document.querySelectorAll('small[id^="small-"]');
    smallElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('text-danger');
    });
}
