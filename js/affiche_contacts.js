// requestAnimationFrame('dotenv').config(); => c'est il faut si j'utilise node.js!!!!

/***********************************************************************************************
            Récuperation les contacts de la base de donnée pour afficher sur la page home
************************************************************************************************/

// appel la fonction du outils.js ?????
const myHeaders = createHeaders();
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

    // let contactId = null;
    //vérification si id est bien récupéré
    // const params = new URLSearchParams(window.location.search);
    // const contactId = params.get("id");

    // Vérification si l'ID est bien récupéré
    // console.log("ID du contact :", contactId); 