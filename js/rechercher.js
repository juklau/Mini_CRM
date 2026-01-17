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
    const userId = currentUser.id;
    const username = currentUser.username;

    if(!userId || !username){
        alert("Erreur : impossible de récupérer vos informations. Veuillez vous reconnecter.");
        window.location.href = '/html/connexion.html';
        return;
    }

    console.log('Utilisateur connecté : ', username, 'Id : ', userId);

    //initialiser le sytème de recherche
    setupSearchSystem(userId, username);
});

/***********************************************************************************************
                        Configuration du système de recherche filtrée
************************************************************************************************/
function setupSearchSystem(userId, username) {

    const rechercheBtn = document.querySelector("#btn-rechercher");

    if(!rechercheBtn){
        console.warn("Bouton de recherche introuvable!");
        return;
    }

    try{

        rechercheBtn.addEventListener("click", async function(){

            //afficher le spinner sur le btn recherche
            const originalBtnText = rechercheBtn.innerHTML;
            rechercheBtn.disabled = true;
            rechercheBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Recherche en cours...';

            let typeContact = document.getElementById("search").value;
            let statutRelance =  document.getElementById("search2").value;

            console.log("Recherche avec filtres : ", { typeContact, statutRelance });

            // préparer les headers => appel la fonction du outils.js 
            const myHeaders = createHeaders(true);

            //préparer le body de la requête
            const requestOptions = {
                method: "GET", //pour récuperer les données
                headers: myHeaders, 
                // body: raw, ==> les requêtes de GET n'ont pas body!!!
                redirect: "follow"
            };

            // filtre par user_id et filtres de recherches
            let filterFormula;

            const userFilter = `FIND("${username}", {user_id})`;  //filtrage selon AIRTABLE!!!

            //combination les filtres de recherche
            if(typeContact !== "Tous" &&  statutRelance !== "Tous") {
                filterFormula = `AND(${userFilter}, {Type de contact}="${typeContact}", {Statut de relance}="${statutRelance}")`;

            } else if (typeContact !== "Tous"){
                filterFormula = `AND(${userFilter}, {Type de contact}="${typeContact}")`;

            }else if (statutRelance !== "Tous"){
                filterFormula = `AND(${userFilter}, {Statut de relance}="${statutRelance}")`;

            }else{
                filterFormula = userFilter;
            }

            const encodedFormula = encodeURIComponent(filterFormula);

            const apiURL = `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}?filterByFormula=${encodedFormula}&view=Grid%20view`;

            console.log("Formule de filtre :", filterFormula);
            console.log('Chargement des contacts pour l\'utilisateur:' , userId);

            //envoie la requête
            const response = await fetch(apiURL, requestOptions);

            if(!response.ok){
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log("Airtable raw response:", data);

            if (data.error) {
                console.error("Airtable error:", data.error);
            }

            const contacts = data.records;

            console.log(`${contacts.length} contact(s) trouvé(s) selon les filtres de recherche`);

            //pour éviter que les contacts affiche plusieurs fois, il faut vider les anciens résultats
            //avant qu'on ajoute les nouvelles
            // const resultatDiv = document.getElementById("resultat-recherche");
            // resultatDiv.innerHTML = "";  =>si je le laisse, il supprime les ".alphabet"
            //                              => si je laisse, il y a ".alphabet", mais affiche 2fois!

            // vider les anciens cards!
            document.querySelectorAll(".contact-card").forEach(card => card.remove());

            //vérification s'il y a des contacts
            if(contacts.length === 0){
                // resultatDiv.innerHTML = "<p> Aucun contact trouvé. </p>";
                // return;
                document.getElementById("NoContact-Modulo").classList.add("show");

                document.addEventListener("click", function (event){
                    if(event.target.id === "NoContact-closeModulo" || event.target.id === "NoContact-OK" ){
                        window.location.href = "rechercher.html";
                    }
                });
                return;
            }

            //trier le contact par alphabet un utilisant le fonction triABulles créé plus haut.. => il est dans outils.js
            const contactsTries = triABulles(contacts);

            //afficher les contacts sous forme de cartes
            //appeler le fonction du outils.js
            const lettresAvecContacts = afficherContacts({
                contacts: contactsTries,
                resultatDiv: document.getElementById("resultat-recherche"),
                containerSelector: "#resultat-recherche",
                infosModifier: document.getElementById("editModal"),
                afficheDetails: document.getElementById("affiche-details")
            });

            const alphabetBlock = document.querySelectorAll(".accordion-body.alphabet");
            //appeler le fonction du DOM.js
            affichePremierAlphabetContact(alphabetBlock);

            //pour afficher ".alphabet" qui ont des ".contact-card" et pas les autres!!
            document.querySelectorAll(".accordion-item").forEach(item => {
                const alphabetDiv = item.querySelector(".alphabet");

                //pour vérifier s'il a .contact-card
                const hasContact = alphabetDiv.querySelector(".contact-card") != null;
                item.style.display = hasContact ? "block" : "none"; 
            });

            //afficher la partie où le resultat va s'afficher
            document.getElementById("resultat-recherche").style.display = "block";

            //restaurer le btn recherche
            rechercheBtn.disabled = false;
            rechercheBtn.innerHTML = originalBtnText;

        })
    }catch(error){

        console.error("Erreur lors de la recherche : ", error);

        //restaurer le btn recherche
        rechercheBtn.disabled = false;
        rechercheBtn.innerHTML = originalBtnText;
    
        // afficher un message d'erreur à l'utilisateur
        const resultatDiv = document.getElementById("resultat-recherche");
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
}
