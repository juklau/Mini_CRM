/***********************************************************************************************
                                     Page ajouter le contact
************************************************************************************************/

//mettre en favoris le contact 
document.querySelector(".star-button").addEventListener("click", function() {
            this.classList.toggle("checked");
});

/***********************************************************************************************
                            enregistrer dans la base de donnée le contact
************************************************************************************************/

//variable global pour l'image
let profileImageUrl = "";  //stockage de l'URL Cloudinary de la photo de profil

document.getElementById('ajouter-btn').addEventListener("click", async function () {
    this.disabled = true; // désactiver pendant la requête
    document.getElementById("ajout-Modulo").classList.add("show");
});

document.addEventListener("click", function(event){
    if(event.target.id === "ajoutYes"){ 
        // const myHeaders = new Headers(); =>regi kod
        // myHeaders.append("Authorization", CONFIG.API_KEY);
        // myHeaders.append("Content-Type", "application/json");

        // appel la fonction du outils.js
        const myHeaders = createHeaders(true);
        myHeaders.append("Cookie", "brw=brwP5dTKIEAUqvTmM; brwConsent=opt-out; AWSALBTG=8ytnFXplo4lqx0/Mqucb/kk00RLN+bUiaOUcdSsaqN+QGQChN3BIOdma6Mvvg0ygyC8uXbIl2V9K2TLEyvoZrY8ZNCEOtxeDwIs3Pk1NeXLtvRBDPI0zGkrS79ilC0m67ndqm5bH4UTjI8WG3FV6FxQhBnW/Ptu2d9/ZUWZuB3lEdWYkAP0=; AWSALBTGCORS=8ytnFXplo4lqx0/Mqucb/kk00RLN+bUiaOUcdSsaqN+QGQChN3BIOdma6Mvvg0ygyC8uXbIl2V9K2TLEyvoZrY8ZNCEOtxeDwIs3Pk1NeXLtvRBDPI0zGkrS79ilC0m67ndqm5bH4UTjI8WG3FV6FxQhBnW/Ptu2d9/ZUWZuB3lEdWYkAP0=");

        const raw = JSON.stringify({
        "records": [{"fields": getContactFormData(profileImageUrl)}]}); //=>outils.js

        const requestOptions = { 
            method: "POST", //requête pour créer dans la BDD !!!!
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => { 
                console.error(error)
                alert("Erreur lors de l'ajout. Vérifiez les données");
                document.getElementById("ajout-Modulo").disabled =  false //réactiver le bouton en cas d'échec
            });

        //pour vider les champs apres la validation, et remettre les selects à vide
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

//ajouter un événement "change" pour détecter quand l'utilisateur choisit un fichier => régi kod =>outils.js ben van most
// document.addEventListener("change", async function(event) {
//     if(event.target.id === "file-input"){
//         const file = event.target.files[0];
//         //vérification si un fichier a été bien sélectionné, sinon
//         if(!file) return;

//         const uploadeUrl = await uploadToCloudinary(file)
       
//         if(uploadeUrl){
//             profileImageUrl = uploadeUrl;

//             // Mettre à jour l’image affichée
//             document.getElementById("profile-pic").src = uploadeUrl;
//             document.getElementById("modulo-profile-pic").src = uploadeUrl;
//         }
//     }
// });


bindPhotoUpload((url) => profileImageUrl = url);

/***********************************************************************************************
                            suppression d'image et rétablir image par défaut
************************************************************************************************/

document.getElementById("remove-btn").addEventListener("click", function() {
    document.getElementById("profile-pic").src = "../image/profil_par_default.png";
    document.getElementById("modulo-profile-pic").src = "../image/profil_par_default.png";
});