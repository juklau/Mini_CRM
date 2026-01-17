//REGI KOD, ami àt lett alakitva fonctionnà:
// if(event.target.id === "file-input"){
//     const file = event.target.files[0];
//     //vérification si un fichier a été bien sélectionné, sinon
//     if(!file) return;

//     console.log("fichier sélectionné: ", file);

//     // préparation l'envoir de l'image à Cloudinary
//     const formData = new FormData();
//     formData.append("file", file); // on ajoute le photo dans "formData"
    
//     //code PID de upload preset : 12d6cf6f-19b1-4ec8-b871-1f175c50bb51
//     //on ajoute l'Upload Preset configuré sur Cloudinary, le "photos_profil"
//     formData.append("upload_preset", "photos_profil");

//     //envoie de l'image à Cloudinary
//     fetch("https://api.cloudinary.com/v1_1/dsblrrl1i/image/upload", {
//         method: "POST",
//         body: formData
//     })
//         .then(response => response.json())//la réponse est converti en json
//         .then(data => {
//             if(data.secure_url){
//                 console.log(" Image hébergée sur Cloudinary :", data.secure_url);
//                 profileImageUrl = data.secure_url;
                
//                 // Mettre à jour l’image affichée
//                 document.getElementById("profile-pic").src = data.secure_url;
//                 document.getElementById("modulo-profile-pic").src = data.secure_url;
//             }else{
//                 console.error("Erreur : L'URL de l'image n'a pas été récupérée !");
//             } 
//         })
//         .catch(error => console.error(" Erreur lors de l'upload à Cloudinary :", error));

// }



/*======================================================================================== */
/*                              du nous_contacter.js  
/* ======================================================================================== */
// az ALAP ellenorzes volt ez
// function validCheckbox(){
//     document.getElementById("egyetertes").addEventListener("change", function(){
//         if(this.checked){
//             // console.log("la case a été coché");
//             return true;
//         }else{
//             // console.log("il n'a pas été coché");
//             return false;
//         };
//     });
// };

// ******************************* Validation de L'ENVOI EMAIL ******************************************

// const inputs = document.querySelectorAll("input");

//Ecouter la soumission du formulaire
// document.getElementById("contact-form").addEventListener("submit", function(e) {
//     e.preventDefault();

//     if(validNom(form.nom) && validEmail(form.email) && validSujet(form.sujet) && validMessage(form.message) && validCheckbox()){
//         form.submit();

//         //pour vider les champs apres la validation
//         for(let i = 0; i < inputs.length; i++){
//             document.getElementsByTagName("input")[i].value = "";
//         };
//         document.getElementById("message").value = ""; 

//         //ne fonctionne pas encore
//         // document.getElementById("egyetertes").value = "";
//     }else{
//         console.log("il ne fonctionne pas");
//     }
// });


/*********************************************************************************
 *                          du modifier.js
 *********************************************************************************/

//ajouter un événement "change" pour détecter quand l'utilisateur choisit un fichier
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

/*********************************************************************************
 *                          du ajouter.js
 *********************************************************************************/
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



/*********************************************************************************
 *                  du ajouter.js => Validation en Temps Réel
 *********************************************************************************/
// document.addEventListener('DOMContentLoaded', () => {
//     const form = {
//         nom: document.getElementById("nom"),
//         prenom: document.getElementById("prenom"),
//         entreprise: document.getElementById("entreprise"),
//         email: document.getElementById("email"),
//         tel: document.getElementById("tel"),
//          typeContact: document.getElementById("type-contact"),
//         date: document.getElementById("date"),
//         statut: document.getElementById("statut"),
//         note: document.getElementById("note")
//     };

//     // Validation au blur pour chaque champ
//     if (form.nom) {
//         form.nom.addEventListener("blur", () => {
//             const value = sanitizeInput(form.nom.value.trim());
//             const errors = validateNom(value, "nom");
//             showFieldError("nom", errors);
//         });
//     }

//     if (form.prenom) {
//         form.prenom.addEventListener("blur", () => {
//             const value = sanitizeInput(form.prenom.value.trim());
//             const errors = validateNom(value, "prénom");
//             showFieldError("prenom", errors);
//         });
//     }

//     if (form.entreprise) {
//         form.entreprise.addEventListener("blur", () => {
//             const value = sanitizeInput(form.entreprise.value.trim());
//             const errors = validateEntreprise(value);
//             showFieldError("entreprise", errors);
//         });
//     }

//     if (form.email) {
//         form.email.addEventListener("blur", () => {
//             const value = form.email.value.trim();
//             const errors = validateEmail(value);
//             showFieldError("email", errors);
//         });
//     }
 
//     if (form.tel) {
//         form.tel.addEventListener("blur", () => {
//             const value = form.tel.value.trim();
//             const errors = validateTelephone(value);
//             showFieldError("tel", errors);
//         });
//     }

//     if (form.typeContact) {
//         form.typeContact.addEventListener("change", () => {
//             const value = form.typeContact.value;
//             const errors = validateTypeContact(value);
//             showFieldError("type-contact", errors);
//         });
//     }

//     if (form.date) {
//         form.date.addEventListener("change", () => {
//             const value = form.date.value;
//             const errors = validateDateRelance(value);
//             showFieldError("date", errors);
//         });
//     }

//     if (form.statut) {
//         form.statut.addEventListener("change", () => {
//             const value = form.statut.value;
//             const errors = validateStatutRelance(value);
//             showFieldError("statut", errors);
//         });
//     }

//     if (form.note) {
//         form.note.addEventListener("blur", () => {
//             const value = sanitizeInput(form.note.value.trim());
//             const errors = validateNote(value);
//             showFieldError("note", errors);
//         });
//     }
// });



