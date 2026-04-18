# Kaptur : Solution de monitoring et de recensement pour Google Meet

Kaptur est une extension de navigateur basée sur l'architecture Manifest V3, conçue pour automatiser la gestion des comptes-rendus de réunions sur Google Meet. Elle permet un suivi précis des participants, l'archivage des discussions et la capture visuelle périodique de l'espace de travail.

## Fonctionnalités Principales

* Recensement des participants : Extraction automatisée des noms et prénoms via l'observation dynamique du DOM (MutationObserver).
* Capture d'écran périodique : Prise de vue automatique de l'onglet actif toutes les 5 minutes via l'API des alarmes du navigateur.
* Archivage du Chat : Enregistrement chronologique des messages, incluant l'auteur et l'horodatage.
* Exportation de données : Génération d'un rapport de synthèse au format HTML (optimisé pour une impression PDF) et d'un export de présence au format CSV.

## Spécifications Techniques

L'extension a été développée en respectant les standards de sécurité et de performance de l'écosystème Chromium :

* Manifest V3 : Utilisation des Service Workers pour la gestion des processus en arrière-plan.
* DOM Scraping Résilient : Utilisation de sélecteurs robustes basés sur les attributs de données pour pallier les mises à jour fréquentes des classes CSS de Google Meet.
* Gestion du stockage : Utilisation de chrome.storage.local avec la permission unlimitedStorage pour la persistance des données lourdes (images encodées en Base64).
* Interface Utilisateur : Développement d'un tableau de bord minimaliste avec Tailwind CSS.

## Structure fichiers
```
KAPTUR/
├── manifest.json      (Configuration, permissions et points d'entrée)
├── background.js      (Service worker : gestionnaire d'alarmes et captures)
├── content.js         (Script d'injection : extraction et observation du DOM)
├── popup.js           (Logique de gestion de l'interface)
├── popup.html         (Interface de contrôle)
├── popup.css          (Définitions graphiques)
├── rapport_final.html (Modèle de génération du rapport final)
├── assets/            (icônes kaptur.png)
└── README.md          (Documentation technique)
```

## Procédure d'Installation

L'installation de Kaptur s'effectue manuellement via le mode développeur de votre navigateur :

1.  Télécharger ou cloner le répertoire du projet sur votre machine locale.
2.  Ouvrir le gestionnaire d'extensions du navigateur en saisissant `chrome://extensions/` dans la barre d'adresse.
3.  Activer le **Mode développeur** via l'interrupteur situé en haut à droite de la page.
4.  Cliquer sur le bouton **Charger l'extension non empaquetée** (Load unpacked).
5.  Sélectionner le dossier racine contenant le fichier `manifest.json`.

## Guide d'Utilisation

L'utilisation de l'extension suit un cycle simple conçu pour ne pas perturber l'expérience de réunion :

1.  **Initialisation** : Connectez-vous à une session Google Meet.
2.  **Activation** : Cliquez sur l'icône Kaptur dans la barre d'outils et sélectionnez "Démarrer le suivi".
3.  **Surveillance** : L'extension travaille en arrière-plan. Elle recense les nouveaux participants, enregistre les messages du chat et effectue une capture visuelle toutes les 5 minutes.
4.  **Exportation** : Une fois la réunion terminée, cliquez sur "Arrêter et Exporter".
5.  **Sauvegarde PDF** : Le rapport généré s'affiche dans un nouvel onglet. Utilisez la commande système `Imprimer` (Ctrl+P) et choisissez "Enregistrer au format PDF" comme destination.

## Confidentialité et Données

La sécurité des données est une priorité de l'architecture Kaptur :

* **Traitement Local** : L'intégralité du script s'exécute sur le poste client. Aucune donnée (noms, messages ou captures) n'est transmise à des serveurs externes.
* **Gestion du Stockage** : En raison du poids des captures d'écran, les données sont stockées temporairement dans `chrome.storage.local`. Il est conseillé d'exporter le rapport en fin de session pour libérer l'espace mémoire utilisé par l'extension.
* **Permissions** : L'extension ne demande l'accès qu'aux onglets `meet.google.com` afin de garantir une stricte séparation avec vos autres activités de navigation.

## Développeur

**NANGA DITORGA (Fulbert)** Étudiant en Génie Logiciel à Lomé.  
Développeur Web & Ambassadeur GX Africa.
Contact :  contact.fulbert@gmail.com
           +228 99792179