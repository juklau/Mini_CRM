/***********************************************************************************************
                                     Page ajouter le contact
************************************************************************************************/

//configuration airtable 
const AIRTABLE_CONFIG1 = {

    API_KEY: CONFIG.API_KEY, 
    BASE_ID: CONFIG.BASE_ID, 
    CONTACTS_TABLE: CONFIG.NOM_TABLE1,
};


//vérification de l'authentification au chargement
document.addEventListener('DOMContentLoaded', () => {

    //vérif si user est connecté
    if(!isUserLoggedIn()){
        // alert("Vous devez être connecté pour ajouter un contact");
        window.location.href = '/html/connexion.html';
    }
});


//mettre en favoris le contact 
document.querySelector(".star-button").addEventListener("click", function() {
        this.classList.toggle("checked");
});


/***********************************************************************************************
                                    Validation en Temps Réel
************************************************************************************************/

//validation-listener.js

/***********************************************************************************************
                            enregistrer dans la base de donnée le contact
************************************************************************************************/

//variable global pour l'image
let profileImageUrl = "";  //stockage de l'URL Cloudinary de la photo de profil

document.getElementById('ajouter-btn').addEventListener("click", async function () {
    this.disabled = true; // désactiver pendant la requête
    document.getElementById("ajout-Modulo").classList.add("show");
});


