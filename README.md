
# 📇 Mini CRM — Gestion de contacts (Front-end + API)

## Informations Personnelles
**Auteur :** Klaudia Juhasz  
**Cadre :** BTS SIO — option SLAM (Réalisation Professionnelle)

Mini CRM est une application web légère et responsive permettant de gérer des contacts professionnels (freelances, auto-entrepreneurs, petites structures).  
Le projet repose sur une architecture **100% front-end (HTML/CSS/JavaScript)** et s’appuie sur des services externes via API : **Airtable** (données) et **Cloudinary** (images).

> 🌐 **Application disponible en ligne :** [https://mini-crm-klaudia.iris.a3n.fr:4433/](https://mini-crm-klaudia.iris.a3n.fr:4433/)

Depuis la première version mono-utilisateur, l’application a évolué avec l’ajout d’un **système d’authentification (inscription/connexion)** et une logique **multi-utilisateurs** permettant d’isoler les données : chaque utilisateur visualise et manipule uniquement ses propres contacts.

---

## Fonctionnalités

- **Inscription / Connexion** (authentification utilisateur)
- **Affichage des contacts** (tri alphabétique + accordéon)
- **Ajout d’un contact** avec photo (Cloudinary) et informations détaillées
- **Modification** d’un contact via interface dédiée / modal
- **Suppression** avec confirmation utilisateur
- **Recherche & filtres avancés** :
  - recherche dynamique (nom / entreprise)
  - filtre par type (Client / Prospect / Partenaire)
  - filtre par statut de relance (À relancer / Fait)
- **Favoris** : marquer des contacts importants
- **Suivi / relance** : date + statut de relance
- **Formulaire de contact** (page “Nous contacter”)
- **Navigation dynamique** (menu adapté à l’état connecté / non connecté)

---

## Pages disponibles

- `index.html` — Accueil : affichage des contacts de l’utilisateur connecté
- `ajouter.html` — Ajout d’un contact
- `rechercher.html` — Recherche multicritères
- `connexion.html` — Connexion
- `inscription.html` — Inscription
- `A_propos.html` — À propos
- `nous_contacter.html` — Contact
- `plan_du_site.html` — Plan du site

---

## Lancement du projet

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/juklau/Mini_CRM.git

2. Ouvrir le projet (recommandé) avec Live Server (VS Code) :
	- `html/index.html`

> 🌐 **Version en ligne :** [https://mini-crm-klaudia.iris.a3n.fr:4433/](https://mini-crm-klaudia.iris.a3n.fr:4433/)

Des contacts de démonstration peuvent être présents selon la base Airtable configurée.


---

## Technologies utilisées

- **HTML5, CSS3, JavaScript** – Langages de base pour la structure, le style et la logique applicative.
- **Bootstrap** – Pour la mise en page responsive et le design adaptatif.
- **Postman** – Pour tester et valider les requêtes HTTP (GET, POST, PATCH, DELETE).
- **API Airtable** – Pour la gestion et le stockage distant des données de contact.
- **API Cloudinary** – Pour l’hébergement et la gestion des images avec génération d’URL accessibles
- **Font Awesome** – Pour les icônes de navigation et d'interaction.
- **Assistance de l’intelligence artificielle (IA)** – Pour l'aide à la rédaction de documentation et à l'optimisation du code.
- **GitHub** — Pour versioning et hébergement du code.

---

## Structure principale

```
   MINI_CRM/
		├── html/
		│   ├── A_propos.html              # Présentation de l'application
		│   ├── ajouter.html               # Formulaire d'ajout de contact
		│   ├── connexion.html             # Page de connexion (non fonctionnelle pour le moment)
		│   ├── index.html                 # Page d'accueil affichant les contacts de l'utilisateur 
		│	│								connecté
		│   ├── inscription.html           # Page d'inscription
		│   ├── nous_contacter.html        # Formulaire de contact
		│   ├── plan_du_site.html          # Plan du site pour faciliter la navigation
		│   ├── rechercher.html            # Recherche avancée multicritères
		│   └── new-style.css              # Feuille de style centralisée
		├── js/
		│   ├── affiche_contacts.js        # Affichage dynamique des contacts depuis l’API Airtable
		│   ├── ajouter.js                 # Ajout d’un contact
		│   ├── config.js                  # Configuration (clés / endpoints)
		│   ├── connection.js              # Auth : inscription / connexion / session
		|	├── DOM.js					   # Fonctions DOM pour optimiser / factoriser
		|	├── navbar-manager.js		   # Menu dynamique selon état connecté
		│   ├── modifier.js                # Modification d'un contact
		│   ├── nous_contacter.js          # Gestion du formulaire de contact
		|	├── outils.js				   # Fonctions réutilisables (tri, helpers, etc.)
		│   ├── rechercher.js              # Recherche multicritères
		│   ├── rechercher_par_nom_entreprise.js # Recherche spécifique (nom du contact/entreprise)
		│   ├── validation-listener.js 	   # Écouteurs de validation (Formulaires)
		│   └── validation.js 			   # Fonctions de validation réutilisables

```
---

## Sécurité et données

- Les données sont stockées via **Airtable** et consommées via API REST.
- L’application gère un **état connecté / non connecté** et adapte l’interface en conséquence.
- La logique vise à **isoler les données par utilisateur** (filtrage des enregistrements liés à l’utilisateur connecté).
- Les bonnes pratiques RGPD sont prises en compte (collecte minimale, usage lié à la finalité de l’application).

**Remarque** : ce projet est une application front-end consommant des APIs externes. La sécurité dépend aussi de la configuration des accès côté Airtable (droits, clés, restrictions, etc.).

---

## Documentation et ressources

- Maquette Figma :  
  [Accéder à la maquette Figma](https://www.figma.com/design/9ogs0Hg8QeLXew9DdNP9AC/Klaudia-Juhasz-s-team-library?node-id=3314-2&p=f&t=7k7QL8tza0XojF4D-0)  
  (***Cette maquette a connu plusieurs améliorations depuis sa conception.***)
- README.md : présent dans le projet, il décrit l’installation, la structure et les fonctionnalités.
- Commentaires dans mes codes : intégrés dans les fichiers pour expliquer les parties clés.

- Documentation officielles externes :
    - Airtable API Docs
    - Cloudinary Documentation
    - Bootstrap Docs
    - Font Awesome Docs

---

## Contact

Pour toute question ou suggestion, vous pouvez utiliser le formulaire intégré dans l’application [nous_contacter.html](https://mini-crm-klaudia.iris.a3n.fr:4433/html/nous_contacter.html).

---

*Projet réalisé dans le cadre de l’application Mini CRM – Gestion simplifiée de vos relations professionnelles.*



