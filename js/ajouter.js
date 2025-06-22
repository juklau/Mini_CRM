
//Permet d’afficher les données associées aux entrées, de créer, de modifier, et de supprimer des entrées
//valable pour les commentaires
//pathX7COIE1TYne0x.0cee33b9ad08081919487fbe16031bc1d72ebc9aa25071cb1f23bf35bbd17de1

//permission à tous
//pateckMuhqr9A9Cri.f842ef507a13bac9cbf184f1d25c45d289c68f35c492c1b631dd2cbc4be7e637

//nouvelle code qu'on utilise
// Permet d’afficher les données associées aux entrées, de créer, de modifier, et de supprimer des entrées
//pat1hXtYN9Gd2grIe.8f87d9609b33bc4a0b21b2e9b38d22cb777363aef96579095898b16f9516a2f9


//const apiKey = "patjxPR2pwtPBoHMG.38b16d78de19bb3b9eed90217c4a1da0fde70587fcbcceee03945e8b9e7e2c5a";


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
//const apiKey = "pat1hXtYN9Gd2grIe.8f87d9609b33bc4a0b21b2e9b38d22cb777363aef96579095898b16f9516a2f9";

//variable global pour l'image
let profileImageUrl = "";

document.getElementById('ajouter-btn').addEventListener("click", async function () {
    document.getElementById("ajout-Modulo").classList.add("show");
});

document.addEventListener("click", function(event){
    if(event.target.id === "ajoutYes"){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer pat1hXtYN9Gd2grIe.8f87d9609b33bc4a0b21b2e9b38d22cb777363aef96579095898b16f9516a2f9");
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
                window.location.href = `home.html`;
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













/* ======================================================================================== */
/*                          Activation du bouton "scroll top"*/
/* ======================================================================================== */

window.addEventListener("scroll", function(){
    let scrollTopBtn = document.getElementById("scroll-top");

    if(window.scrollY > 200){
        scrollTopBtn.classList.add("active");
    }else{
        scrollTopBtn.classList.remove("active");
    }
})




































//aide au cas ou!!
// document.addEventListener("DOMContentLoaded", function () {
//     const apiKey = "pathX7COIE1TYne0x.0cee33b9ad08081919487fbe16031bc1d72ebc9aa25071cb1f23bf35bbd17de1";
//     const baseId = "app0YvWUy1t2JUWEd"; 
//     const tableName = "Contacts"; 

    // fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
    //     headers: {
    //         "Authorization": `Bearer ${apiKey}`
    //     }
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error(`Erreur HTTP ${response.status}`);
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log("Contacts récupérés :", data.records);

    //     // Ajouter les contacts à la page HTML (exemple)
    //     const contactsContainer = document.createElement("div");
    //     contactsContainer.innerHTML = "<h2>Liste des Contacts :</h2>";
    //     data.records.forEach(record => {
    //         const contactItem = document.createElement("p");
    //         contactItem.textContent = `Nom : ${record.fields.Nom}, Email : ${record.fields.Email}`;
    //         contactsContainer.appendChild(contactItem);
    //     });
    //     document.body.appendChild(contactsContainer);
    // })
    // .catch(error => console.error("Erreur lors de la récupération des données :", error));
//});


// fetch("https://api.airtable.com/v0/appXXXX/Contacts", {
// headers: {
// "Authorization": "Bearer patjxPR2pwtPBoHMG.38b16d78de19bb3b9eed90217c4a1da0fde70587fcbcceee03945e8b9e7e2c5a"
// }
// })
// .then(r => r.json())
// .then(data => console.log(data.records));

// console.log(window.Airtable); // Vérifie si Airtable est bien chargé


// document.addEventListener("DOMContentLoaded", function(){
//     if (window.Airtable) {
//         var base = new window.Airtable({apiKey: 'YOUR_SECRET_API_TOKEN'}).base('app0YvWUy1t2JUWEd');
//         console.log("Airtable chargé et base initialisée :", base);
//     } else {
//         console.error("Erreur : Airtable n'est pas défini !");
//     }
// });




// document.addEventListener("DOMContentLoaded", function(){
//         var base = new Airtable({apiKey: 'YOUR_SECRET_API_TOKEN'}).base('app0YvWUy1t2JUWEd');
//         console.log("Airtable chargé :", base);
// });

// var base = new Airtable({apiKey: "patjxPR2pwtPBoHMG.38b16d78de19bb3b9eed90217c4a1da0fde70587fcbcceee03945e8b9e7e2c5a"}).base('app0YvWUy1t2JUWEd');

// document.getElementById('ajouter-btn').addEventListener("click", async function () {
// //création un object contactData en récupérant les valeurs de la formulaire
//     const contactData = {
//         "Nom": document.getElementById("nom").value,
//         "Prénom": document.getElementById("prenom").value,
//         "Entreprise": document.getElementById("entreprise").value,
//         "Email": document.getElementById("email").value,
//         "Téléphone": document.getElementById("tel").value,
//         "Type de contact": document.getElementById("type-contact").value,
//         "Date de relance": document.getElementById("date").value,
//         "Statut de relance": document.getElementById("statut").value,
//         "Note": document.getElementById("note").value
//     };

//     //ajouter un nouvel enregistrement
//     base('Mini CRM').create([contactData], function(err, records) {
//     if (err) {
//         console.error("Erreur est survenu lors de l'ajoute de contact", err);
//         alert("il y une erreur ...")
//         return;
//     }
//     records.forEach(function (record) {
//         console.log( "Contact ajouté avec succés !  ID:",record.getId());
//         alert("Contact ajouté avec succès");
//     });
//     });

// });