//gestion de la confirmation d'ajout
document.addEventListener("click", async function(event){

    if(event.target.id === "ajoutYes"){ 
        const ajouterBtn = document.getElementById('ajouter-btn');

        try{
            //vérifié si user est connecté
            if(!isUserLoggedIn()){
                alert("Vous devez être connecté pour ajouter un contact");
                window.location.href = '/html/connexion.html';
                return;
            }

            //récuperer les infos de user connecté
            const currentUser = getCurrentUserInfo();
            const userId = currentUser.id;

            if(!userId){
                alert("Erreur : impossible de récupérer vos informations. Veuillez vous reconnecter.");
                window.location.href = '/html/connexion.html';
                return;
            }

            console.log('Utilisateur connecté : ', currentUser.username, 'Id : ', userId);

            // Afficher le spinner sur le bouton de confirmation
            const confirmYesBtn = document.getElementById("ajoutYes");
            const originalBtnText = confirmYesBtn.innerHTML;
            confirmYesBtn.disabled = true;
            confirmYesBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Ajout en cours...';

            // const myHeaders = new Headers(); =>regi kod
            // myHeaders.append("Authorization", CONFIG.API_KEY);
            // myHeaders.append("Content-Type", "application/json");
         
            // préparer les headers => appel la fonction du outils.js 
            const myHeaders = createHeaders(true);

            //récupeer les données du formulaire
            const contactData = getContactFormData(profileImageUrl); //=>outils.js

            //ajouter Id de user au contact
            contactData.user_id = [userId]; //=> il faut qu'il soit un tableau pour Airtable
            

            //ajouter le nom de user 
            contactData.created_by = currentUser.username;

            //ajouter la date de création du contact
            contactData.created_at = new Date().toISOString(); 

            console.log("Données du contact à envoyer : ", contactData);

            //préparer le body de la requête
            const raw = JSON.stringify({
                "records": [{
                    "fields": contactData
                }]
            }); 
    
            const requestOptions = { 
                method: "POST", //requête pour créer dans la BDD !!!!
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            //envoi de la requête
            const response = await  fetch(
                `https://api.airtable.com/v0/${AIRTABLE_CONFIG1.BASE_ID}/${AIRTABLE_CONFIG1.CONTACTS_TABLE}`, 
                requestOptions
            );

            if(!response.ok){
                const errorData = await response.json();
                console.error("Erreur API Airtable : ", errorData);
                throw new Error(`Erreur ${response.status}: ${errorData.error?.message || 'Impossible de créer le contact'}`);
            }

            const result = await response.json();
            console.log("Contact ajouté avec succès : ", result);

            // restaurer le bouton
            confirmYesBtn.disabled = false;
            confirmYesBtn.innerHTML = originalBtnText;

            // fermer la modulo après validation
            document.getElementById("ajout-Modulo").classList.remove("show");

            //ouvrir le modulo de confirmation de l'ajout contact
            document.getElementById("confirmAjoutReussi-Modulo").classList.add("show");

            //réinitialiser le formulaire
            resetFormulaire();

        }catch(error){

            console.error("Erreur lors de l'ajout du contact : ", error);

            // restaurer le bouton de confirmation ???????????
            const confirmYesBtn = document.getElementById("ajoutYes");
            if (confirmYesBtn) {
                confirmYesBtn.disabled = false;
                confirmYesBtn.innerHTML = "Oui";
            }

             let errorMessage = "Une erreur est survenue lors de l'ajout du contact.";
            
            // Analyser le type d'erreur pour donner un message plus précis
            if (error.message === "Validation failed") {
                errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
            }else if (error.message.includes("INVALID_VALUE_FOR_COLUMN")) {
                errorMessage = "Erreur : certains champs contiennent des valeurs invalides. Vérifiez vos données.";
            } else if (error.message.includes("UNKNOWN_FIELD_NAME")) {
                errorMessage = "Erreur : un champ du formulaire n'existe pas dans la base de données.";
            } else if (error.message.includes("AUTHENTICATION_REQUIRED")) {
                errorMessage = "Erreur d'authentification. Veuillez vous reconnecter.";
            } else if (error.message) {
                errorMessage = `Erreur : ${error.message}`;
            }

            alert(errorMessage);
            console.log("Détails de l'erreur:", error);

            //réactiver le bouton en cas d'échec
            if(ajouterBtn){
                ajouterBtn.disabled = false;
            }

            //fermer le modulo
            document.getElementById("ajout-Modulo").classList.remove("show");

        }
    }else if(event.target.id === "ajoutNo" || event.target.id === "ajout-closeModulo"){ //=>annulation de l'ajout

        //fermer le modulo et réactiver le bouton
        document.getElementById("ajout-Modulo").classList.remove("show");

        const ajouterBtn = document.getElementById('ajouter-btn');
        if(ajouterBtn){
            ajouterBtn.disabled = false;
        }

        // window.location.href = `ajouter.html`; ????????
    }
});


//fonction pour réinitialiser le formulaire
function resetFormulaire(){

    console.log("Réinitialisation du formulaire...");

    //pour vider les champs apres la validation, et remettre les selects à vide
    const inputs = document.querySelectorAll("input");

    for(let i = 0; i < inputs.length; i++){
        document.getElementsByTagName("input")[i].value = "";
    };

    //réinitialiser les selects
    const typeContact = document.getElementById("type-contact"); 
    const statut = document.getElementById("statut"); 

    if(typeContact) typeContact.value = "";
    if(statut) statut.value = "";

    //réinitialiser l'image de profil
    profileImageUrl = "";
    const profilePic = document.getElementById("profile-pic");
    const moduloProfilePic = document.getElementById("modulo-profile-pic");

    if(profilePic){
        profilePic.src = "../image/profil_par_default.png";
    }

    if(moduloProfilePic){
        moduloProfilePic.src = "../image/profil_par_default.png";
    }

    //réinitialiser l'étoile favoris
    const starButton = document.querySelector(".star-button");
    if (starButton) {
        starButton.classList.remove("checked");
    }

    console.log("Formulaire réinitialisé.")
}


//gestion du modulo de succès
document.addEventListener("click", function(event){
    if(event.target.id === "ajoutOK" || event.target.id === "ajoutReussi-closeModulo"){
        window.location.href = `/html/index.html`;
    } 
});
 
 
/***********************************************************************************************
                                ajouter un photo au contact
************************************************************************************************/

const moduloProfil = document.getElementById("modulo-profil");
const profilContainer = document.querySelector(".profile-container")

//ouvrir le modal photo
const profilePicBtn = document.getElementById("profile-pic");
if(profilePicBtn){

    profilePicBtn.addEventListener("click", function() {
        if(moduloProfil) moduloProfil.classList.add("show");
        if(profilContainer) profilContainer.classList.add("hidden");

        // bloquer le scroll de l'arrière-plan
        document.body.classList.add("no-scroll");
    });

}

//fermer le modal de photo
const closeImageBtn = document.getElementById("close-btn-image-ajout");
if(closeImageBtn){
    closeImageBtn.addEventListener("click", function() {
        if(moduloProfil) moduloProfil.classList.remove("show");
        if(profilContainer) profilContainer.classList.remove("hidden");

        // réactiver le scroll
        document.body.classList.remove("no-scroll");
    });
}

//btn upload
const uploadBtn = document.getElementById("upload-btn");
if(uploadBtn){
    uploadBtn.addEventListener("click", function() {
        const fileInput = document.getElementById("file-input");
        if(fileInput) fileInput.click(); 
    });
}

// Utiliser la fonction bindPhotoUpload du fichier outils.js
bindPhotoUpload((url) => {
    profileImageUrl = url;
    console.log("Photo de profil mise à jour avec l'URL : ", profileImageUrl);

});

// bindPhotoUpload((url) => profileImageUrl = url); =>régi

/***********************************************************************************************
                            suppression d'image et rétablir image par défaut
************************************************************************************************/

const removeBtn = document.getElementById("remove-btn");
if(removeBtn){
    removeBtn.addEventListener("click", function() {

        profileImageUrl = "";

        const profilePic = document.getElementById("profile-pic");
        const moduloProfilePic = document.getElementById("modulo-profile-pic");
        
        if (profilePic) {
            profilePic.src = "../image/profil_par_default.png";
        }
        if (moduloProfilePic) {
            moduloProfilePic.src = "../image/profil_par_default.png";
        }
        
        console.log('Photo de profil réinitialisée');
    });
}
