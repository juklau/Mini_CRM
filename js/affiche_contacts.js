
/***********************************************************************************************
            Récuperation les contacts de la base de donnée pour afficher sur la page home
************************************************************************************************/

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
   
let contactId = null;

const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer pat1hXtYN9Gd2grIe.8f87d9609b33bc4a0b21b2e9b38d22cb777363aef96579095898b16f9516a2f9");
myHeaders.append("Cookie", "brw=brwP5dTKIEAUqvTmM; brwConsent=opt-out; AWSALBTG=ITi/fbHG7IlJgD3xaTn3MpZhQIe/9PxRn5wTkr7VbxtjkE3Vz9brZcpkLxRdw7XDE6BxfY2hph/udQSaTP8EyeZguxhdEf7CpvTcKh2yBu3VTESSjr8jp4pbaE/sNuk1sXxXyYX+IPWUXM0UMUXewoYqBm0gr6cRTBCet5zwMYvXmBGopoU=; AWSALBTGCORS=ITi/fbHG7IlJgD3xaTn3MpZhQIe/9PxRn5wTkr7VbxtjkE3Vz9brZcpkLxRdw7XDE6BxfY2hph/udQSaTP8EyeZguxhdEf7CpvTcKh2yBu3VTESSjr8jp4pbaE/sNuk1sXxXyYX+IPWUXM0UMUXewoYqBm0gr6cRTBCet5zwMYvXmBGopoU=");

const requestOptions = {
    method: "GET", //pour récuperer les données
    headers: myHeaders,
    redirect: "follow"
};

