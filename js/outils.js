

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


/***********************************************************************************************
                afficher le premier alphabet où il y a un contact
************************************************************************************************/


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