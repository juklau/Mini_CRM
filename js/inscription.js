
// configuration Airtable
const AIRTABLE_CONFIG = {

    API_KEY: CONFIG.API_KEY_NEW, 
    BASE_ID: CONFIG.BASE_ID, 
    USERS_TABLE: CONFIG.NOM_TABLE2, 
};


// hashage de mot de passe avec SHA-256
async function hashPassword(password) {

    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);

    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}


//génération du token api unique pour user
function generateApiToken() {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = 'usr_';

    for (let i = 0; i < 32; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return token;
}


//vérification si le nom user existe déjà dans la base Airtable
async function checkUsernameExists(username) {

    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.USERS_TABLE}?filterByFormula={username}='${username}'`;
        
        const response = await fetch(url, {

            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`
            }
        });
        
        const data = await response.json();
        return data.records.length > 0;
        
    } catch (error) {
        console.error('Erreur lors de la vérification du nom d\'utilisateur:', error);
        return false;
    }
}


//vérification si l'email existe déjà dans la base Airtable
async function checkEmailExists(email) {

    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.USERS_TABLE}?filterByFormula={email}='${email}'`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`
            }
        });
        
        const data = await response.json();
        return data.records.length > 0;
        
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'email:', error);
        return false;
    }
}


//validation du formulaire d'inscription
function validateForm(username, email, password, confirmPassword) {
    let isValid = true;
    
    // Réinitialiser les messages d'erreur
    document.getElementById('small-username').textContent = '';
    document.getElementById('small-email').textContent = '';
    document.getElementById('small-password').textContent = '';
    document.getElementById('small-confirm-password').textContent = '';
    
    //nettoyer les inputs
    username = sanitizeInput(username);
    email = sanitizeInput(email);
    password = sanitizeInput(password);
    confirmPassword = sanitizeInput(confirmPassword);

    // -------------------------------------------------------------

    //valider les champs avec la fonction de validation.js
    const usernameErrors = validateUsername(username);
    if(usernameErrors.length > 0){
        document.getElementById('small-username').textContent = usernameErrors[0];
        isValid = false;
    }

    const emailErrors = validateEmail(email);
    if(emailErrors.length > 0){
        document.getElementById('small-email').textContent = emailErrors[0];
        isValid = false;
    }

    const passwordErrors = validatePassword(password);
    if(passwordErrors.length > 0){
        document.getElementById('small-password').textContent = passwordErrors[0];
        document.getElementById('small-password').classList.remove('text-muted'); // ????????
        document.getElementById('small-password').classList.add('text-danger');
        isValid = false;
    }

    // Validation de la confirmation du mot de passe
    if (password !== confirmPassword) {
        document.getElementById('small-confirm-password').textContent = 'Les mots de passe ne correspondent pas';
        isValid = false;
    }
    
    return isValid;
}


// validation supplémentaire avant envoi à Airtable
function sanitizeForAirtable(username, email) {
    // Double vérification avant envoi
    username = sanitizeInput(username);
    email = sanitizeInput(email);
    
    // Vérification finale
    if (containsSQLInjection(username) || containsXSS(username)) {
        throw new Error('Nom d\'utilisateur invalide');
    }
    
    if (containsSQLInjection(email) || containsXSS(email)) {
        throw new Error('Email invalide');
    }
    
    return { username, email };
}

//affichage d'un message à l'utilisateur
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message-inscription');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    
    messageDiv.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Faire défiler jusqu'au message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


//création un nouvel user dans Airtable
async function createUser(username, email, hashedPassword, apiToken) {

    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.USERS_TABLE}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    username: username,
                    email: email,
                    password: hashedPassword,
                    api_token: apiToken,
                    created_at: new Date().toISOString()
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la création du compte');
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}


// ============================================
// FONCTION PRINCIPALE D'INSCRIPTION
// ============================================


async function handleInscription(event) {

    event.preventDefault();
    
    // récupérer les valeurs du formulaire
    let username = document.getElementById('username').value.trim();
    let email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // valider le formulaire
    if (!validateForm(username, email, password, confirmPassword)) {
        return;
    }
    
    // désactiver le bouton pendant le traitement
    const btnInscription = document.getElementById('btn-inscription');
    
    btnInscription.disabled = true;
    btnInscription.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Inscription en cours...';
    
    try {

        // nettoyage final des inputs avant envoi à Airtable
        const sanitizedData = sanitizeForAirtable(username, email);
        username = sanitizedData.username;
        email = sanitizedData.email;

        // vérifier si le nom d'utilisateur existe déjà
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
            showMessage('Ce nom d\'utilisateur est déjà utilisé', 'error');
            
            btnInscription.disabled = false;
            btnInscription.textContent = 'S\'inscrire';
            return;
        }
        
        // vérifier si l'email existe déjà
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            showMessage('Cette adresse email est déjà utilisée', 'error');
           
            btnInscription.disabled = false;
            btnInscription.textContent = 'S\'inscrire';
            return;
        }
        
        // hasher le mot de passe
        const hashedPassword = await hashPassword(password);
        
        // générer un token API unique pour cet utilisateur
        const apiToken = generateApiToken();
        
        // créer l'utilisateur dans Airtable
        await createUser(username, email, hashedPassword, apiToken);
        
        // afficher le message de succès
        showMessage('Inscription réussie ! Vous allez être redirigé vers la page de connexion...', 'success');
        
        // réinitialiser le formulaire
        document.getElementById('username').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('confirm-password').value = '';

        //réinitialiser les messages d'erreur
        document.getElementById('small-username').textContent = '';
        document.getElementById('small-email').textContent = '';
        document.getElementById('small-password').textContent = '';
        document.getElementById('small-password').classList.remove('text-danger');
        document.getElementById('small-password').classList.add('text-muted');
        document.getElementById('small-confirm-password').textContent = '';
        
        // rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
            window.location.href = 'connexion.html';
        }, 2000);
        
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        // showMessage('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.', 'error');
        
        showMessage(`Une erreur est survenue : ${escapeHTML(error.message)}`, 'error');
        btnInscription.disabled = false;
        btnInscription.textContent = 'S\'inscrire';
    }
} 


//événement au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const btnInscription = document.getElementById('btn-inscription');
    
    if (btnInscription) {
        btnInscription.addEventListener('click', handleInscription);
    }
    
    // Validation en temps réel pour la confirmation du mot de passe
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordInput = document.getElementById('password');
    
    if (confirmPasswordInput && passwordInput) {

        confirmPasswordInput.addEventListener('input', () => {

            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const smallConfirm = document.getElementById('small-confirm-password');
            
            if (confirmPassword && password !== confirmPassword) {
                smallConfirm.textContent = 'Les mots de passe ne correspondent pas';
            } else {
                smallConfirm.textContent = '';
            }
        });
    }
});