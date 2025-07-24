

/***********************************************************************************************
                                     Page ajouter le contact
************************************************************************************************/

/*mettre en favoris le contact */
document.querySelector(".star-button").addEventListener("click", function() {
            this.classList.toggle("checked");
});


/***********************************************************************************************
                            enregistrer dans la base de donnée le contact
************************************************************************************************/

//variable global pour l'image
let profileImageUrl = "";

document.getElementById('ajouter-btn').addEventListener("click", async function () {
    document.getElementById("ajout-Modulo").classList.add("show");
});

document.addEventListener("click", function(event){
    if(event.target.id === "ajoutYes"){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", CONFIG.API_KEY);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "brw=brwP5dTKIEAUqvTmM; brwConsent=opt-out; AWSALBTG=8ytnFXplo4lqx0/Mqucb/kk00RLN+bUiaOUcdSsaqN+QGQChN3BIOdma6Mvvg0ygyC8uXbIl2V9K2TLEyvoZrY8ZNCEOtxeDwIs3Pk1NeXLtvRBDPI0zGkrS79ilC0m67ndqm5bH4UTjI8WG3FV6FxQhBnW/Ptu2d9/ZUWZuB3lEdWYkAP0=; AWSALBTGCORS=8ytnFXplo4lqx0/Mqucb/kk00RLN+bUiaOUcdSsaqN+QGQChN3BIOdma6Mvvg0ygyC8uXbIl2V9K2TLEyvoZrY8ZNCEOtxeDwIs3Pk1NeXLtvRBDPI0zGkrS79ilC0m67ndqm5bH4UTjI8WG3FV6FxQhBnW/Ptu2d9/ZUWZuB3lEdWYkAP0=");

        const raw = JSON.stringify({
        "records": [
            {
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
                "Favoris": document.getElementById("star-btn").classList.contains("checked") ? 1 : 0,
                "Photo": profileImageUrl ? [{ "url": profileImageUrl }] : [] 
            }
            }
        ]
        });

        const requestOptions = {
            method: "POST", //requête pour créer dans la BDD !!!!
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

        //pour vider les champs apres la validation
        const inputs = document.querySelectorAll("input");

        for(let i = 0; i < inputs.length; i++){
            document.getElementsByTagName("input")[i].value = "";
        };

        document.getElementById("type-contact").value = ""; 
        document.getElementById("statut").value = ""; 
        profileImageUrl = "";

        // fermer la modulo après validation
        document.getElementById("ajout-Modulo").classList.remove("show");

        //ouvrir le modulo de confirmation de l'ajout contact
        document.getElementById("confirmAjoutReussi-Modulo").classList.add("show");
        document.addEventListener("click", function(event){
            if(event.target.id === "ajoutOK" || event.target.id === "ajoutReussi-closeModulo"){
                window.location.href = `index.html`;
            } 
        });
    }else if(event.target.id === "ajoutNo" || event.target.id === "ajout-closeModulo"){
            window.location.href = `ajouter.html`;
    }
});
   
/***********************************************************************************************
                                ajouter un photo au contact
************************************************************************************************/

const moduloProfil = document.getElementById("modulo-profil");
const profilContainer = document.querySelector(".profile-container")


document.getElementById("profile-pic").addEventListener("click", function() {
    moduloProfil.classList.add("show");
    profilContainer.classList.add("hidden");
});

document.getElementById("close-btn-image-ajout").addEventListener("click", function() {
    moduloProfil.classList.remove("show");
     if(profilContainer){
         profilContainer.classList.remove("hidden");
    }
});

document.getElementById("upload-btn").addEventListener("click", function() {
    document.getElementById("file-input").click();
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
                    profileImageUrl = data.secure_url;
                    
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

// document.getElementById("file-input").addEventListener("change", function(event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             document.getElementById("profile-pic").src = e.target.result;
//             document.getElementById("modulo-profile-pic").src = e.target.result;
//         };
//     reader.readAsDataURL(file);
//     }
// });
 
/***********************************************************************************************
                            suppression d'image et rétablir image par défaut
************************************************************************************************/

document.getElementById("remove-btn").addEventListener("click", function() {
    document.getElementById("profile-pic").src = "../image/profil_par_default.png";
    document.getElementById("modulo-profile-pic").src = "../image/profil_par_default.png";
});


