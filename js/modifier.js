
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

document.addEventListener("click", function(event){
    if(event.target.id === "confirmYes"){
        // lehet hogy nem igy kell irnom a contactid...
        const contactId = document.getElementById("editModal").dataset.contactid

        if(!contactId){
            console.log("ID de contact introuvable");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", CONFIG.API_KEY);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "brw=brwP5dTKIEAUqvTmM; AWSALBTG=ITi/fbHG7IlJgD3xaTn3MpZhQIe/9PxRn5wTkr7VbxtjkE3Vz9brZcpkLxRdw7XDE6BxfY2hph/udQSaTP8EyeZguxhdEf7CpvTcKh2yBu3VTESSjr8jp4pbaE/sNuk1sXxXyYX+IPWUXM0UMUXewoYqBm0gr6cRTBCet5zwMYvXmBGopoU=; AWSALBTGCORS=ITi/fbHG7IlJgD3xaTn3MpZhQIe/9PxRn5wTkr7VbxtjkE3Vz9brZcpkLxRdw7XDE6BxfY2hph/udQSaTP8EyeZguxhdEf7CpvTcKh2yBu3VTESSjr8jp4pbaE/sNuk1sXxXyYX+IPWUXM0UMUXewoYqBm0gr6cRTBCet5zwMYvXmBGopoU=");

        //récupération du photo choisi par l'utilisateur
        // récuperation l'image hébergé sur Cloudinary _uj!!!
        const photoElement = document.getElementById("profile-pic");
        const photoUrl = photoElement ? photoElement.src : null;
        // const photoUrl = photoElement && !photoElement.src.startsWith("data:") ? photoElement.src : null;
        console.log("Photo envoyée à Airtable :", photoUrl ? [{ "url": photoUrl }] : " Aucune image valide");

        const raw = JSON.stringify({
        "records": [
            {
            "id": `${contactId}`,
            "fields": {
                "Nom": document.getElementById("nom").value,
                "Prénom": document.getElementById("prenom").value,
                "Entreprise": document.getElementById("entreprise").value,
                "Email": document.getElementById("email").value,
                "Téléphone": document.getElementById("tel").value,
                "Type de contact": document.getElementById("type-contact").value,
                "Date de relance": document.getElementById("date").value,
                "Statut de relance": document.getElementById("statut").value,
                "Note": document.getElementById("note").value,
                "Favoris": document.getElementById("star-btn").classList.contains("checked") ? 1 : 0 ,
                "Photo" : photoUrl ? [{ "url": photoUrl }] : []
                // "Photo" : photoUrl && !photoUrl.startsWith("data:") ? [{"url": photoUrl}] : [] //le bon format pour Airtable
                 }
            }
        ]
        });

        // PUT => requête pour remplacer les anciennes données en les écrasant!!!!
        const requestOptions = {
            method: "PATCH", //requête pour modifier une partie des données!!!!
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        // console.log("Photo envoyée à Airtable :", photoUrl && !photoUrl.startsWith("data:") ? [{ "url": photoUrl }] : []);

        fetch("https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM", requestOptions)
            .then((response) => response.json())
            .then((result) => console.log(result))
            .catch((error) => console.error("Erreur lors de la mise à jour: ",error));

         // fermer la modulo après validation
        document.getElementById("confirm-Modulo").classList.remove("show");

         //ouvrir le modulo de confirmation de la modification
        document.getElementById("confirmReussi-Modulo").classList.add("show");

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
    }else if(event.target.id === "confirmNo" || event.target.id === "confirm-closeModulo"){

        //pour rester sur la bonne page
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
            }    
        }

        //fermer le mini-modulo photo
        if(event.target.id === "close-btn-image-ajout" ){
            //vérification si j'arrive ouvrir le modulo pour changer l'image
            if(moduloProfil && profilContainer){
                moduloProfil.classList.remove("show");
                profilContainer.classList.remove("hidden");
            }  
        } 

        //cliquer sur le bouton de suppression
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

    //ajouter un événement "change" pour détecter quand l'utilisateur choisit un fichier
    document.addEventListener("change", function(event) {
        if(event.target.id === "file-input"){
            const file = event.target.files[0];
            //vérification si un fichier a été bien sélectionné, sinon
            if(!file) return;

             console.log("fichier sélectionné: ", file);

            // préparation l'envoir de l'image à Cloudinary
            const formData = new FormData();
            formData.append("file", file); // on ajoute le photo dans "formData"
            
            //code PID de upload preset : 12d6cf6f-19b1-4ec8-b871-1f175c50bb51
            //on ajoute l'Upload Preset configuré sur Cloudinary, le "photos_profil"
            formData.append("upload_preset", "photos_profil");

            //envoie de l'image à Cloudinary
            fetch("https://api.cloudinary.com/v1_1/dsblrrl1i/image/upload", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())//la réponse est converti en json
            .then(data => {
                if(data.secure_url){
                    console.log(" Image hébergée sur Cloudinary :", data.secure_url);
                    // Mettre à jour l’image affichée
                    document.getElementById("profile-pic").src = data.secure_url;
                    document.getElementById("modulo-profile-pic").src = data.secure_url;
                }else{
                    console.error("Erreur : L'URL de l'image n'a pas été récupérée !");
                } 
            })
            .catch(error => console.error(" Erreur lors de l'upload à Cloudinary :", error));

        }
    });
   

/***********************************************************************************************
                            supprimer le contact concerné
************************************************************************************************/

document.addEventListener("click", function(event){
    if(event.target && event.target.id === "delete"){
        document.getElementById("delete-Modulo").classList.add("show");
    }
});

document.addEventListener("click", function(event){
    if(event.target.id === "deleteYes" && contactId){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", CONFIG.API_KEY);
        myHeaders.append("Cookie", "brw=brwP5dTKIEAUqvTmM; brwConsent=opt-out; AWSALBTG=m6IoUSNJR3Fbwr+ggMzFVtD/EQSUwfvoql5olwvGpkqLtWbmxTRBKOtHKJuIs/1ngQTJcvb5VPx0bkUqJaF0v8qZ0rmJGuqPCO0FJBDm8t3lXmIik1ygwY4eS0Qi7GfU1Sa2Q9YAH7AU/PiYYpwFy+TSdoG+qLyFOLz0FdENFkDAh0cYhZ4=; AWSALBTGCORS=m6IoUSNJR3Fbwr+ggMzFVtD/EQSUwfvoql5olwvGpkqLtWbmxTRBKOtHKJuIs/1ngQTJcvb5VPx0bkUqJaF0v8qZ0rmJGuqPCO0FJBDm8t3lXmIik1ygwY4eS0Qi7GfU1Sa2Q9YAH7AU/PiYYpwFy+TSdoG+qLyFOLz0FdENFkDAh0cYhZ4=");

        const requestOptions = {
            method: "DELETE", //requête pour supprimer de la BDD !!!!
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM/${contactId}`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error("Erreur lors de la suppression: ", error));

        // fermer la modulo après validation
        document.getElementById("delete-Modulo").classList.remove("show");

        //ouvrir le modulo de confirmation de la suppression
        document.getElementById("deleteReussi-Modulo").classList.add("show");
        

    }else if(event.target.id === "deleteNo" || event.target.id === "delete-closeModulo"){
            document.getElementById("delete-Modulo").classList.remove("show");
    }
});

document.addEventListener("click", function(event){
    if(event.target.id === "deleteOK" || event.target.id === "deleteReussi-closeModulo"){
        window.location.href = `index.html`;
    } 
});