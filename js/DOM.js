

// constants réutilisable
const resultatDiv = document.getElementById("resultat");
const afficheDetails = document.getElementById("affiche-details");
const infosModifier = document.getElementById("editModal");

function createContactCard(contact, photoURL){

    let creationCard = `
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
                        <div class="row justify-content-center mb-4">
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

    return creationCard;
}



function get_insert_dom(contact, photoURL, isFavoris)
{
    let insertion = `
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

                        <div class="row justify-content-center mt-2 mb-5">
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

                    <div class="icon-container details mt-4 mb-3 my-md-5 d-flex justify-content-around align-items-center">  
                        <img src="https://img.icons8.com/?size=100&id=avu7fhuOMreB&format=png&color=000000" alt="pen" class="modifier-pen">
                        <img src="https://img.icons8.com/?size=100&id=67884&format=png&color=000000" alt="delete" id="delete">
                    </div>
                </div>
            `;

    return insertion ;
}






//pour afficher si le contact est en favoris ou non => ez elvileg nem kell...
//affiche_contacts.js && rechercher.js
// const starButton = card.querySelector(".star-button");

// if(contact.fields.Favoris === 1){
//         starButton.classList.add("checked");
// }else{
//         starButton.classList.remove("checked");
// }