/*********************************************************************************
 *                  du modifier.js => Validation en Temps Réel
 *********************************************************************************/
// function attachValidationListeners() {
//     const form = {
//         nom: document.getElementById("nom"),
//         prenom: document.getElementById("prenom"),
//         entreprise: document.getElementById("entreprise"),
//         email: document.getElementById("email"),
//         tel: document.getElementById("tel"),
//         typeContact: document.getElementById("type-contact"),
//         date: document.getElementById("date"),
//         statut: document.getElementById("statut"),
//         note: document.getElementById("note")
//     };

//     // Validation au blur pour chaque champ
//     if (form.nom) {
//         form.nom.addEventListener("blur", () => {
//             const value = sanitizeInput(form.nom.value.trim());
//             const errors = validateNom(value, "nom");
//             showFieldError("nom", errors);
//         });
//     }

//     if (form.prenom) {
//         form.prenom.addEventListener("blur", () => {
//             const value = sanitizeInput(form.prenom.value.trim());
//             const errors = validateNom(value, "prénom");
//             showFieldError("prenom", errors);
//         });
//     }

//     if (form.entreprise) {
//         form.entreprise.addEventListener("blur", () => {
//             const value = sanitizeInput(form.entreprise.value.trim());
//             const errors = validateEntreprise(value);
//             showFieldError("entreprise", errors);
//         });
//     }

//     if (form.email) {
//         form.email.addEventListener("blur", () => {
//             const value = form.email.value.trim();
//             const errors = validateEmail(value);
//             showFieldError("email", errors);
//         });
//     }

//     if (form.tel) {
//         form.tel.addEventListener("blur", () => {
//             const value = form.tel.value.trim();
//             const errors = validateTelephone(value);
//             showFieldError("tel", errors);
//         });
//     }

//     if (form.typeContact) {
//         form.typeContact.addEventListener("change", () => {
//             const value = form.typeContact.value;
//             const errors = validateTypeContact(value);
//             showFieldError("type-contact", errors);
//         });
//     }

//     if (form.date) {
//         form.date.addEventListener("change", () => {
//             const value = form.date.value;
//             const errors = validateDateRelance(value);
//             showFieldError("date", errors);
//         });
//     }

//     if (form.statut) {
//         form.statut.addEventListener("change", () => {
//             const value = form.statut.value;
//             const errors = validateStatutRelance(value);
//             showFieldError("statut", errors);
//         });
//     }

//     if (form.note) {
//         form.note.addEventListener("blur", () => {
//             const value = sanitizeInput(form.note.value.trim());
//             const errors = validateNote(value);
//             showFieldError("note", errors);
//         });
//     }
//     console.log("Validations attachées au formulaire de modification");
// };

// // appeler au chargement initial (au cas où le formulaire existe déjà)
// document.addEventListener('DOMContentLoaded', attachValidationListeners);



/*********************************************************************************
 *                          de affiche_contacts.js 
 *********************************************************************************/
//il faut l'enfant direct de ".alphabet" => sinon il affiche aucun "p" dans le "card" => ça va être vide!!!!
    // document.querySelectorAll(".alphabet > p").forEach(p => { //avant accordeon
    //     let parentDiv = p.parentElement;

    //     // console.log(`Vérification de la lettre : ${p.innerText}, Parent trouvé :`, parentDiv);
        
    //     // masquer les lettres de "balise p" sans contacts
    //     if (lettresAvecContacts.has(p.innerText)) {
    //         parentDiv.style.display = "block"; // Cache les éléments sans contact
    //     }else{
    //         parentDiv.style.display = "none";
    //     }
    // });


/*********************************************************************************
 *                          de rechercher.js 
 *********************************************************************************/
    // // pour remplacer "if"!!
    // const apiURL = (typeContact !== "Tous" &&  statutRelance !== "Tous") //vérification l'activité des filtres

    //     // "AND" => inclusion des 2 filtres
    //     ? `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}?filterByFormula=AND({Type de contact}="${typeContact}",{Statut de relance}="${statutRelance}")`
    //     : (typeContact !== "Tous")

    //         // choix: QUE le type de contact
    //         ? `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}?filterByFormula={Type de contact}="${typeContact}"`
    //     : (statutRelance !== "Tous")

    //         // choix: QUE le statut de relance
    //         ? `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}?filterByFormula={Statut de relance}="${statutRelance}"`
        
    //         // les 2 sont "Tous" => pas de filtre!!
    //     : `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}?filterByFormula=${encodedFormula}&view=Grid%20view`


// c'était pour les requêtes mail il ne faut pas!!
// myHeaders.append("Cookie", "brw=brwP5dTKIEAUqvTmM; brwConsent=opt-out; AWSALBTG=8ytnFXplo4lqx0/Mqucb/kk00RLN+bUiaOUcdSsaqN+QGQChN3BIOdma6Mvvg0ygyC8uXbIl2V9K2TLEyvoZrY8ZNCEOtxeDwIs3Pk1NeXLtvRBDPI0zGkrS79ilC0m67ndqm5bH4UTjI8WG3FV6FxQhBnW/Ptu2d9/ZUWZuB3lEdWYkAP0=; AWSALBTGCORS=8ytnFXplo4lqx0/Mqucb/kk00RLN+bUiaOUcdSsaqN+QGQChN3BIOdma6Mvvg0ygyC8uXbIl2V9K2TLEyvoZrY8ZNCEOtxeDwIs3Pk1NeXLtvRBDPI0zGkrS79ilC0m67ndqm5bH4UTjI8WG3FV6FxQhBnW/Ptu2d9/ZUWZuB3lEdWYkAP0=");
