
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

    loadUserContacts(userId, username);
});

/***********************************************************************************************
            Récuperation les contacts de la base de donnée pour afficher sur la page home
************************************************************************************************/

async function loadUserContacts(userId, username){ 

    try {

        // préparer les headers => appel la fonction du outils.js 
        const myHeaders = createHeaders();
        // myHeaders.append("Cookie", "brw=brwP5dTKIEAUqvTmM; brwConsent=opt-out; AWSALBTG=ITi/fbHG7IlJgD3xaTn3MpZhQIe/9PxRn5wTkr7VbxtjkE3Vz9brZcpkLxRdw7XDE6BxfY2hph/udQSaTP8EyeZguxhdEf7CpvTcKh2yBu3VTESSjr8jp4pbaE/sNuk1sXxXyYX+IPWUXM0UMUXewoYqBm0gr6cRTBCet5zwMYvXmBGopoU=; AWSALBTGCORS=ITi/fbHG7IlJgD3xaTn3MpZhQIe/9PxRn5wTkr7VbxtjkE3Vz9brZcpkLxRdw7XDE6BxfY2hph/udQSaTP8EyeZguxhdEf7CpvTcKh2yBu3VTESSjr8jp4pbaE/sNuk1sXxXyYX+IPWUXM0UMUXewoYqBm0gr6cRTBCet5zwMYvXmBGopoU=");

        //préparer le body de la requête
        const requestOptions = {
            method: "GET", //pour récuperer les données
            headers: myHeaders, 
            redirect: "follow"
        };

        //pour filtrer par user_id
        //FIND => cherche userId dans le champ user_id
        // const filterFormula = `FIND("${userId}", ARRAYJOIN({user_id}))`; //=>marche pas!!
        const filterFormula = `FIND("${username}", {user_id})`;  //filtrage selon AIRTABLE!!!
        const encodedFormula = encodeURIComponent(filterFormula);

        const url = `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}?filterByFormula=${encodedFormula}&view=Grid%20view`;
         
        console.log('Chargement des contacts pour l\'utilisateur:' , userId);

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

        console.log(`${contacts.length} contact(s) trouvé(s) pour cet utilisateur`);
        
        //vérification s'il y a des contacts
        if(contacts.length === 0){
            // resultatDiv.innerHTML = "<p> Aucun contact trouvé. </p>";
            // return;
            const noContactModulo = document.getElementById("NoContactBDD-Modulo");
            if(noContactModulo) noContactModulo.classList.add("show");
        
            document.addEventListener("click", function (event){
                if(event.target.id === "NoContactBDD-closeModulo" || event.target.id === "NoContactBDD-OK" ){
                    window.location.href = "ajouter.html";
                }
            });
            return;
        } 

        //trier le contact par alphabet un utilisant le fonction triABulles créé plus haut..=> dans
        //appeler le fonction du outils.js
        const contactsTries = triABulles(contacts);
        
        //afficher les contacts sous forme de cartes
        //appeler le fonction du outils.js
        const lettresAvecContacts = afficherContacts({
            contacts: contactsTries,
            resultatDiv: document.getElementById("resultat"),
            containerSelector: "#resultat",
            infosModifier: document.getElementById("editModal"),
            afficheDetails: document.getElementById("affiche-details")
        });
        
        const alphabetBlock = document.querySelectorAll(".accordion-body.alphabet");
        
        //appeler le fonction du outils.js
        affichePremierAlphabetContact(alphabetBlock);
        
        //pour afficher ".alphabet" qui ont des ".contact-card" et pas les autres
        document.querySelectorAll(".accordion-item").forEach(item => {
            const alphabetDiv = item.querySelector(".alphabet");
        
            //pour vérifier s'il a .contact-card
            const hasContact = alphabetDiv.querySelector(".contact-card") != null;
            item.style.display = hasContact ? "block" : "none";
        
            // if(!hasContact){ => régi rendszer
            //     item.style.display = "none";
            // }else{
            //     item.style.display = "block";
            // }
        });

    }catch (error){

        console.error("Erreur lors de la récupération des contacts:", error);
        
        // afficher un message d'erreur à l'utilisateur
        const resultatDiv = document.getElementById("resultat");
        if (resultatDiv) {
            resultatDiv.innerHTML = `
                <div class="alert alert-danger text-center my-5" role="alert">
                    <h4 class="alert-heading">Erreur de chargement</h4>
                    <p>Impossible de charger vos contacts. Veuillez réessayer.</p>
                    <hr>
                    <p class="mb-0">Si le problème persiste, contactez le support.</p>
                    <button class="btn btn-outline-danger mt-3" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise me-2"></i>Réessayer
                    </button>
                </div>
            `;
            resultatDiv.style.display = "block";
        }
    }
}


    // let contactId = null;
    //vérification si id est bien récupéré
    // const params = new URLSearchParams(window.location.search);
    // const contactId = params.get("id");

    // Vérification si l'ID est bien récupéré
    // console.log("ID du contact :", contactId); 
