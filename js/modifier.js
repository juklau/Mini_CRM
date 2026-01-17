let contactId = null; //=> variable partagé dans tout le fichier

//configuration airtable 
const AIRTABLE_CONFIG1 = {

    API_KEY: CONFIG.API_KEY, 
    BASE_ID: CONFIG.BASE_ID, 
    CONTACTS_TABLE: CONFIG.NOM_TABLE1,
};

/***********************************************************************************************
                                    Validation en Temps Réel
************************************************************************************************/

//validation-listener.js

 /***********************************************************************************************
                                    modification du contact
************************************************************************************************/

document.addEventListener("click", function(event){
    if(event.target && event.target.classList.contains("modifier-pen")){
        
        // console.log("Bouton Modifier cliqué !");
        const confirmModal = document.getElementById("confirm-Modulo");
        // console.log("Modal trouvé :", document.getElementById("confirm-Modulo"));

        if (confirmModal) {
            confirmModal.classList.add("show");
            // confirmModal.style.display = "block";
            // console.log("Modal affiché :", confirmModal.classList.contains("show")); =>pour trouver l'erreur!
        } else {
            console.error("Le modal de confirmation n'a pas été trouvé !");
        }
    }
});

document.addEventListener("click", async function(event){
    
    if (event.target.id === "confirmYes") {
        // récuperer id du contact
        contactId = document.getElementById("editModal").dataset.contactid

        if(!contactId){
            console.log("ID de contact introuvable");
            return;
        }

        try{
            //afficher le spinner sur le btn de confirmation
            const confirmYesBtn = document.getElementById("confirmYes");
            const originalBtnText = confirmYesBtn.innerHTML;
            confirmYesBtn.disabled = true;
            confirmYesBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Ajout en cours...';

            //préparer les headers
            const myHeaders = createHeaders(true);
    
            // récupération du photo choisi par l'utilisateur
            // récuperation l'image hébergé sur Cloudinary _uj!!!
            const photoElement = document.getElementById("profile-pic");
            const photoUrl = photoElement ? photoElement.src : null;
            // const photoUrl = photoElement && !photoElement.src.startsWith("data:") ? photoElement.src : null;
            console.log("Photo envoyée à Airtable :", photoUrl ? [{ "url": photoUrl }] : " Aucune image valide");

            const contactData = getContactFormData(photoUrl);

            //préparer le body de la requête
            const raw = JSON.stringify({
                "records": [{
                    "id": `${contactId}`,
                    "fields": contactData  //récupere les champs du formulaire et renvoie un objet
                }]
            });
    
            // PUT => requête pour remplacer les anciennes données en les écrasant!!!!
            const requestOptions = {
                method: "PATCH", //requête pour modifier une partie des données!!!!
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            // console.log("Photo envoyée à Airtable :", photoUrl && !photoUrl.startsWith("data:") ? [{ "url": photoUrl }] : []);

            const response = await fetch(
                `https://api.airtable.com/v0/${AIRTABLE_CONFIG1.BASE_ID}/${AIRTABLE_CONFIG1.CONTACTS_TABLE}`,
                 requestOptions
            );

            if (!response.ok) {
                const errorData = await response.json();

                console.error("Erreur API Airtable :", errorData);
                throw new Error(`Erreur ${response.status}: ${errorData.error?.message || 'Impossible de modifier le contact'}`);
            }

            const result = await response.json();
            console.log("Contact modifié avec succès :", result);

            // restaurer le bouton
            confirmYesBtn.disabled = false;
            confirmYesBtn.innerHTML = originalBtnText;
    
            // fermer la modulo après validation
            document.getElementById("confirm-Modulo").classList.remove("show");
    
            //ouvrir le modulo de confirmation de réussite
            document.getElementById("confirmReussi-Modulo").classList.add("show");

        }catch(error){
             console.error("Erreur lors de la modification :", error);

            // restaurer le bouton
            const confirmYesBtn = document.getElementById("confirmYes");
            if (confirmYesBtn) {
                confirmYesBtn.disabled = false;
                confirmYesBtn.innerHTML = "Oui";
            }

            let errorMessage = "Une erreur est survenue lors de la modification.";

            if (error.message === "Validation failed") {
                errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
            } else if (error.message) {
                errorMessage = `Erreur : ${error.message}`;
            }

            alert(errorMessage);

            // fermer le modal
            document.getElementById("confirm-Modulo").classList.remove("show");
        }
    
        //si user refuse ou annule la modification     
    }else if(event.target.id === "confirmNo" || event.target.id === "confirm-closeModulo"){

        // il faut déclarer sinon pageCourant "is not defined"!
        const pageCourant = window.location.pathname;

        if(pageCourant.includes("index.html")){
            window.location.href = "index.html";
        }else if(pageCourant.includes("rechercher.html")){
            window.location.href = "rechercher.html";
        }
        
        //  window.location.href = "index.html";
        //  window.location.href = `modifier.html?id=${contactId}`;
    }
});

           
// gestion de retour après modif réussite
document.addEventListener("click", function(event){
    if(event.target.id === "confirmOK" || event.target.id === "confirmReussi-closeModulo"){
        
        //pour rester sur la bonne page
        const pageCourant = window.location.pathname;
        console.log("Page actuelle :", pageCourant);

        if(pageCourant.includes("index.html")){
            window.location.href = "index.html";
            
        }else if(pageCourant.includes("rechercher.html")){
            window.location.href = "rechercher.html";
        }
    } 
}); 
    
   
/***********************************************************************************************
                                 mettre en favoris le contact
************************************************************************************************/

document.addEventListener("click", function(event){
    //vérifier si élément cliqué est "star-btn" => mettre en faveur le contact
    if (event.target.classList.contains("star-button")) {
            event.target.classList.toggle("checked");
    }
});


/***********************************************************************************************
                                modifier le photo du contact
************************************************************************************************/

//ouverture la fenêtre de modification en cliquant sur la photo
document.addEventListener("click", function(event) {
    const moduloProfil = document.getElementById("profil-Modulo");
    const profilContainer = document.querySelector(".profile-container"); 

    //ouvrir le mini-modulo photo en cliquant sur la photo
    if(event.target.id === "profile-pic"){

        //vérification si j'arrive ouvrir le modulo pour changer l'image
        if(moduloProfil && profilContainer){
            moduloProfil.classList.add("show");
            profilContainer.classList.add("hidden");

            // bloquer le scroll de l'arrière-plan
            document.getElementById("editModal").classList.add("no-scroll");
        }    
    }

    //fermer le mini-modulo photo
    if(event.target.id === "close-btn-image-ajout" ){

        // ???vérification si j'arrive fermer le modulo pour changer l'image
        if(moduloProfil && profilContainer){
            moduloProfil.classList.remove("show");
            profilContainer.classList.remove("hidden");

             // réactiver le scroll
            document.getElementById("editModal").classList.remove("no-scroll");
        }  
    } 

    //supprimer la photo
    if (event.target.id === "remove-btn") {
        const defaultImage = "../image/profil_par_default.png";

        //récupération les deux images à modifier
        const profilePic = document.getElementById("profile-pic");
        const moduloProfilePic = document.getElementById("modulo-profile-pic");

        //change les deux sources de l'image
        if (profilePic) profilePic.src = defaultImage;
        if (moduloProfilePic) moduloProfilePic.src = defaultImage;
    }

    // Bouton d’upload pour ouvrir file input
    if (event.target.id === "upload-btn") {
        const fileInput = document.getElementById("file-input");
        if (fileInput){
            fileInput.click();
        }
    }
});


let profileImageUrl = "";
bindPhotoUpload((url) => profileImageUrl = url);

/***********************************************************************************************
                            supprimer le contact concerné
************************************************************************************************/

document.addEventListener("click", function(event){
    if(event.target && event.target.id === "delete"){
        document.getElementById("delete-Modulo").classList.add("show");
    }
});

//gestion de la confirmation de suppression
document.addEventListener("click", async function(event){

    if(event.target.id === "deleteYes"){

        contactId = document.getElementById("editModal").dataset.contactid //=> récupération l'id du contact

        if (!contactId) {
            console.error("ID de contact introuvable");
            return;
        }

        try {
            // Afficher le spinner sur le bouton de confirmation
            const deleteYesBtn = document.getElementById("deleteYes");
            const originalBtnText = deleteYesBtn.innerHTML;
            deleteYesBtn.disabled = true;
            deleteYesBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Suppression en cours...';

            // appel la fonction du outils.js
            const myHeaders = createHeaders();
            // myHeaders.append("Cookie", "brw=brwP5dTKIEAUqvTmM; brwConsent=opt-out; AWSALBTG=m6IoUSNJR3Fbwr+ggMzFVtD/EQSUwfvoql5olwvGpkqLtWbmxTRBKOtHKJuIs/1ngQTJcvb5VPx0bkUqJaF0v8qZ0rmJGuqPCO0FJBDm8t3lXmIik1ygwY4eS0Qi7GfU1Sa2Q9YAH7AU/PiYYpwFy+TSdoG+qLyFOLz0FdENFkDAh0cYhZ4=; AWSALBTGCORS=m6IoUSNJR3Fbwr+ggMzFVtD/EQSUwfvoql5olwvGpkqLtWbmxTRBKOtHKJuIs/1ngQTJcvb5VPx0bkUqJaF0v8qZ0rmJGuqPCO0FJBDm8t3lXmIik1ygwY4eS0Qi7GfU1Sa2Q9YAH7AU/PiYYpwFy+TSdoG+qLyFOLz0FdENFkDAh0cYhZ4=");

            const requestOptions = {
                method: "DELETE", //requête pour supprimer de la BDD !!!! =>/Table/{recordId}
                headers: myHeaders,
                redirect: "follow"
            };

            // Envoyer la requête
            const response = await fetch(
                `https://api.airtable.com/v0/${AIRTABLE_CONFIG1.BASE_ID}/${AIRTABLE_CONFIG1.CONTACTS_TABLE}/${contactId}`,
                requestOptions
            );

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: Impossible de supprimer le contact`);
            }

            const result = await response.text();
            console.log("Contact supprimé avec succès :", result);

            // Restaurer le bouton
            deleteYesBtn.disabled = false;
            deleteYesBtn.innerHTML = originalBtnText;

            // fermer la modulo après validation
            document.getElementById("delete-Modulo").classList.remove("show");
    
            //ouvrir le modulo de confirmation de la suppression
            document.getElementById("deleteReussi-Modulo").classList.add("show");
        }catch (error){

            console.log("Erreur lors de la suppression : ", error);

            //restaurer le bouton
            const deleteYesBtn = document.getElementById("deleteYes");
            if(deleteYesBtn){
                deleteYesBtn.disabled = false;
                deleteYesBtn.innerHTML = "Oui";
            }

            alert("Erreur lors de la suppression du contact. Veuillez réessayer.");

            // fermer le modal
            document.getElementById("delete-Modulo").classList.remove("show");
        }
    }
    //annulation de la suppression
    else if(event.target.id === "deleteNo" || event.target.id === "delete-closeModulo"){
            document.getElementById("delete-Modulo").classList.remove("show");
    }
});

//gestion de retour après suppression réussite
document.addEventListener("click", function(event){
    if(event.target.id === "deleteOK" || event.target.id === "deleteReussi-closeModulo"){
        window.location.href = `index.html`;
    } 
});