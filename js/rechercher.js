document.querySelector("#btn-rechercher").addEventListener("click", function(){
  
    let typeContact = document.getElementById("search").value;
    let statutRelance =  document.getElementById("search2").value;

    // appel la fonction du outils.js
    const myHeaders = createHeaders(true);
    myHeaders.append("Cookie", "brw=brwP5dTKIEAUqvTmM; brwConsent=opt-out; AWSALBTG=2t5l0cFN2s9klbKqfoQ2EHSF/SuU52mIvl/lMT/nk9AXWTBg/JYiL3+vlW8wZaH66B9wgvsUwT7OwMpDvqutCMeO7Y+P+RTmYSbTGmfOJlYWbkGeSZ8NxhmZq0GHtQr1waCdoLD8aRYQnT/prQ3pVERJribCLWfxwZbTME2+PQCxllU6keI=; AWSALBTGCORS=2t5l0cFN2s9klbKqfoQ2EHSF/SuU52mIvl/lMT/nk9AXWTBg/JYiL3+vlW8wZaH66B9wgvsUwT7OwMpDvqutCMeO7Y+P+RTmYSbTGmfOJlYWbkGeSZ8NxhmZq0GHtQr1waCdoLD8aRYQnT/prQ3pVERJribCLWfxwZbTME2+PQCxllU6keI=");

    // pour remplacer "if"!!
    const apiURL = (typeContact !== "Tous" &&  statutRelance !== "Tous") //vérification l'activité des filtres
        // "AND" => inclusion des 2 filtres
        ? `https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM?filterByFormula=AND({Type de contact}="${typeContact}",{Statut de relance}="${statutRelance}")`
        : (typeContact !== "Tous")
            // choix: QUE le type de contact
            ? `https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM?filterByFormula={Type de contact}="${typeContact}"`
        : (statutRelance !== "Tous")
            // choix: QUE le statut de relance
            ? `https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM?filterByFormula={Statut de relance}="${statutRelance}"`
        // les 2 sont "Tous" => pas de filtre!!
        : "https://api.airtable.com/v0/app0YvWUy1t2JUWEd/Mini%20CRM?view=Grid%20view"
    
    fetch(apiURL, {
        method: "GET",
        headers: myHeaders,
        // body: raw, ==> les requêtes de GET n'ont pas body!!!
        redirect: "follow" //????????
    })
   
    .then((response) => response.json())
    .then((data) => {
        const contacts = data.records;
        
        const resultatDiv = document.getElementById("resultat-recherche");

        //pour éviter que les contacts affiche plusieurs fois, il faut vider les anciens résultats
        //avant qu'on ajoute les nouvelles
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
            })
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
    })
    .catch((error) => console.error("Erreur lors de la récupération des contacts :", error));
});