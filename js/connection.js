
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


//valider le formulaire de connexion
function validateLoginForm(username, password) {

    let isValid = true;

    // Réinitialiser les messages d'erreur
    document.getElementById('small-name-user').textContent = '';
    document.getElementById('small-password').textContent = '';

    //nettoyer les inputs
    username = sanitizeInput(username);
    password = password.trim(); 

    // -------------------------------------------------------------

    //valider les champs avec la fonction de validation.js
    const usernameErrors = validateUsername(username);
    if(usernameErrors.length > 0){
        document.getElementById('small-username').textContent = usernameErrors[0];
        isValid = false;
    }

    const passwordErrors = validatePassword(password);
    if(passwordErrors.length > 0){
        document.getElementById('small-password').textContent = passwordErrors[0];
        document.getElementById('small-password').classList.remove('text-muted'); // ????????
        document.getElementById('small-password').classList.add('text-danger');
        isValid = false;
    }

    return { isValid, sanitizedUsername: username };

}


//afficher un message pour user
function showMessage(message, type = 'error'){
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';

    // créer le conteneur de message s'il n'existe pas
    let messageContainer = document.getElementById('message-connection');

    if(!messageContainer){
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-connection';

        messageContainer.className = 'mt-3';

        const container = document.querySelector('.connexion-container .row');
        container.insertBefore(messageContainer, container.firstChild);

    }

    messageContainer.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${escapeHTML(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Faire défiler jusqu'au message
    messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

}


//recherchr user dans Airtable
async function findUser(username) {

    try {
        const formula = encodeURIComponent(`{username}='${username}'`);
        const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.USERS_TABLE}?filterByFormula=${formula}`;
        
        const response = await fetch(url, {

            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`, 
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok){
            const errorData = await response.json();
            console.error('Erreur API Airtable: ', errorData);
            throw new Error('Erreur lors de la connexion à la base de données.');
        }
        
        const data = await response.json();

        if(data.records && data.records.length > 0){
            return data.records[0]; // retourner le premier enregistrement trouvé
        }

        return null; // aucun utilisateur trouvé
        
    } catch (error) {
        console.error('Erreur lors de la vérification du nom d\'utilisateur:', error);
        return false;
    }
}


