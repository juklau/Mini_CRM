/***********************************************************************************************
                                FONCTIONS UTILITAIRES
************************************************************************************************/

//faire un tri à bulles (math) alphabet
function triABulles(arr){
    let taille = arr.length;
    let swapped; //boolean => s'il y a une échange entre les lettres

    do {
        swapped =  false;
        for(let i = 0; i < (taille - 1); i++){
            if (arr[i].fields.Nom.localeCompare(arr[i+1].fields.Nom) > 0) { //il faut trier que le NOM!!!!
            // comparaison ==> s'il renvoie nb negatif => arr[i] est avant arr[i+1] => pas d'échange
            //                 s'il renvoie nb positif => arr[i] est après arr[i+1] => il faut les échanger
                [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
                swapped = true; //il y a eu un échange
            }
        }
    }while (swapped); // jusqu'à il y a une échange
    return arr;
}


function createHeaders(isJson= false){
    const headers =  new Headers();
    headers.append("Authorization", CONFIG.API_KEY);
    if(isJson) {
        headers.append("Content-Type", "application/json");
    }
    return headers;
}


//afficher le premier alphabet où il y a un contact
function affichePremierAlphabetContact(alphabetBlock){

    for(const block of alphabetBlock){
        if (block.querySelector(".contact-card") || block.querySelector(".contact-card-recherche-home")) {
            //pour trouver l'ancêtre le plus proche
            const collapseDiv = block.closest(".accordion-collapse");

            //trouver le button just avant dans le DOM
            const button = collapseDiv.previousElementSibling.querySelector("button");

            collapseDiv.classList.add("show");

            //changer le bouton qu'il soit plus "collapsed" => synchronisation pour accessibilité et cohérence Bootstrap
            button.classList.remove("collapsed");
            button.setAttribute("aria-expanded", "true");

            //sortir au premier accordeon non-vide
            return; 
        };
    }
}

/***********************************************************************************************
                         Afficher les contacts sous forme de cartes
************************************************************************************************/

//génération DOM + regroupement par lettre + la fiche de contact
function afficherContacts({contacts, resultatDiv, containerSelector, infosModifier, afficheDetails}){

    //création une ensemble vide (SET) pour stocker les lettres de l'alphabet => pas de doublon
    const lettresAvecContacts = new Set();
    // attache le gestionnaire de clic seulement si le bon container est présent
    const container = document.querySelector(containerSelector);

    contacts.forEach(contact => {
        const nom = contact.fields.Nom || "Nom inconnu";

        //récuperer le premier caractère du nom
        const lettre = nom.charAt(0).toUpperCase();

        //ajouter le premier lettre récupéré du nom
        lettresAvecContacts.add(lettre);

        //pour trouver le div correspondant, où il faut mettre le card du contact
        // let alphabetDiv = null;
        // document.querySelectorAll(".alphabet p").forEach(p => { //avant accordeon
        //     if(p.innerText === lettre){
        //         alphabetDiv = p.parentElement //pour trouver le parent(div) correspondant 
        //     }
        // });

        //sélection le bon container de lettre dans l'accordéon
        const alphabetDiv = document.querySelector(`.accordion-body[data-lettre="${lettre}"]`);
        
        const card = document.createElement("div");
        card.classList.add("contact-card");
        card.dataset.contactId = contact.id;

        // console.log('ID : ${contact.id} ')

        //récupération le photo du contact
        const photoURL = contact.fields.Photo ? contact.fields.Photo[0].url : "../image/profil_par_default.png" 
        
        // d'abord créer les cards!!!
        //appeler le fonction du DOM.js
        card.innerHTML = createContactCard(contact, photoURL);

        //Il était dans l'affichage pour utiliser pendant le développement d'appli: le id de chaque personne
        // <div">
        //     <h5><strong>Id :</strong></h5>
        //     <p> ${contact.id || "Id inconnu"}</p>
        // </div>

        //placer la carte au bon endroit
        if(alphabetDiv){ //ez kell!
            //ajouter le card sous la bonne lettre
            alphabetDiv.appendChild(card);
        }else{
            resultatDiv.appendChild(card);  // => fallback, ha nincs meg a megfelelő betű
        }

        /***********************************************************************************************
                                Gestion du clic sur un contact
        ************************************************************************************************/     
       
        //"event.target" => élément qui a été cliqué
        if(container && infosModifier && afficheDetails){
            // à cause de "this" de "dataset.contactID" il faut mettre "card" et pas le "document"!!!
            // document n'a pas "dataset.contactID" => il renvoie undefined!!
            
            // Si on ne clique pas sur un bouton ou autre, on ouvre le modal
            card.addEventListener('click', function(event) {

                const isFavoris = contact.fields.Favoris === 1;

                infosModifier.setAttribute("data-contactid", contact.id);

                //appeler le fonction du DOM.js
                infosModifier.innerHTML = get_insert_dom(contact, photoURL, isFavoris);

                // Attacher les validations au formulaire dynamique
                if (typeof attachValidationListeners === 'function') {
                    attachValidationListeners();
                }
                
                // afficher le conteneur
                afficheDetails.classList.remove("d-none");
                document.body.classList.add("no-scroll");

                const closeBtn = document.getElementById("close-section-btn");
                if(closeBtn){
                    closeBtn.addEventListener("click", function(){
                        afficheDetails.classList.add("d-none");
                        // location.reload(); 
                        document.body.classList.remove("no-scroll");

                        //pour afficher si le contact est en favoris ou non
                        const starButtonCard = card.querySelector(".star-button");
                        if(contact.fields.Favoris === 1){
                            starButtonCard.classList.add("checked");
                        }else{
                            starButtonCard.classList.remove("checked");
                        }
                    })
                }
            });
        }   
    });

    //renvoie l'ensemble des lettres qui ont des contacts
    return lettresAvecContacts;
}

/***********************************************************************************************
                         Extraire les valeurs d'une formulaire
************************************************************************************************/

function getContactFormData(photoUrl){
    
    // .trim() => supprimer les espaces au début et à la fin d'une chaîne de caractère
    const nom = sanitizeInput(document.getElementById("nom").value.trim());
    const prenom = sanitizeInput(document.getElementById("prenom").value.trim());
    const entreprise= sanitizeInput(document.getElementById("entreprise").value.trim());
    const email = document.getElementById("email").value;
    const tel = document.getElementById("tel").value;
    const typeContact = document.getElementById("type-contact").value;
    const date =  document.getElementById("date").value;
    const statutRelance = document.getElementById("statut").value;
    const note = sanitizeInput(document.getElementById("note").value.trim());
    const favoris =  document.getElementById("star-btn").classList.contains("checked") ? 1 : 0;
    const imageUrl =  photoUrl ? [{ "url": photoUrl }] : []
    // "Photo" : photoUrl && !photoUrl.startsWith("data:") ? [{"url": photoUrl}] : [] //le bon format pour Airtable

    console.log("Valeurs récupérées:", {
        nom, prenom, entreprise, email, tel, typeContact, date, statutRelance, note
    });
    //-------------- validation tous les champs ---------------------------

    let hasErrors = false;

    //valider le nom
    const nomErrors = validateNom(nom, "nom");
    if(!showFieldError("nom", nomErrors)) hasErrors = true;

    //valider le prénom
    const prenomErrors = validateNom(prenom, "prénom");
    if(!showFieldError("prenom", prenomErrors)) hasErrors = true;

    //valider l'entreprise
    const entrepriseErrors = validateEntreprise(entreprise);
    if(!showFieldError("entreprise", entrepriseErrors)) hasErrors = true;

    //valider email
    const emailErrors = validateEmail(email);
    if(!showFieldError("email", emailErrors)) hasErrors = true;

    //valider tel
    const telErrors = validateTelephone(tel);
    if(!showFieldError("tel", telErrors)) hasErrors = true;

        //valider type de contact
    const typeContactErrors = validateTypeContact(typeContact);
    if (!showFieldError("type-contact", typeContactErrors)) hasErrors = true;

    //valider date de relance (optionnel)???
    const dateErrors = validateDateRelance(date);
    if (!showFieldError("date", dateErrors)) hasErrors = true;

    //valider statut de relance
    const statutErrors = validateStatutRelance(statutRelance);
    if (!showFieldError("statut", statutErrors)) hasErrors = true;

    //valider note
    const noteError = validateNote(note);
    if(!showFieldError("note", noteError)) hasErrors = true;

    //si erreurs => afficher modal et lancer une exception
    if(hasErrors){

        // console.warn(`${errorCount} champ(s) invalide(s) détecté(s)`);
        
        // Afficher la modale d'erreur
        const erreurModulo = document.getElementById("erreur-Modulo");
        if (erreurModulo) {
            erreurModulo.classList.add("show");
        }
        
        // Gérer la fermeture de la modale
        const closeErrorModal = function(event) {
            if (event.target.id === "erreurOK" || event.target.id === "erreur-closeModulo") {
                const erreurModulo = document.getElementById("erreur-Modulo");
                if (erreurModulo) {
                    erreurModulo.classList.remove("show");
                }
                // Retirer l'écouteur après utilisation
                document.removeEventListener("click", closeErrorModal);
            }
        };
        
        document.addEventListener("click", closeErrorModal);

        throw new Error("Validation failed");
    }

    return {
        "Nom" : nom,
        "Prénom" : prenom,
        "Entreprise" : entreprise,
        "Email" : email,
        "Téléphone" : tel,
        "Type de contact": typeContact,
        "Date de relance": date || null,
        "Statut de relance": statutRelance,
        "Note": note,
        "Favoris": favoris,
        "Photo" : imageUrl
    };
}

/***********************************************************************************************
                          Mettre les photos dans Cloudinary
************************************************************************************************/

// certaines opérations prennent du temps (comme fetch, lire un fichier, etc.), 
// et éviter de bloquer le reste du code pendant ce temps => async/wait
async function uploadToCloudinary(file){
    console.log("fichier sélectionné: ", file);

    // préparation l'envoir de l'image à Cloudinary
    const formData = new FormData();
    formData.append("file", file); // on ajoute le photo dans "formData"
    formData.append("upload_preset", "photos_profil");

    try{
        const response = await fetch("https://api.cloudinary.com/v1_1/dsblrrl1i/image/upload", {
            method: "POST",
            body: formData
        })

        const data = await response.json();
        if(data.secure_url){
            console.log(" Image hébergée sur Cloudinary :", data.secure_url);
            return data.secure_url;
        }else{
            console.error("Erreur : L'URL de l'image n'a pas été récupérée !");
            return null;
        }
    }catch(error){
        console.error("Erreur lors de l'upload à Cloudinary :", error);
        return null;
    }
}

//  Affichage de fênetre "active"
document.addEventListener("DOMContentLoaded", function(){
    let navLinks = document.querySelectorAll(".nav-link")
    let currentUrl = window.location.href;

    navLinks.forEach(link => { 

        if(link.href === currentUrl){
            link.classList.add("active");
        }
    });
});


/* ======================================================================================== */
/*                         Upload d'un image => modifier.js et ajouter.js
/* ======================================================================================== */

function bindPhotoUpload(setUrlCallback) {

    document.addEventListener("change", async (event) => {  //=> async pour attendre await

        if (event.target.id !== "file-input") return;

        const file = event.target.files?.[0];
        if (!file) return;

        const url = await uploadToCloudinary(file);
        if (!url) return;

        document.getElementById("profile-pic").src = url;
        document.getElementById("modulo-profile-pic").src = url;

        setUrlCallback(url);
        //dans ajouter.js => stocker dans profileImageUrl le url
        //dans modifier.js => pas besoin de stocker dans une variable globale, on récupère directement dans getContactFormData
    });
}


/***********************************************************************************************
                             Bouton pour afficher/masquer le mot de passe
************************************************************************************************/

function initTogglePassword() {
    const togglePasswordBtn = document.getElementById('toggle-password');
    const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const eyeIcon = document.getElementById('eye-icon');
    const eyeIcon2 = document.getElementById('eye-icon2');

    if (togglePasswordBtn && passwordInput && eyeIcon) {
        togglePasswordBtn.addEventListener('click', function() {
            
            if (passwordInput.type === 'password') {

                // afficher le mot de passe
                passwordInput.type = 'text';
                eyeIcon.classList.remove('bi-eye');
                eyeIcon.classList.add('bi-eye-slash');
            } else {
                // masquer le mot de passe
                passwordInput.type = 'password';
                eyeIcon.classList.remove('bi-eye-slash');
                eyeIcon.classList.add('bi-eye');
            }
        });
    }
    if(toggleConfirmPasswordBtn && confirmPasswordInput && eyeIcon2){
        toggleConfirmPasswordBtn.addEventListener('click', function() {
            
            if (confirmPasswordInput.type === 'password') {

                // afficher le mot de passe
                confirmPasswordInput.type = 'text';
                eyeIcon2.classList.remove('bi-eye');
                eyeIcon2.classList.add('bi-eye-slash');
            } else {
                // masquer le mot de passe
                confirmPasswordInput.type = 'password';
                eyeIcon2.classList.remove('bi-eye-slash');
                eyeIcon2.classList.add('bi-eye');
            }
        });
    }
}


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