//récuperation les contacts depuis l'API Airtable
fetch("https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM?view=Grid%20view", requestOptions)
  
    .then((response) => response.json()) //convertion la réponse en JSON afin d'extraire les informations des contacts
    .then((data) => {
        const contacts = data.records;
        
        const resultatDiv = document.getElementById("resultat");

        //vérification s'il y a des contacts
        if(contacts.length === 0){
            // resultatDiv.innerHTML = "<p> Aucun contact trouvé. </p>";
            // return;
            document.getElementById("NoContactBDD-Modulo").classList.add("show");

            document.addEventListener("click", function (event){
                if(event.target.id === "NoContactBDD-closeModulo" || event.target.id === "NoContactBDD-OK" ){
                    window.location.href = "ajouter.html";
                }
            })
        }

        //trier le contact par alphabet un utilisant le fonction triABulles créé plus haut..
        const contactsTries = triABulles(contacts);

        //création une ensemble vide (SET) pour stocker les lettres de l'alphabet 
        const lettresAvecContacts = new Set();

        //afficher les contacts sous forme de cartes
        contactsTries.forEach(contact => {
            const nom = contact.fields.Nom || "Nom inconnu";

            //récuperer le premier caractère du nom
            let lettre = nom.charAt(0).toUpperCase();

            //ajouter le premier lettre récupéré du nom
            lettresAvecContacts.add(lettre);
        
            //pour trouver le div correspondant, où il faut mettre le card du contact
            let alphabetDiv = null;
            // document.querySelectorAll(".alphabet p").forEach(p => { //avant accordeon
            //     if(p.innerText === lettre){
            //         alphabetDiv = p.parentElement //pour trouver le parent(div) correspondant 
            //     }
            // });

            alphabetDiv = document.querySelector(`.accordion-body[data-lettre="${lettre}"]`);
            
            const card = document.createElement("div");
            card.classList.add("contact-card");
            card.dataset.contactId = contact.id;

            // console.log('ID : ${contact.id} ')

            //récupération le photo du contact
            const photoURL = contact.fields.Photo ? contact.fields.Photo[0].url : "../image/profil_par_default.png" 
            
            // d'abord créer les cards!!!
            card.innerHTML = `
                   <div class="bg-white border border-black rounded-2 px-2 my-3">
                    <div class="d-flex flex-column mb-3" id="nom-photo">
                        <div id="photo" class="text-center mt-3 ps-0 ">
                            <div class="d-md-flex mb-2 me-5">
                                <button class="star-button card-star-button text-start ms-4 ms-sm-5 ${contact.fields.Favoris === 1 ? 'checked' : ''}">★</button>
                            </div>
                            <img class=" border border-black rounded-circle mx-auto mb-3" src="${photoURL}" alt="Photo du contact">
                        </div>
                        <div id="nom-prenom" class="row justify-content-center"> 
                            <div class="col-12 col-sm-10 row justify-content-between">
                                <div class="infos noms col-12 col-sm-6">
                                    <h5><strong>Nom :</strong></h5>
                                    <p class="lh-lg border border-black rounded-2 mt-2 mb-4 ps-3">${contact.fields.Nom || "Nom inconnu"}</p>
                                </div>

                                <div class="infos noms col-12 col-sm-6">
                                    <h5> <strong>Prénom :</strong></h5>
                                    <p class="lh-lg border border-black rounded-2 mt-2 mb-4 ps-3">${contact.fields.Prénom || "Prénom inconnu"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12 col-sm-10 ">
                            <h5><strong>Type de contact :</strong></h5>
                            <p class="lh-lg border border-black rounded-2 mt-2 mb-4 ps-3"> ${contact.fields["Type de contact"] || "Type de contact inconnu"}</p>
                        </div>
                        <div class="col-12 col-sm-10 ">
                            <h5><strong>Statut de relance :</strong></h5>
                            <p class="lh-lg border border-black rounded-2 mt-2 mb-4 ps-3"> ${contact.fields["Statut de relance"] || "Statut de relance inconnu"}</p>
                        </div>
                    </div>
                </div>
            `;

            //Il était dans l'affichage pour utiliser pendant le développement d'appli: le id de chaque personne
            // <div">
            //     <h5><strong>Id :</strong></h5>
            //     <p> ${contact.id || "Id inconnu"}</p>
            // </div>
        
            if(alphabetDiv){ //ez kell!
                //ajouter le card sous la bonne lettre
                alphabetDiv.appendChild(card);
            }else{
                resultatDiv.appendChild(card);
            }

            //pour afficher ".alphabet" qui ont des ".contact-card" et pas les autres
            document.querySelectorAll(".accordion-item").forEach(item => {
                const alphabetDiv = item.querySelector(".alphabet");

                //pour vérifier s'il a .contact-card
                const hasContact = alphabetDiv.querySelector(".contact-card") != null;

                if(!hasContact){
                    item.style.display = "none";
                }else{
                    item.style.display = "block";
                }
            });

            
            //IL Y A UN PROBLEM EN REVENANT SUR HOME LE FAVORIS CHANGE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            /***********************************************************************************************
                        Récuperation les informations du contact selectionné
            ************************************************************************************************/          
        
            //"event.target" => élément qui a été cliqué
            if(document.getElementById("resultat")){
                // à cause de "this" de "dataset.contactID" il faut mettre "card" et pas le "document"!!!
                // document n'a pas "dataset.contactID" => il renvoie undefined!!
               
                card.addEventListener('click', function(event) {
                    // Si on ne clique pas sur un bouton ou autre, on ouvre le modal

                    const infosModifier = document.getElementById("editModal");
                    const photoURL = contact.fields.Photo ? contact.fields.Photo[0].url : "../image/profil_par_default.png";

                    //id du contact
                    contactId = contact.id;
                    infosModifier.setAttribute("data-contactid", contactId);

                    const isFavoris = contact.fields.Favoris === 1;

                    infosModifier.innerHTML = `
                        <div class="container bg-white border border-black col-10 col-md-8 col-xl-6">
                            <div class="modulo position-fixed bg-white p-2 rounded-3 text-center border border-black" id="profil-Modulo" >
                                <div class="modulo-content d-flex align-items-center justify-content-around">
                                    <div class="image-container d-flex rounded-circle ms-2 my-sm-5">
                                        <img class="image rounded-circle" src="${photoURL}" alt="Photo de profil" id="modulo-profile-pic">
                                    </div>
                                    <div class="btn-container buttons my-4 d-flex flex-column ms-5">
                                        <button class="modulo-btn btn btn-outline-secondary btn border border-2 rounded" id="upload-btn"><i class="fa-solid fa-pen"></i></button>
                                        <button class="modulo-btn btn btn-outline-secondary btn border border-2 rounded" id="remove-btn"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                                <div class="modulo-footer btn-container mb-3">
                                    <button class="modulo-btn btn btn-outline-secondary btn-lg border border-2 rounded" id="close-btn-image-ajout">Fermer</button>
                                </div>
                            </div>

                            <div class="text-end mx-3 mt-2">
                                <button class="btn btn-outline-secondary btn-sm border border-dark " id="close-section-btn">X</button>
                            </div>

                            <div class="d-flex flex-column mb-3">
                                <div class="favoris-image-profil d-flex justify-content-center align-items-start my-2 my-sm-4">
                                    <div>
                                        <button id="star-btn" class="star-button text-start modal-star-btn ${isFavoris ? 'checked' : ''}">★</button>
                                    </div>
                                    <div class="profile-container rounded-circle d-flex justify-content-center align-items-center my-2">
                                        <img class="rounded-circle" src="${photoURL}" alt="Photo de profil" id="profile-pic">
                                    </div>
                                    <div>
                                        <input type="file" id="file-input" class="hidden" accept="image/*">
                                    </div>
                                </div>
                                <div class="row justify-content-center">
                                    <div class="col-12 col-sm-10">
                                        <div class="row align-items-center mb-sm-3">
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label fw-bolder" for="nom">Nom:</label>
                                            </div>
                                            <div class="col-12 col-sm-8">
                                                <input class="form-control border-black" type="text" name="nom" id="nom" value="${contact.fields.Nom || ''}">
                                            </div>
                                        </div> 
                                    </div>
                                </div> 
                                <div class="row justify-content-center mt-2 mb-1">
                                    <div class="col-12 col-sm-10">
                                        <div class="row align-items-center mb-sm-2">
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label fw-bolder" for="prenom">Prénom:</label>
                                            </div>
                                            <div class="col-12 col-sm-8">
                                                <input class="form-control border-black" type="text" name="prenom" id="prenom" value="${contact.fields.Prénom || ''}"> 
                                            </div>
                                        </div> 
                                    </div>
                                </div> 
                                <div class="row justify-content-center mt-2 mb-1">
                                    <div class="col-12 col-sm-10">
                                        <div class="row align-items-center mb-sm-2">
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label fw-bolder" for="entreprise">Entreprise:</label>
                                            </div>
                                            <div class="col-12 col-sm-8">
                                                <input class="form-control border-black" type="text" name="entreprise" id="entreprise" value="${contact.fields.Entreprise || ''}">
                                            </div>
                                        </div> 
                                    </div>
                                </div> 
                                <div class="row justify-content-center mt-2 mb-1">
                                    <div class="col-12 col-sm-10">
                                        <div class="row align-items-center mb-sm-2">
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label fw-bolder" for="email">Email:</label>
                                            </div>
                                            <div class="col-12 col-sm-8">
                                                <input class="form-control border-black" type="email" name="email" id="email" value="${contact.fields.Email || ''}">
                                            </div>
                                        </div> 
                                    </div>
                                </div> 
                                <div class="row justify-content-center mt-2 mb-1">
                                    <div class="col-12 col-sm-10">
                                        <div class="row align-items-center mb-sm-2">
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label fw-bolder" for="tel">Telephone:</label>
                                            </div>
                                            <div class="col-12 col-sm-8">
                                                <input class="form-control border-black" type="tel" name="tel" id="tel" value="${contact.fields.Téléphone || ''}">
                                            </div>
                                        </div> 
                                    </div>
                                </div> 
                                <div class="row justify-content-center mt-2 mb-1">
                                    <div class="col-12 col-sm-10">
                                        <div class="row align-items-center mb-sm-2">
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label fw-bolder" for="type-contact">Type de contact:</label>
                                            </div>
                                            <div class="col-12 col-sm-8">
                                                <select class="form-select border-black" id="type-contact" name="type-contact">
                                                    <option value="Client" ${contact.fields["Type de contact"] === "Client" ? "selected" : ""}>Client</option>
                                                    <option value="Prospect" ${contact.fields["Type de contact"] === "Prospect" ? "selected" : ""}>Prospect</option>
                                                    <option value="Partenaire" ${contact.fields["Type de contact"] === "Partenaire" ? "selected" : ""}>Partenaire</option>
                                                </select>
                                            </div>
                                        </div> 
                                    </div>
                                </div> 
                                <div class="row justify-content-center mt-2 mb-1">
                                    <div class="col-12 col-sm-10">
                                        <div class="row align-items-center mb-sm-2">
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label fw-bolder" for="date">Date de relance:</label>
                                            </div>
                                            <div class="col-12 col-sm-8">
                                                <!-- .split('T')[0] pour extraire juste la date -->
                                                <input class="form-control border-black" type="date" name="date" id="date" value="${contact.fields['Date de relance'] ? contact.fields['Date de relance'].split('T')[0] : ''}">
                                            </div>
                                        </div> 
                                    </div>
                                </div> 
                                <div class="row justify-content-center mt-2 mb-1">
                                    <div class="col-12 col-sm-10">
                                        <div class="row align-items-center mb-sm-2">
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label fw-bolder" for="statut">Statut de relance:</label>
                                            </div>
                                            <div class="col-12 col-sm-8">
                                                <select class="form-select border-black" id="statut" name="statut">
                                                    <option value="A relancer" ${contact.fields["Statut de relance"] === "A relancer" ? "selected" : ""}>A relancer</option>
                                                    <option value="Fait" ${contact.fields["Statut de relance"] === "Fait" ? "selected" : ""}>Fait</option>
                                                </select>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                                <div class="row justify-content-center mt-2 mb-1">
                                    <div class="col-12 col-sm-10">
                                        <div class="row align-items-center mb-sm-2">
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label fw-bolder" for="note">Note:</label>
                                            </div>
                                            <div class="col-12 col-sm-8">
                                                <textarea class="form-control border-black" name="note" id="note" rows="3">${contact.fields.Note || ""}</textarea>
                                            </div>
                                        </div> 
                                    </div>
                                </div> 
                            </div>

                            <div class="icon-container details mb-3 my-md-5 d-flex justify-content-around align-items-center">  
                                <img src="https://img.icons8.com/?size=100&id=avu7fhuOMreB&format=png&color=000000" alt="pen" class="modifier-pen">
                                <img src="https://img.icons8.com/?size=100&id=67884&format=png&color=000000" alt="delete" id="delete">
                            </div>
                        </div>
                    `;

                    // afficher le conteneur
                    document.getElementById("affiche-details").classList.remove("d-none");
                    document.body.classList.add("no-scroll");

                    document.getElementById("close-section-btn").addEventListener("click", function(){
                        document.getElementById("affiche-details").classList.add("d-none");
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
                });
            }   
        });

        /***********************************************************************************************
                        afficher le premier alphabet où il y a un contact
        ************************************************************************************************/

        const alphabetBlock = document.querySelectorAll(".accordion-body.alphabet");
        for(const block of alphabetBlock){
            if (block.querySelector(".contact-card")) {
                //pour trouver l'ancêtre le plus proche
                const collapseDiv = block.closest(".accordion-collapse");

                //trouver le button just avant dans le DOM
                const button = collapseDiv.previousElementSibling.querySelector("button");

                collapseDiv.classList.add("show");

                //changer le bouton qu'il soit plus "collapsed"
                button.classList.remove("collapsed");
                button.setAttribute("aria-expanded", "true");

                //sortir au premier accordeon non-vide
                break;
            }
        };


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

    })
    .catch((error) => console.error("Erreur lors de la récupération des contacts :", error));


    //vérification si id est bien récupéré
    // const params = new URLSearchParams(window.location.search);
    // const contactId = params.get("id");

    // Vérification si l'ID est bien récupéré
    // console.log("ID du contact :", contactId); 



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