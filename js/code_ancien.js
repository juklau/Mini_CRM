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