//mettre à jour la dernière connexion de l'utilisateur
async function updateLastLogin(userId){

    try{
        const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.USERS_TABLE}/${userId}`;
   
        await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    last_login: new Date().toISOString()
                }
            })

        });

    }catch(error){
        console.error('Erreur lors de la mise à jour de la dernière connexion:', error);
        // ne pas bloquer la connexion de l'utilisateur en cas d'erreur
    }
}


//fonction pricipale de connexion
async function handleLogin(event){

    event.preventDefault();
    
    // récupérer les valeurs du formulaire
    const username = document.getElementById('name-user').value.trim();
    const password = document.getElementById('password').value;

    
    // valider le formulaire
    const validationResult = validateLoginForm(username, password);
    if (!validationResult.isValid) {
        return;
    }
    
    // désactiver le bouton pendant le traitement
    const btnConnexion = document.getElementById('btn-connecter');
    
    btnConnexion.disabled = true;
    btnConnexion.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Connexion en cours...';

    try {

        const user = await findUser(validationResult.sanitizedUsername);

        if(!user){
            showMessage('Nom d\'utilisateur ou mot de passe incorrect.', 'error');

            btnConnexion.disabled = false;
            btnConnexion.innerHTML = 'Se connecter';
            return;
        }

        //hacher le mot de passe saisi
        const hashedPassword = await hashPassword(password);

        //vérifier le mot de passe
        if(user.fields.password !== hashedPassword){
            showMessage('Nom d\'utilisateur ou mot de passe incorrect.', 'error');

            btnConnexion.disabled = false;
            btnConnexion.innerHTML = 'Se connecter';
            return;
        }

        //vérifier si le compte est actif => pour plus tard
        // if (user.fields.is_active === 'inactive') {
        //     showMessage('Votre compte est désactivé. Contactez l\'administrateur.', 'error');

        //     btnConnexion.disabled = false;
        //     btnConnexion.textContent = 'Se connecter';
        //     return;
        // }

        //connexion réussie => stocker les infos en session
        sessionStorage.setItem('user_id', user.id);
        sessionStorage.setItem('username', user.fields.username);
        sessionStorage.setItem('user_email', user.fields.email);
        sessionStorage.setItem('user_api_token', user.fields.api_token);
        sessionStorage.setItem('user_role', user.fields.role || 'user');
        sessionStorage.setItem('is_logged_in', 'true');
        sessionStorage.setItem('login_time', new Date().toISOString());

        //mettre à jour la dernière connexion
        await updateLastLogin(user.id);

        //afficher un message de succès
        showMessage('Connexion réussie! Redirection en cours...', 'success');

        //reinitialisation les inputs
        document.getElementById('name-user').value = '';
        document.getElementById('password').value = '';

        //rediriger vers la page d'accueil après 1 seconde
        setTimeout(() => {
            window.location.href = '/html/index.html';
        }, 1000);
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        showMessage('Une erreur est survenue lors de la connexion. Veuillez réessayer.', 'error');

        btnConnexion.disabled = false;
        btnConnexion.textContent = 'Se connecter';
    }
}


//déconnexion
function logout(){
    //vider la session
    sessionStorage.clear();

    //rediriger vers la page de connexion
    window.location.href = '/html/connexion.html';
}


//vérifier si user est connecté
function checkAuthentication(){
    const isLoggedIn = sessionStorage.getItem('is_logged_in');
    const currentPage = window.location.pathname;

    //pages publiques accessibles sans connexion
    const publicPages = [
        '/html/connexion.html',
        '/html/inscription.html',
        '/html/A_propos.html',
        '/html/nous_contacter.html',
        '/html/plan_du_site.html'
    ];

    //vérifier si la page actuelle est publique
    const isPublicPage = publicPages.includes(currentPage);

    //si pas connecté
    if(!isLoggedIn || isLoggedIn !== 'true'){

        //n'est pas connecté et n'est pas sur une page publique
        if(!isPublicPage){

            //rediriger vers la page de connexion
            window.location.href = '/html/connexion.html';
        }
    }else{
        //si déjà connecté et est la page de connexion ou inscription, rediriger vers l'accueil
        if(currentPage === '/html/connexion.html' || currentPage === '/html/inscription.html'){
            window.location.href = '/html/index.html';
        }

    }
}

//obtenir les indos  de user connecté
function getCurrentUserInfo(){
    return {
       id : sessionStorage.getItem('user_id'),
       username: sessionStorage.getItem('username'),
       email: sessionStorage.getItem('user_email'),
       api_token: sessionStorage.getItem('user_api_token'),
       role: sessionStorage.getItem('user_role'),
       login_time: sessionStorage.getItem('login_time')
    };
}

// vérifié si user est connecté
function isUserLoggedIn(){
    return sessionStorage.getItem('is_logged_in') === 'true';
}

//événements au chargement de la page
document.addEventListener('DOMContentLoaded', () =>{

        //vérifier l'authentification => rediriger si déjà connecté
        checkAuthentication();

        //évenement de soumission du formulaire de connexion
        const btnConnexion = document.getElementById('btn-connecter');

        if(btnConnexion){
            btnConnexion.addEventListener('click', handleLogin);
        }

        //permettre la soumission du formulaire avec la touche "Entrée"
        const usernameInput = document.getElementById('name-user');
        const passwordInput = document.getElementById('password');

        if(passwordInput){
            passwordInput.addEventListener('keypress', (event) => {
                if(event.key === 'Enter'){
                    handleLogin(event);
                }
            });
        }

        if(usernameInput){
            usernameInput.addEventListener('keypress', (event) => {
                if(event.key === 'Enter'){
                    handleLogin(event);
                }
            });
        }

})

//rendre les fonctions disponibles globalement
window.logout = logout;
window.checkAuthentication = checkAuthentication;
window.getCurrentUserInfo = getCurrentUserInfo;
window.isUserLoggedIn = isUserLoggedIn;
