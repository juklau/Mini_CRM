# 📘 Documentation Développeur — Mini CRM

**Projet :** Mini CRM – Gestion de contacts professionnels  
**Auteur :** Klaudia Juhasz  
**Contexte :** BTS SIO – Option SLAM (Réalisation Professionnelle)  
**Type :** Application web front-end avec APIs REST  
**Version :** 1.0  
**Date :** Janvier 2025

---

## Table des matières

1. [Présentation du projet](#1--présentation-du-projet)
2. [Architecture technique](#2--architecture-technique)
3. [Technologies et outils](#3--technologies-et-outils)
4. [Structure du projet](#4--structure-du-projet)
5. [Configuration et installation](#5--configuration-et-installation)
6. [Système d'authentification](#6--système-dauthentification)
7. [Gestion des données (Airtable)](#7--gestion-des-données-airtable)
8. [Gestion des images (Cloudinary)](#8--gestion-des-images-cloudinary)
9. [Modules JavaScript](#9--modules-javascript)
10. [Fonctionnalités principales](#10--fonctionnalités-principales)
11. [Validation des formulaires](#11--validation-des-formulaires)
12. [Interface utilisateur](#12--interface-utilisateur)
13. [Sécurité et bonnes pratiques](#13--sécurité-et-bonnes-pratiques)
14. [Guide de déploiement](#14--guide-de-déploiement)
15. [Maintenance et évolutions](#15--maintenance-et-évolutions)
16. [Ressources et références](#16--ressources-et-références)

---

## 1. Présentation du projet

### Objectif

Mini CRM est une application web destinée à la **gestion de contacts professionnels** pour freelances et petites structures. Elle permet à plusieurs utilisateurs de :

- Créer un compte utilisateur sécurisé
- Se connecter avec authentification
- Gérer **uniquement leurs propres contacts** (isolation des données)
- Effectuer des opérations CRUD (Create, Read, Update, Delete)
- Rechercher et filtrer les contacts
- Marquer des contacts comme favoris
- Planifier des relances

### Particularités

- **Architecture 100% front-end** : aucun serveur applicatif dédié
- **Multi-utilisateurs** : chaque utilisateur voit uniquement ses contacts
- **Responsive design** : compatible mobile, tablette et desktop
- **APIs externes** : Airtable (base de données) et Cloudinary (images)

---

## 2. Architecture technique

### 2.1 Diagramme d'architecture

```
┌────────────────────────────────────────────────────┐
│              Navigateur Web (Client)               │
│                                                    │
│  ┌───────────────────────────────────────────────┐ │
│  │    HTML / CSS / JavaScript (ES6)              │ │
│  │    Bootstrap 5 + Bootstrap Icons              │ │
│  └───────────────────────────────────────────────┘ │
│                        │                           │
│         ┌──────────────┴──────────────┐            │
│         ↓                             ↓            │
│  ┌──────────────┐            ┌──────────────────┐  │
│  │  Airtable    │            │   Cloudinary     │  │
│  │  API REST    │            │   API REST       │  │
│  │              │            │                  │  │
│  │ • Users      │            │ • Upload images  │  │
│  │ • Contacts   │            │ • Get URLs       │  │
│  └──────────────┘            └──────────────────┘  │
└────────────────────────────────────────────────────┘
```

### 2.2 Flux de données

1. **Utilisateur** → Saisit des données dans le formulaire
2. **JavaScript** → Valide et prépare les données
3. **API Cloudinary** → Upload des images (si présentes)
4. **API Airtable** → Stockage/récupération des données
5. **JavaScript** → Traite la réponse et met à jour le DOM
6. **Interface** → Affichage actualisé pour l'utilisateur

---

## 3. Technologies et outils

### Langages

| Technologie | Version |          Usage         |
|-------------|---------|------------------------|
| HTML5       |    -    | Structure des pages    |
| CSS3        |    -    | Styles et mise en page |
| JavaScript  |   ES6+  | Logique applicative    |

### Frameworks et librairies

|        Nom      | Version |            Usage         |
|-----------------|---------|--------------------------|
| Bootstrap       | 5.3.6   | Framework CSS responsive |
| Bootstrap Icons | 1.13.1  | Icônes                   |
| Font Awesome    | 6.0.0   | Icônes complémentaires   |

### APIs externes

|       Service      |             Usage                 |                           Documentation                                   |
|--------------------|-----------------------------------|---------------------------------------------------------------------------|
| **Airtable API**   | Base de données (Users, Contacts) | [docs.airtable.com](https://airtable.com/developers/web/api/introduction) |
| **Cloudinary API** | Hébergement d'images              | [cloudinary.com/documentation](https://cloudinary.com/documentation)      |

### Outils de développement

- **Git / GitHub** : Versioning et collaboration
- **Postman** : Tests des requêtes API
- **Figma** : Maquettes et design UI/UX
- **VS Code** : Éditeur de code
- **Chrome DevTools** : Debugging

---

## 4. Structure du projet

```
MINI_CRM/
│
├── html/                           # Pages HTML
│   ├── index.html                  # Accueil (liste des contacts)
│   ├── ajouter.html                # Ajout d'un contact
│   ├── rechercher.html             # Recherche multicritères
│   ├── connexion.html              # Connexion utilisateur
│   ├── inscription.html            # Inscription nouveau compte
│   ├── A_propos.html               # ℹPrésentation du projet
│   ├── nous_contacter.html         # Formulaire de contact
│   ├── plan_du_site.html           # Plan du site
│   └── new-style.css               # Styles CSS globaux
│
├── js/                             # Scripts JavaScript
│   │
│   ├── config.js                   # Configuration (clés API, endpoints)
│   ├── config-exemple.js           # Exemple de Configuration
│   │
│   ├── connection.js               # Authentification & sessions
│   ├── inscription.js              # Inscription utilisateur
│   ├── navbar-manager.js           # Menu dynamique (connecté/déconnecté)
│   │
│   ├── affiche_contacts.js         # Récupération & affichage contacts
│   ├── ajouter.js                  # Création de contact
│   ├── modifier.js                 # Modification de contact
│   ├── rechercher.js               # Recherche avec filtres
│   ├── rechercher_par_nom_entreprise.js # Recherche temps réel
│   │
│   ├── outils.js                   # Fonctions utilitaires
│   ├── DOM.js                      # Manipulation du DOM
│   ├── validation.js               # Fonctions de validation
│   ├── validation-listeners.js     # Écouteurs de validation dynamique
│   │
│   └── nous_contacter.js           # Formulaire de contact
│
├── image/                          # Images statiques
│   ├── logo CRM2.jpg               # Logo de l'application
│   └── profil_par_default.png      # Photo de profil par défaut
│
├── .gitignore                      # Fichiers ignorés par Git
└── README.md                       # Documentation utilisateur
```

---

## 5. Configuration et installation

### 5.1 Prérequis

- Navigateur web moderne (Chrome, Firefox, Edge, Safari)
- Serveur web local (Live Server, XAMPP, WAMP, ou autre)
- Compte Airtable (gratuit)
- Compte Cloudinary (gratuit)

### 5.2 Installation

#### Étape 1 : Cloner le projet

```bash
git clone https://github.com/votre-username/mini-crm.git
cd mini-crm
```

#### Étape 2 : Configuration des clés API

Créer le fichier `js/config.js` :

```javascript
const CONFIG = {
    // Airtable
    API_KEY: "Bearer patXXXXXXXXXXXXXX",        // Clé API Airtable (ancienne API)
    API_KEY_NEW: "patXXXXXXXXXXXXXX",           // Personal Access Token
    BASE_ID: "appXXXXXXXXXXXXXX",               // ID de la base Airtable
    NOM_TABLE1: "Mini CRM",                     // Nom de la table Contacts
    NOM_TABLE2: "Users",                        // Nom de la table Users
    
    // Cloudinary
    CLOUD_NAME: "votre-cloud-name",
    UPLOAD_PRESET: "photos_profil"
};
```

**Important** : Ajouter `config.js` au `.gitignore` pour ne pas exposer vos clés API.

#### Étape 3 : Configuration Airtable

##### Table "Users"

|    Champ     |      Type        |         Description          |
|--------------|------------------|------------------------------|
| `username`   | Single line text | Nom d'utilisateur unique     |
| `email`      | Email            | Email de l'utilisateur       |
| `password`   | Single line text | Mot de passe haché (SHA-256) |
| `api_token`  | Single line text | Token de sécurité            |
| `created_at` | Date             | Date de création du compte   |
| `last_login` | Date             | Dernière connexion           |
| `role`       | Single select    | Rôle (user/admin)            | 

##### Table "Contacts" (Mini CRM)

|        Champ        |       Type       |                 Description               |
|---------------------|------------------|-------------------------------------------|
| `Nom`               | Single line text | Nom du contact                            |
| `Prénom`            | Single line text | Prénom du contact                         |
| `Entreprise`        | Single line text | Nom de l'entreprise                       |
| `Email`             | Email            | Email du contact                          |
| `Téléphone`         | Phone number     | Téléphone                                 |
| `Type de contact`   | Single select    | Client, Prospect, Partenaire              |
| `Date de relance`   | Date             | Date de la prochaine relance              |
| `Statut de relance` | Single select    | À relancer, Fait                          |
| `Note`              | Long text        | Notes diverses                            |
| `Favoris`           | Number           | 1 = favori, 0 = normal                    |
| `Photo`             | Attachment       | Photo de profil (URL Cloudinary)          |
| `user_id`           | Single line text | Username du propriétaire                  |
| `created_by`        | Single line text | Username du créateur                      |
| `created_at`        | Date             | Date de création                          |

#### Étape 4 : Configuration Cloudinary

1. Créer un compte sur [cloudinary.com](https://cloudinary.com)
2. Obtenir le **Cloud Name**
3. Créer un **Upload Preset** nommé `photos_profil`
    - Settings → Upload → Upload presets
    - Mode : Unsigned
    - Folder : `mini-crm/profiles`

#### Étape 5 : Lancer l'application

```bash
# Avec Live Server (VS Code)
Clic droit sur index.html → Open with Live Server

```

Accéder à : `http://localhost:8000/html/index.html`

---

## 6. Système d'authentification

### 6.1 Principe

- Authentification basée sur **sessionStorage**
- Mot de passe haché avec **SHA-256** (côté client)
- Vérification des identifiants via **Airtable API**
- Stockage des informations de session côté client

### 6.2 Flux d'authentification

```
┌──────────────┐
│ Utilisateur  │
│ saisit login │
└──────┬───────┘
       │
       ↓
┌──────────────────────┐
│ Hashage du password  │
│ (SHA-256)            │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Requête Airtable     │
│ filterByFormula      │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Vérification hash    │
│ password             │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Stockage session     │
│ sessionStorage       │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Redirection vers     │
│ index.html           │
└──────────────────────┘
```

### 6.3 Stockage de session

```javascript
// Connexion réussie
sessionStorage.setItem('user_id', user.id);
sessionStorage.setItem('username', user.fields.username);
sessionStorage.setItem('user_email', user.fields.email);
sessionStorage.setItem('user_api_token', user.fields.api_token);
sessionStorage.setItem('user_role', user.fields.role || 'user');
sessionStorage.setItem('is_logged_in', 'true');
sessionStorage.setItem('login_time', new Date().toISOString());
```

### 6.4 Vérification de l'authentification

```javascript
// Vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
    return sessionStorage.getItem('is_logged_in') === 'true';
}

// Récupérer les informations de l'utilisateur
function getCurrentUserInfo() {
    return {
        id: sessionStorage.getItem('user_id'),
        username: sessionStorage.getItem('username'),
        email: sessionStorage.getItem('user_email'),
        api_token: sessionStorage.getItem('user_api_token'),
        role: sessionStorage.getItem('user_role'),
        login_time: sessionStorage.getItem('login_time')
    };
}

// Déconnexion
function logout() {
    sessionStorage.clear();
    window.location.href = '/html/connexion.html';
}
```

### 6.5 Protection des pages

```javascript
// Au chargement de chaque page protégée
document.addEventListener('DOMContentLoaded', () => {
    if (!isUserLoggedIn()) {
        window.location.href = '/html/connexion.html';
        return;
    }
    
    const currentUser = getCurrentUserInfo();
    // ... reste du code
});
```

---

## 7. Gestion des données (Airtable)

### 7.1 Méthodes HTTP utilisées

|  Méthode |          Usage           | Fichier                                                          |
|----------|--------------------------|------------------------------------------------------------------|
| `GET`    | Récupération des contacts | `affiche_contacts.js`, `rechercher.js`, `connection.js`,`rechercher_par_nom_entreprise.js`                         |
                                                                                                      |
| `POST`   | Ajout d'un contact       | `ajouter.js`, `inscription.js`, `nous_contacter.js`, `outils.js` |
| `PATCH`  | Modification d'un contact | `modifier.js`, `connection.js`                                   |
| `DELETE` | Suppression d'un contact | `modifier.js`                                                    |

### 7.2 Structure des requêtes

#### GET - Récupérer les contacts d'un utilisateur

```javascript
const username = currentUser.username;
const filterFormula = `FIND("${username}", {user_id})`;
const encodedFormula = encodeURIComponent(filterFormula);

const url = `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}?filterByFormula=${encodedFormula}&view=Grid%20view`;

const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': CONFIG.API_KEY,
        'Content-Type': 'application/json'
    }
});

const data = await response.json();
const contacts = data.records;
```

#### POST - Ajouter un contact

```javascript
const contactData = {
    "Nom": "Dupont",
    "Prénom": "Marie",
    "Email": "marie@example.com",
    "user_id": currentUser.username,
    "created_by": currentUser.username,
    "created_at": new Date().toISOString()
};

const raw = JSON.stringify({
    "records": [{
        "fields": contactData
    }]
});

const response = await fetch(
    `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}`,
    {
        method: 'POST',
        headers: {
            'Authorization': CONFIG.API_KEY,
            'Content-Type': 'application/json'
        },
        body: raw
    }
);
```

#### PATCH - Modifier un contact

```javascript
const raw = JSON.stringify({
    "records": [{
        "id": contactId,
        "fields": contactData
    }]
});

const response = await fetch(
    `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}`,
    {
        method: 'PATCH',
        headers: {
            'Authorization': CONFIG.API_KEY,
            'Content-Type': 'application/json'
        },
        body: raw
    }
);
```

#### DELETE - Supprimer un contact

```javascript
const response = await fetch(
    `https://api.airtable.com/v0/${CONFIG.BASE_ID}/${CONFIG.NOM_TABLE1}/${contactId}`,
    {
        method: 'DELETE',
        headers: {
            'Authorization': CONFIG.API_KEY
        }
    }
);
```

### 7.3 Filtrage par utilisateur

#### Principe d'isolation des données

Chaque contact est lié à un utilisateur via le champ `user_id` qui contient le username.

**Formule Airtable** :
```javascript
FIND("juklau", {user_id})
```

Cette formule recherche le username dans le champ `user_id` de chaque enregistrement.

#### Exemples de filtres combinés

**Filtre par utilisateur + type de contact** :
```javascript
const filterFormula = `AND(
    FIND("${username}", {user_id}), 
    {Type de contact}="Client"
)`;
```

**Filtre par utilisateur + recherche par nom** :
```javascript
const searchTerm = "dupont";
const filterFormula = `AND(
    FIND("${username}", {user_id}),
    OR(
        FIND("${searchTerm}", LOWER({Nom})),
        FIND("${searchTerm}", LOWER({Entreprise}))
    )
)`;
```

---

## 8. Gestion des images (Cloudinary)

### 8.1 Upload d'une image

```javascript
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "photos_profil");

    try {
        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dsblrrl1i/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();
        
        if (data.secure_url) {
            console.log(" Image hébergée :", data.secure_url);
            return data.secure_url;
        } else {
            console.error("URL non récupérée");
            return null;
        }
    } catch (error) {
        console.error(" Erreur upload :", error);
        return null;
    }
}
```

### 8.2 Workflow complet

```
1. User sélectionne fichier
            ↓
2. uploadToCloudinary(file)
            ↓
3. Cloudinary traite l'image
            ↓
4. Retourne URL publique
            ↓
5. URL stockée dans Airtable
            ↓
6. Affichage dans <img src="URL">
```

### 8.3 Affichage des images

```javascript
const photoURL = contact.fields.Photo 
    ? contact.fields.Photo[0].url 
    : "../image/profil_par_default.png";

document.getElementById("profile-pic").src = photoURL;
```

---

## 9. Modules JavaScript

### 9.1 config.js

**Rôle** : Configuration centralisée des clés API et paramètres.

```javascript
const CONFIG = {
    API_KEY: "Bearer patXXXXX",
    BASE_ID: "appXXXXX",
    NOM_TABLE1: "Mini CRM",
    NOM_TABLE2: "Users"
};
```

### 9.2 connection.js

**Rôle** : Gestion de l'authentification et des sessions.

**Fonctions principales** :
- `hashPassword(password)` : Hashage SHA-256
- `findUser(username)` : Recherche utilisateur dans Airtable
- `handleLogin(event)` : Processus de connexion
- `logout()` : Déconnexion
- `isUserLoggedIn()` : Vérification état connecté
- `getCurrentUserInfo()` : Récupération infos utilisateur
- `checkAuthentication()` : Protection des pages
- `initTogglePassword()` : Afficher/masquer mot de passe

### 9.3 inscription.js

**Rôle** : Création de nouveaux comptes utilisateurs.

**Fonctions principales** :
- `validateInscriptionForm()` : Validation formulaire inscription
- `checkUsernameExists()` : Vérification unicité username
- `checkEmailExists()` : Vérification unicité email
- `generateApiToken()` : Génération token sécurisé
- `createUser()` : Création compte dans Airtable
- `handleInscription()` : Processus d'inscription complet

### 9.4 affiche_contacts.js

**Rôle** : Récupération et affichage des contacts de l'utilisateur connecté.

```javascript
async function loadUserContacts(username) {
    const filterFormula = `FIND("${username}", {user_id})`;
    const url = `${BASE_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;
    
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    const contacts = triABulles(data.records);
    
    afficherContacts({
        contacts: contacts,
        resultatDiv: document.getElementById("resultat"),
        containerSelector: "#resultat",
        infosModifier: document.getElementById("editModal"),
        afficheDetails: document.getElementById("affiche-details")
    });
}
```

### 9.5 ajouter.js

**Rôle** : Ajout de nouveaux contacts.

**Workflow** :
```
1. Validation du formulaire
            ↓
2. Upload image (si présente)
            ↓
3. Préparation des données
            ↓
4. Ajout user_id, created_by, created_at
            ↓
5. Requête POST vers Airtable
            ↓
6. Confirmation et réinitialisation formulaire
```

### 9.6 modifier.js

**Rôle** : Modification et suppression de contacts.

**Fonctions principales** :
- Modification des informations
- Upload/suppression de photo
- Gestion des favoris
- Suppression de contact
- Validation dynamique

### 9.7 rechercher.js

**Rôle** : Recherche multicritères (type + statut).

**Filtres combinés** :
```javascript
const userFilter = `FIND("${username}", {user_id})`;
const filterFormula = `AND(
    ${userFilter}, 
    {Type de contact}="${typeContact}", 
    {Statut de relance}="${statutRelance}"
)`;
```

### 9.8 rechercher_par_nom_entreprise.js

**Rôle** : Recherche en temps réel par nom ou entreprise.

**Fonctionnalités** :
- Recherche instantanée (événement `input`)
- Filtrage côté serveur (Airtable)
- Affichage dynamique des résultats
- Rechargement des contacts quand recherche vide

### 9.9 outils.js

**Rôle** : Fonctions utilitaires réutilisables.

**Fonctions** :
- `triABulles(arr)` : Tri alphabétique
- `createHeaders(isJson)` : Création headers HTTP
- `afficherContacts()` : Affichage cartes contacts
- `affichePremierAlphabetContact()` : Ouvrir premier accordéon
- `getContactFormData()` : Extraction données formulaire
- `uploadToCloudinary()` : Upload image
- `bindPhotoUpload()` : Gestion upload photo

### 9.10 DOM.js

**Rôle** : Manipulation et génération d'éléments DOM.

**Fonctions** :
- `createContactCard()` : Génération HTML carte contact
- `get_insert_dom()` : Génération formulaire modification

### 9.11 validation.js

**Rôle** : Fonctions de validation des champs.

**Fonctions** :
- `sanitizeInput()` : Nettoyage des entrées
- `containsSQLInjection()` : Détection SQL injection
- `containsXSS()` : Détection XSS
- `escapeHTML()` : Échappement HTML
- `validateNom()` : Validation nom/prénom
- `validateEmail()` : Validation email
- `validateTelephone()` : Validation téléphone
- `validateEntreprise()` : Validation entreprise
- `validateNote()` : Validation note
- `validateUsername()` : Validation username
- `validatePassword()` : Validation mot de passe
- `validateTypeContact()` : Validation type de contact
- `validateDateRelance()` : Validation date
- `validateStatutRelance()` : Validation statut
- `showFieldError()` : Affichage erreurs

### 9.12 validation-listeners.js

**Rôle** : Validation en temps réel sur formulaires dynamiques.

```javascript
function attachValidationListeners() {
    // Validation sur blur et change
    document.getElementById('nom')?.addEventListener('blur', validateNomField);
    document.getElementById('email')?.addEventListener('blur', validateEmailField);
    // ... autres champs
}
```

### 9.13 navbar-manager.js

**Rôle** : Gestion dynamique du menu selon l'état de connexion.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    if (isUserLoggedIn()) {
        const username = sessionStorage.getItem('username');
        // Afficher bouton déconnexion
        // Cacher boutons connexion/inscription
        // Afficher nom utilisateur
    } else {
        // Afficher boutons connexion/inscription
        // Cacher bouton déconnexion
    }
});
```

---

## 10. Fonctionnalités principales

### 10.1 Gestion des contacts

#### Création (CRUD - Create)

**Fichier** : `ajouter.js`

1. Validation des champs (temps réel + soumission)
2. Upload photo vers Cloudinary (optionnel)
3. Ajout automatique de `user_id`, `created_by`, `created_at`
4. Requête POST vers Airtable
5. Modal de confirmation
6. Réinitialisation du formulaire

#### Lecture (CRUD - Read)

**Fichier** : `affiche_contacts.js`

1. Filtrage par `user_id` de l'utilisateur connecté
2. Tri alphabétique par nom
3. Regroupement par lettre de l'alphabet
4. Affichage dans des accordéons Bootstrap

#### Modification (CRUD - Update)

**Fichier** : `modifier.js`

1. Chargement des données existantes
2. Validation en temps réel (`validation-listeners.js`)
3. Modification de la photo
4. Requête PATCH vers Airtable
5. Modal de confirmation

#### Suppression (CRUD - Delete)

**Fichier** : `modifier.js`

1. Modal de confirmation
2. Requête DELETE vers Airtable
3. Redirection vers l'accueil

### 10.2 Recherche et filtrage

#### Recherche multicritères

**Fichier** : `rechercher.js`

- Filtre par **type de contact** (Client, Prospect, Partenaire)
- Filtre par **statut de relance** (À relancer, Fait)
- Combinaison des filtres avec `AND()`
- Spinner de chargement pendant la recherche

#### Recherche en temps réel

**Fichier** : `rechercher_par_nom_entreprise.js`

- Recherche instantanée (événement `input`)
- Recherche dans **Nom** OU **Entreprise**
- Insensible à la casse (`LOWER()`)
- Filtrage côté serveur (performances)

### 10.3 Gestion des favoris

**Principe** : Champ `Favoris` (Number) : 1 = favori, 0 = normal

```javascript
// Toggle favori
document.addEventListener('click', function(event) {
    if (event.target.classList.contains("star-button")) {
        event.target.classList.toggle("checked");
    }
});

// Enregistrement
const favoris = document.getElementById("star-btn").classList.contains("checked") ? 1 : 0;
contactData.Favoris = favoris;
```

### 10.4 Système de relances

**Champs** :
- `Date de relance` (Date)
- `Statut de relance` (Single select)

**Workflow** :
1. Définir une date de relance
2. Choisir un statut (À relancer, Fait)
3. Filtrer les contacts par statut
4. Visualiser les relances à venir

---

## 11. Validation des formulaires

### 11.1 Validation en temps réel

**Fichier** : `validation-listeners.js`

```javascript
function attachValidationListeners() {
    // Validation sur blur (perte de focus)
    document.getElementById('nom')?.addEventListener('blur', function() {
        const errors = validateNom(this.value.trim(), 'nom');
        showFieldError('nom', errors);
    });
    
    // Validation sur change (pour les selects)
    document.getElementById('type-contact')?.addEventListener('change', function() {
        const errors = validateTypeContact(this.value);
        showFieldError('type-contact', errors);
    });
}
```

### 11.2 Validation à la soumission

**Fichier** : `outils.js` → `getContactFormData()`

```javascript
function getContactFormData(photoUrl) {
    // Récupération et nettoyage
    const nom = sanitizeInput(document.getElementById("nom").value.trim());
    
    // Validation
    let hasErrors = false;
    
    const nomErrors = validateNom(nom, "nom");
    if (!showFieldError("nom", nomErrors)) hasErrors = true;
    
    // ... autres champs
    
    // Si erreurs => modal + exception
    if (hasErrors) {
        document.getElementById("erreur-Modulo").classList.add("show");
        throw new Error("Validation failed");
    }
    
    // Retour des données validées
    return { Nom: nom, Prénom: prenom, /* ... */ };
}
```

### 11.3 Sécurité des entrées

**Fichier** : `validation.js`

#### Nettoyage (Sanitization)

```javascript
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/[<>]/g, '') // Retirer < et >
        .substring(0, 200);    // Limiter longueur
}
```

#### Détection SQL Injection

```javascript
function containsSQLInjection(input) {
    const sqlPatterns = [
        /(\bOR\b.*=.*)/i,
        /(\bAND\b.*=.*)/i,
        /(\bUNION\b.*\bSELECT\b)/i,
        /(\bDROP\b.*\bTABLE\b)/i,
        /--/,
        /;.*--/
    ];
    return sqlPatterns.some(pattern => pattern.test(input));
}
```

#### Détection XSS

```javascript
function containsXSS(input) {
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
    ];
    return xssPatterns.some(pattern => pattern.test(input));
}
```

#### Échappement HTML

```javascript
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
```

### 11.4 Règles de validation

|      Champ       |                               Règles                                  |
|------------------|-----------------------------------------------------------------------|
| **Nom/Prénom**   | 2-50 caractères, lettres + espaces/tirets/apostrophes, pas de SQL/XSS |
| **Email**        | Format email valide, max 100 caractères                               |
| **Téléphone**    | 10-15 chiffres, peut contenir espaces/tirets/+/()                     |
| **Entreprise**   | 2-100 caractères, pas de SQL/XSS                                      |
| **Note**         | Max 500 caractères, pas de SQL/XSS                                    |
| **Username**     | 3-20 caractères, alphanumériques + _                                  |
| **Password**     | Min 8 caractères, 1 majuscule, 1 chiffre                              |
| **Type contact** | Valeur dans liste prédéfinie                                          |
| **Statut**       | Valeur dans liste prédéfinie                                          |
| **Date**         | Format ISO valide, optionnel                                          |

---

## 12. Interface utilisateur

### 12.1 Design responsive

- **Framework** : Bootstrap 5
- **Breakpoints** :
    - Mobile : < 768px
    - Tablette : 768px - 992px
    - Desktop : > 992px

### 12.2 Composants principaux

#### Navbar dynamique

- Affichage conditionnel selon état connecté
- Menu burger sur mobile
- Nom d'utilisateur affiché quand connecté

#### Cartes de contacts

```html
<div class="contact-card">
    <img src="photo.jpg" class="profile-photo">
    <h5>Nom Prénom</h5>
    <p>Type de contact</p>
    <p>Statut de relance</p>
    <button class="star-button">⭐</button>
</div>
```

#### Accordéons alphabétiques

- Un accordéon par lettre (A-Z)
- Regroupement automatique des contacts
- Premier accordéon ouvert par défaut

#### Modales

- **Confirmation** : avant modification/suppression
- **Succès** : après action réussie
- **Erreur** : en cas de problème
- **Photo** : upload/modification photo

#### Spinners de chargement

```html
<button disabled>
    <span class="spinner-border spinner-border-sm me-2"></span>
    Chargement...
</button>
```

### 12.3 UX/UI

- **Feedback visuel** immédiat (validation temps réel)
- **Messages d'erreur** contextuels et clairs
- **Confirmations** avant actions critiques
- **États de chargement** (spinners, disabled buttons)
- **Navigation intuitive** (breadcrumb, retour arrière)
- **Accessibilité** (ARIA labels, contraste, focus)

---

## 13. Sécurité et bonnes pratiques

### 13.1 Sécurité

#### Implémenté

- **Hashage des mots de passe** (SHA-256)
- **Validation des entrées** (sanitization, détection SQL/XSS)
- **Échappement HTML** pour l'affichage
- **Isolation des données** (filtrage par user_id)
- **Clés API** non versionnées (`.gitignore`)
- **HTTPS** pour les APIs externes
- **Confirmations** avant actions critiques

#### Limitations (architecture front-end)

- **Clés API exposées** dans le code client
- **Pas de vérification serveur** des permissions
- **Sessions côté client** (sessionStorage)
- **Hashage côté client** (SHA-256 non salé)

#### Recommandations pour production

1. **Backend Node.js/PHP**
    - Hashage bcrypt/Argon2 côté serveur
    - JWT pour les sessions
    - Validation serveur

2. **Variables d'environnement**
    - Clés API côté serveur uniquement
    - `.env` + `.gitignore`

3. **Base de données sécurisée**
    - Permissions Airtable restrictives
    - Ou migration vers PostgreSQL/MySQL

4. **HTTPS**
    - Certificat SSL/TLS
    - Redirection HTTP → HTTPS

### 13.2 Bonnes pratiques

#### Code

-  Séparation des responsabilités (modules)
-  Fonctions réutilisables (`outils.js`)
-  Nommage explicite des variables
-  Commentaires en français
-  Gestion d'erreur avec try/catch
-  Async/await pour les requêtes

#### Performance

-  Chargement lazy des images
-  Filtrage côté serveur (Airtable)
-  Mise en cache des données (possible amélioration)
-  Minification CSS/JS (en production)

#### Accessibilité

-  Textes alternatifs pour images
-  Labels pour formulaires
-  Navigation au clavier
-  Contraste suffisant
-  ARIA attributes

---

## 14. Guide de déploiement

### 14.1 Préparation

1. **Vérifier** que toutes les clés API sont dans `config.js`
2. **Tester** en local avec tous les navigateurs
3. **Optimiser** les images
4. **Minifier** CSS/JS (optionnel)


### 14.2 Déploiement sur GitHub Pages

```bash
# 1. Créer un repo GitHub
# 2. Push le code
git add .
git commit -m "Initial commit"
git push origin main

# 3. Activer GitHub Pages
# Settings → Pages → Source: main branch
```

**Attention** : GitHub Pages expose les fichiers publiquement, y compris `config.js`. Utiliser des variables d'environnement avec un backend pour la production.

---

## 15. Maintenance et évolutions

### 15.1 Améliorations court terme

- [ ] **Export CSV/PDF** des contacts
- [ ] **Recherche avancée** (plusieurs critères)
- [ ] **Pagination** pour grandes listes
- [ ] **Tri** par différents champs (date, entreprise)
- [ ] **Statistiques** (nombre de contacts par type)
- [ ] **Notifications** de relance
- [ ] **Import CSV** de contacts

### 15.2 Évolutions moyen terme

- [ ] **Backend Node.js/Express**
    - API REST sécurisée
    - Authentification JWT
    - Hashage bcrypt

- [ ] **Base de données relationnelle**
    - Migration Airtable → PostgreSQL/MySQL
    - Modèle de données optimisé

- [ ] **Gestion des rôles**
    - Admin vs User
    - Permissions granulaires

- [ ] **Mode hors ligne**
    - Service Worker
    - IndexedDB
    - Synchronisation

### 15.3 Évolutions long terme

- [ ] **Application mobile** (React Native/Flutter)
- [ ] **Intégrations externes**
    - Google Calendar (relances)
    - Gmail (envoi emails)
    - LinkedIn (import contacts)

- [ ] **Analytics**
    - Suivi des interactions
    - Tableaux de bord
    - Rapports personnalisés

- [ ] **IA et automatisation**
    - Suggestions de relances
    - Classification automatique
    - Détection de doublons

### 15.4 Maintenance

#### Mises à jour régulières

- **Dépendances** : Bootstrap, librairies
- **APIs** : Airtable, Cloudinary
- **Sécurité** : patches de vulnérabilités

#### Monitoring

- **Logs** des erreurs
- **Performance** (temps de chargement)
- **Usage** (pages les plus visitées)

#### Backup

- **Export Airtable** régulier
- **Sauvegarde images** Cloudinary
- **Versioning Git**

---

## 16. Ressources et références

### Documentation officielle

- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Outils

- [Postman](https://www.postman.com/) - Tests API
- [Figma](https://www.figma.com/) - Design UI/UX
- [VS Code](https://code.visualstudio.com/) - Éditeur de code
- [Git](https://git-scm.com/) - Versioning

### Tutoriels et guides

- [Async/Await Tutorial](https://javascript.info/async-await)
- [Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Bootstrap Components](https://getbootstrap.com/docs/5.3/components/)

### Sécurité

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

## Contact et support

**Auteur :** Klaudia Juhasz  
**Email :** [juklau83@gmail.com]  
**GitHub :** [[github.com/juklau/Mini_CRM ](https://github.com/juklau/Mini_CRM.git)]
**Projet pédagogique** : BTS SIO SLAM – Réalisation Professionnelle

---

## Licence

Ce projet est développé dans un cadre pédagogique (BTS SIO).  
Utilisation libre pour l'apprentissage et la formation.

---

**Dernière mise à jour** : Janvier 2025  