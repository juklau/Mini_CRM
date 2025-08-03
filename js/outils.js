//faire un tri à bulles (math)
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

            //changer le bouton qu'il soit plus "collapsed"
            button.classList.remove("collapsed");
            button.setAttribute("aria-expanded", "true");

            //sortir au premier accordeon non-vide
            return; 
        };
    }
}

//afficher les contacts sous forme de cartes
function afficherContacts({contacts, resultatDiv, containerSelector, infosModifier, afficheDetails}){

    //création une ensemble vide (SET) pour stocker les lettres de l'alphabet 
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
            resultatDiv.appendChild(card);
        }

        /***********************************************************************************************
                    Récuperation les informations du contact selectionné
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
    return lettresAvecContacts;
}

function isSafeInput(str){
    const unsafePattern = /[<>"=;`]/g;
    return !unsafePattern.test(str);
}

function validNom(str) {
    const nomRegex = /^[A-Z]{1}[a-zA-Z\s\-]{2,50}$/;
    return nomRegex.test(str)
};

function sanitizeInput(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function validateEmail(email) {
    //"[^\s@]+" => Une ou plusieurs lettres qui ne sont ni un espace ni un @
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\+?[0-9\s\-]{7,20}$/;
    return phoneRegex.test(phone);
}

//extraire les valeurs d'une formulaire
function getContactFormData(photoUrl){
    
    // .trim() => supprimer les espaces au début et à la fin d'une chaîne de caractère
    const nom = sanitizeInput(document.getElementById("nom").value.trim());
    const prenom =  sanitizeInput(document.getElementById("prenom").value.trim());
    const entreprise=  sanitizeInput(document.getElementById("entreprise").value.trim());
    const email = document.getElementById("email").value;
    const tel = document.getElementById("tel").value;
    const typeContact = document.getElementById("type-contact").value;
    const date =  document.getElementById("date").value;
    const statutRelance = document.getElementById("statut").value;
    const note = sanitizeInput(document.getElementById("note").value.trim());
    const favoris =  document.getElementById("star-btn").classList.contains("checked") ? 1 : 0;
    const imageUrl =  photoUrl ? [{ "url": photoUrl }] : []
    // "Photo" : photoUrl && !photoUrl.startsWith("data:") ? [{"url": photoUrl}] : [] //le bon format pour Airtable

    if(!nom || !prenom || !validNom(nom) || !validNom(prenom) || !isSafeInput(entreprise) || !isSafeInput(note) ||  !validateEmail(email) || !validatePhone(tel)) {
        // alert("Certains champs sont invalides ou contiennent des caractères interdits(<, >, \", `, =, ;).");
        // afficher le message d'erreur
        document.getElementById("erreur-Modulo").classList.add("show");
        
        document.addEventListener("click", function(event){
            if(event.target.id === "erreurOK" || event.target.id === "erreur-closeModulo"){
                document.getElementById("erreur-Modulo").classList.remove("show");

                const pageCourant = window.location.pathname;

                if(pageCourant.includes("index.html")){
                    window.location.href = "index.html";
                }else if(pageCourant.includes("ajouter.html")){
                    window.location.href = "ajouter.html";
                }
            } 
        });
        throw new Error("Invalid input");
    }

    return {
        "Nom" : nom,
        "Prénom" : prenom,
        "Entreprise" : entreprise,
        "Email" : email,
        "Téléphone" : tel,
        "Type de contact": typeContact,
        "Date de relance": date,
        "Statut de relance": statutRelance,
        "Note": note,
        "Favoris": favoris,
        "Photo" : imageUrl
    };
}




//extraire les valeurs d'une formulaire
// function getContactFormData(photoUrl){ majd kitorolni ha jo
//     return{
//         "Nom": document.getElementById("nom").value,
//         "Prénom": document.getElementById("prenom").value,
//         "Entreprise": document.getElementById("entreprise").value,
//         "Email": document.getElementById("email").value,
//         "Téléphone": document.getElementById("tel").value,
//         "Type de contact": document.getElementById("type-contact").value,
//         "Date de relance": document.getElementById("date").value,
//         "Statut de relance": document.getElementById("statut").value,
//         "Note": document.getElementById("note").value,
//         "Favoris": document.getElementById("star-btn").classList.contains("checked") ? 1 : 0 ,
//         "Photo" : photoUrl ? [{ "url": photoUrl }] : []
//         // "Photo" : photoUrl && !photoUrl.startsWith("data:") ? [{"url": photoUrl}] : [] //le bon format pour Airtable
//     }
// }

//mettre les photos dans Cloudinary
// certaines opérations prennent du temps (comme fetch, lire un fichier, etc.), 
// et éviter de bloquer le reste du code pendant ce temps
async function uploadToCloudinary(file){
    console.log("fichier sélectionné: ", file);

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
        console.error(" Erreur lors de l'upload à Cloudinary :", error);
        return null;
    }
}





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