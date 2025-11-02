## Informations Personnelles
- **Klaudia Juhasz**

# 📇 Mini CRM – Gestion des Contacts

Le projet Mini-CRM a été développé dans le cadre de ma formation en BTS SIO, option SLAM (Solutions Logicielles et Applications Métiers). L'objectif était de concevoir une application web de gestion de contacts professionnels adaptée aux besoins d'un freelance ou d'une petite structure. Réalisée en autonomie à partir d'un cahier des charges fictif, cette solution repose sur une architecture 100 % front-end utilisant HTML, CSS et JavaScript. L'application peut être installée sur un seul ordinateur pour un usage individuel, car le système d'authentification n'est pas encore finalisé. Ce projet m'a permis de mettre en œuvre mes compétences en conception d'interface, développement web et intégration d'API REST, tout en suivant une démarche professionnelle inspirée du modèle de développement logiciel.

### Lancement du Mini CRM
Dans cette application, plusieurs contacts sont déjà enregistrés. 
Pour les consulter, il suffit de lancer l’application depuis la page `index.html`:


## Fonctionnalités

- **Recherche dynamique** par nom ou par entreprise, avec affichage instantané des résultats
- **Ajout de nouveaux contacts** avec photo, informations détaillées et statut personnalisé
- **Modification des données** via une interface intuitive et ergonomique
- **Suppression sécurisée** avec confirmation de l'utilisateur
- **Classement alphabétique** des contacts, présenté sous forme d’accordéon interactif
- **Gestion des favoris** : possibilité de marquer un contact comme important
- **Suivi personnalisé** : date de relance et statut de suivi pour chaque contact
- **Filtres de recherche** par type de contact et statut de relance
- **Système de connexion** sécurisé => lequel pour l'instant ne fonctionne pas...
- **Formulaire de contact** pour les retours ou demandes externes


## Interfaces disponibles

- **Page d’accueil (index.html)** avec affichage de tous les contacts par ordre alphabétique:
En cliquant sur un contact, vous pouvez le modifier ou le supprimer.
- **Page Ajouter un contact**: formulaire complet pour créer un nouveau profil.
- **Page de Recherche** avec filtres multicritères (statut de relance et type de contrat)
- **Pages statiques** : Connexion, À propos, Contact


## Technologies utilisées

- **HTML5, CSS3, JavaScript** – Langages de base pour la structure, le style et la logique applicative.
- **Bootstrap** – Pour la mise en page responsive et le design adaptatif.
- **Postman** – Pour tester et valider les requêtes HTTP (GET, POST, PATCH, DELETE).
- **API Airtable** – Pour la gestion et le stockage distant des données de contact.
- **API Cloudinary** – Pour l’hébergement et la gestion des images avec génération d’URL accessibles
- **Font Awesome** – Pour les icônes de navigation et d'interaction.
- **Assistance de l’intelligence artificielle (IA)** – Pour l'aide à la rédaction de documentation et à l'optimisation du code.


## Structure principale

```
   MINI_CRM/
		├── html/
		│   ├── A_propos.html              # Présentation de l'application
		│   ├── ajouter.html               # Formulaire d'ajout de contact
		│   ├── connexion.html             # Page de connexion (non fonctionnelle pour le moment)
		│   ├── index.html                 # Page d'accueil affichant tous les contacts
		│   ├── nous_contacter.html        # Formulaire de contact
		│   ├── plan_du_site.html          # Plan du site pour faciliter la navigation
		│   ├── rechercher.html            # Recherche avancée multicritères
		│   └── new-style.css              # Feuille de style centralisée
		├── js/
		│   ├── affiche_contacts.js        # Affichage dynamique des contacts depuis l’API Airtable
		│   ├── ajouter.js                 # Script pour l’ajout d’un contact
		|	├── DOM.js					   # Script DOM pour optimisation des codes
		│   ├── modifier.js                # Script de modification de contact
		│   ├── nous_contacter.js          # Gestion du formulaire de contact
		|	├── outils.js				   # Script des fonctions réutilisables
		│   ├── rechercher.js              # Fonction de recherche générale
		│   ├── rechercher_par_nom_entreprise.js # Recherche spécifique par entreprise
		│   └── se-connecter.js            # Script prévu pour la connexion (non finalisé)

```


## Sécurité et données

Toutes les requêtes vers la base de données sont actuellement sécurisées par un jeton d’authentification API unique et non-visible. 
La prochaine étape consistera à implémenter un système de connexion utilisateur avec un jeton d’authentification API propre à chaque compte, afin d’améliorer la sécurité et le fonctionnement global de l’application.
La gestion des données personnelles respecte le RGPD.

## Contact

Pour toute question, suggestion ou demande de support, utilisez le [contact-form](#) intégré à l'application.

---

*Projet conçu dans le cadre de l’application Mini CRM – Gestion simplifiée de vos relations professionnelles.*

**Source de code et documentation**

## Code source

- HTML / CSS / JavaScript : l’ensemble des fichiers présents dans le dossier MINI-CRM.
- Scripts JavaScript : gèrent l’interaction avec Airtable, la recherche, et la gestion des favoris...
- API Airtable : utilisée pour récupérer et manipuler les données de contact.
- API Cloudinary : utilisée pour héberger les images de profil.
- Frameworks : Bootstrap pour le design, Font Awesome pour les icônes.

## Documentation

- Voici le line de mon fichier Figma:
    https://www.figma.com/design/9ogs0Hg8QeLXew9DdNP9AC/Klaudia-Juhasz-s-team-library?node-id=3314-2&p=f&t=7k7QL8tza0XojF4D-0 
    (Cette maquette a connu plusieurs améliorations depuis sa conception.)
- README.md : présent dans le projet, il décrit l’installation, la structure et les fonctionnalités.
- Commentaires dans mes codes : intégrés dans les fichiers pour expliquer les parties clés.

- Documentation officielles externes :
    - Airtable API Docs
    - Cloudinary Documentation
    - Bootstrap Docs
    - Font Awesome Docs