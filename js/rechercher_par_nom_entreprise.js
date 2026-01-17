/***********************************************************************************************
            Recherche par nom ou entreprise - Avec filtre utilisateur
************************************************************************************************/

// Variables globales pour stocker les infos utilisateur => il faut!!
let currentUsername = null;
let currentUserId = null;

//vérification de l'authentification au chargement
document.addEventListener('DOMContentLoaded', () => {

    //vérif si user est connecté
    if(!isUserLoggedIn()){
        // alert("Vous devez être connecté pour ajouter un contact");
        window.location.href = '/html/connexion.html';
        return;
    }

    //récuperer les infos de user connecté
    const currentUser = getCurrentUserInfo();
    currentUserId = currentUser.id;
    currentUsername = currentUser.username;

    if(!currentUserId || !currentUsername){
        alert("Erreur : impossible de récupérer vos informations. Veuillez vous reconnecter.");
        window.location.href = '/html/connexion.html';
        return;
    }

    console.log('Utilisateur connecté : ', currentUsername, 'Id : ', currentUserId);

});

/***********************************************************************************************
                    Recherche en temps réel par nom ou entreprise
************************************************************************************************/

document.querySelector("#recherche").addEventListener("input", async function () {

    const searchTerme = document.getElementById("recherche").value.trim();
    const resultatDiv = document.getElementById("resultat");
    const accordionBlocks = document.querySelectorAll(".accordion-body.alphabet");
    const infosModifier = document.getElementById("editModal");
    const afficheDetails = document.getElementById("affiche-details");

    //si user efface la recherche => réafficher tout et sortir
    if (searchTerme === "") {

        // // Réaffiche tout si recherche vide => avec ça en revenant que les accordions qui s'affichent!!
        // accordionBlocks.forEach(block => {
        //     block.closest(".accordion-item").style.display = "block";
        // });
        await loadUserContacts(currentUserId, currentUsername);
        return; 
    }

    try {

        // préparer les headers => appel la fonction du outils.js 
        const myHeaders = createHeaders(true);

        //préparer le body de la requête
        const requestOptions = {
            method: "GET", //pour récuperer les données
            headers: myHeaders, 
            // body: raw, ==> les requêtes de GET n'ont pas body!!!
            redirect: "follow"
        };

        // filtre par user_id et nom du contact OU entreprise
        let filterFormula;

        const userFilter = `FIND("${currentUsername}", {user_id})`;  //filtrage selon AIRTABLE!!!

        // pour éviter les erreurs avec des apostrophes dans les noms O'hara!! => échapper les apostrophes
        const searchLower = searchTerme.toLowerCase().replace(/'/g, "\\'");

        // LOWER({Nom}) => convertir le champ Nom en minuscules
        // filterByFormula => filtre côté Airtable
        // FIND(a, b)=> revoie a dans b s'il est trouvé
        filterFormula = `AND(${userFilter}, OR(FIND('${searchLower}', LOWER({Nom})), FIND('${searchLower}', LOWER({Entreprise}))))`;
        const encodedFormula = encodeURIComponent(filterFormula);

        const url = `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}?filterByFormula=${encodedFormula}&view=Grid%20view`;

        console.log("Formule de filtre :", filterFormula);
        console.log("Recherche pour :", currentUsername, "| Terme :", searchTerme);

        //envoie la requête
        const response = await fetch(url, requestOptions);

        if(!response.ok){
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Airtable raw response:", data);

        if (data.error) {
            console.error("Airtable error:", data.error);
        }

        const contacts = data.records;
        console.log(`${contacts.length} contact(s) trouvé(s) selon la recherche`);

         //si aucun contact  => il faut pas => most il affiche dynamiquement le résultat de la recherche
        // if(contacts.length === 0){

        //     const noContactModal = document.getElementById("NoContactBDD-Modulo");
        //     if(noContactModal){

        //         noContactModal.classList.add("show");

        //         document.addEventListener("click", function (event){
        //             if(event.target.id === "NoContactBDD-closeModulo" || event.target.id === "NoContactBDD-OK" ){
        //                 window.location.href = "index.html";
        //             }
        //         });
        //     }

          
        // } else{
        //     const noContactModal = document.getElementById("NoContactBDD-Modulo");
        //     if(noContactModal){
        //         noContactModal.classList.remove("show");
        //     }
        // }

        //trier le contact par alphabet un utilisant le fonction triABulles créé plus haut..=> dans
        //appeler le fonction du outils.js
        const contactsTries = triABulles(contacts);

        // Vider tous les accordéons et les masquer  => effacer l'ancien résultat 
        accordionBlocks.forEach(block => {
            block.innerHTML = "";
            
            const accordionItem = block.closest(".accordion-item");
            if(accordionItem){
                accordionItem.style.display = "none";
            }
        });

        const lettresAvecContacts = new Set();

        //afficher les résultats
        contactsTries.forEach(contact => {
            const nom = contact.fields.Nom || "Nom inconnu";
            const lettre = nom.charAt(0).toUpperCase();
            lettresAvecContacts.add(lettre);

            const photoURL = contact.fields.Photo ? contact.fields.Photo[0].url : "../image/profil_par_default.png";

            const card = document.createElement("div");
            card.classList.add("contact-card-recherche-home");
            card.dataset.contactID = contact.id;

            //d'abord à créer les cards
            //appeler le fonction du DOM.js
            card.innerHTML = createContactCard(contact, photoURL);

            // recherche la div accordéon correspondante
            let inserted = false;
            accordionBlocks.forEach(block => {
                const item = block.closest(".accordion-item");
                const btn = item.querySelector(".accordion-button");
                if (btn && btn.textContent.trim().toUpperCase() === lettre) {
                    block.appendChild(card);
                    item.style.display = "block";
                    inserted = true;
                }
            });

            if (!inserted) {
                console.warn("Lettre non trouvée dans accordéon :", lettre);
            }

            /***********************************************************************************************
                            Gestion du clic sur un contact
            ************************************************************************************************/          
    
            //"event.target" => élément qui a été cliqué ??
            if(resultatDiv && infosModifier && afficheDetails){
                // à cause de "this" de "dataset.contactID" il faut mettre "card" et pas le "document"!!!
                // document n'a pas "dataset.contactID" => il renvoie undefined!!
            
                // Si on ne clique pas sur un bouton ou autre, on ouvre le modal
                card.addEventListener('click', function(event) {

                    const isFavoris = contact.fields.Favoris === 1;
                    const photoURL = contact.fields.Photo ? contact.fields.Photo[0].url : "../image/profil_par_default.png";

                    //id du contact
                    // contactId = contact.id;
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

        //afficher le premier alphabet où il y a un contact
        const alphabetBlock = document.querySelectorAll(".accordion-body.alphabet");
        //appeler le fonction du outils.js
        affichePremierAlphabetContact(alphabetBlock);

    }catch(error){

         console.error("Erreur lors de la recherche : ", error);
    
        // afficher un message d'erreur à l'utilisateur
        const resultatDiv = document.getElementById("resultat");
        if (resultatDiv) {
            resultatDiv.innerHTML = `
                <div class="alert alert-danger text-center my-5" role="alert">
                    <h4 class="alert-heading">Erreur de recherche</h4>
                    <p>Impossible d'effectuer la recherche. Veuillez réessayer.</p>
                    <hr>
                    <p class="mb-0">Erreur: ${error.message}</p>
                    <button class="btn btn-outline-danger mt-3" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise me-2"></i>Réessayer
                    </button>
                </div>
            `;
            resultatDiv.style.display = "block";
        }
    }
});
