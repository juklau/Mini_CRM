document.querySelector("#recherche").addEventListener("input", function () {
    const searchTerme = document.getElementById("recherche").value.trim();
    const resultatDiv = document.getElementById("resultat");
    const accordionBlocks = document.querySelectorAll(".accordion-body.alphabet");

    if (searchTerme === "") {
        // Réaffiche tout si recherche vide
        accordionBlocks.forEach(block => {
            block.closest(".accordion-item").style.display = "block";
        });
        return;
    }

    // appel la fonction du outils.js
    const myHeaders = createHeaders();
    myHeaders.append("Content-Type", "application/json");

    // pour éviter les erreurs avec des apostrophes dans les noms O'hara
    const searchLower = searchTerme.toLowerCase().replace(/'/g, "\\'");


    // LOWER({Nom}) => convertir le champ Nom en minuscules
    fetch(`https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM?filterByFormula=OR(FIND('${searchLower}', LOWER({Nom})), FIND('${searchLower}', LOWER({Entreprise})))`, {
        method: "GET",
        headers: myHeaders
    })
        .then(response => response.json())
        .then(data => {
            const contacts = triABulles(data.records);
            const lettresAvecContacts = new Set();

            // Vider tous les accordéons
            accordionBlocks.forEach(block => {
                block.innerHTML = "";

                const accordionItem = block.closest(".accordion-item");
                if(accordionItem){
                    accordionItem.style.display = "none";
                }
            });

            contacts.forEach(contact => {
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
                        Récuperation les informations du contact selectionné
                ************************************************************************************************/          
        
                //"event.target" => élément qui a été cliqué
                if(document.getElementById("resultat")){
                    // à cause de "this" de "dataset.contactID" il faut mettre "card" et pas le "document"!!!
                    // document n'a pas "dataset.contactID" => il renvoie undefined!!
                
                    // Si on ne clique pas sur un bouton ou autre, on ouvre le modal
                    card.addEventListener('click', function(event) {

                        const photoURL = contact.fields.Photo ? contact.fields.Photo[0].url : "../image/profil_par_default.png";

                        //id du contact
                        // contactId = contact.id;
                        infosModifier.setAttribute("data-contactid", contact.id);

                        const isFavoris = contact.fields.Favoris === 1;

                        //appeler le fonction du DOM.js
                        infosModifier.innerHTML = get_insert_dom(contact, photoURL, isFavoris);

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

            document.addEventListener("click", function (event){
                if(event.target.id === "NoContactBDD-closeModulo" || event.target.id === "NoContactBDD-OK" ){
                    window.location.href = "index.html";
                }
            })

            /***********************************************************************************************
                            afficher le premier alphabet où il y a un contact
            ************************************************************************************************/

            const alphabetBlock = document.querySelectorAll(".accordion-body.alphabet");
            //appeler le fonction du outils.js
            affichePremierAlphabetContact(alphabetBlock);

            if (contacts.length === 0 && resultatDiv) {
                document.getElementById("NoContactBDD-Modulo").style.display = "block";
            } else {
                document.getElementById("NoContactBDD-Modulo").style.display = "none";
            }
        })
        .catch(error => {
            console.error("Erreur de chargement :", error);
            if (resultatDiv) {
               console.log("Erreur de chargement. Veuillez réessayer");
            }
        });
});
