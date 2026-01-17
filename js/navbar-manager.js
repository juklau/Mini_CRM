/***********************************************************************************************
                        GESTION DYNAMIQUE DU MENU DE NAVIGATION
************************************************************************************************/

/**
 * Met à jour le menu de navigation selon l'état de connexion
 * Affiche Connexion/Inscription si non connecté
 * Affiche Déconnexion si connecté
 */
function updateNavigationMenu(){

    //vérifier si user est connecté
    const isLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';
    const username = sessionStorage.getItem('username');

    //récuperer les éléments du menu
    const loginNav = document.getElementById('login-nav');
    const signupNav = document.getElementById('signup-btn');
    const logoutNav = document.getElementById('logout-nav');
    const userInfoNav = document.getElementById('user-info-nav');


    //si user est connecté
    if(isLoggedIn && username){

        //masquer connexion et inscription
        if(loginNav) loginNav.style.display = 'none';
        if(signupNav) signupNav.style.display = 'none';

        //afficher déconnexion
        if(logoutNav) logoutNav.style.display = 'block';

        //afficher les infos de user
        if(userInfoNav){
            userInfoNav.style.display = 'block';
            const displayUsername = document.getElementById('display-username');
            if(displayUsername){
                displayUsername.textContent = username;
            }
        }

        console.log("Menu mise à jour : utilisateur connecté : ", username);

    }else{  //=>user pas connecté

        //afficher connexion et inscription
        if(loginNav) loginNav.style.display = 'block';
        if(signupNav) signupNav.style.display = 'block';

        //masquer déconnexion
        if(logoutNav) logoutNav.style.display = 'none';

        //masquer les infos de user
        if(userInfoNav) userInfoNav.style.display = 'none';

        console.log("Menu mise à jour : utilisateur non connecté");

    }

}

//initialiser le menu de navigation au chargement de la page
function initNavigationMenu(){

    //màj le menu
    updateNavigationMenu();

    //màj le menu si sessionStorage change => ex. connecter dans un autre onglet
    window.addEventListener('storage', function(e) {
        if (e.key === 'is_logged_in') {
            updateNavigationMenu();
        }
    });
}

//exécution au chargement du DOM
document.addEventListener('DOMContentLoaded', initNavigationMenu);

//rendre la fonction disponible globalement
window.updateNavigationMenu = updateNavigationMenu;

console.log("navbar-manager.js est chargé");