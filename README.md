# Kaptur - Extension Chrome pour Google Meet

## Fonctionnalités
- Capture automatique d'écran toutes les 5 minutes
- Suivi des participants en temps réel
- Archivage des messages du chat
- Export rapport PDF prêt à imprimer

## Installation
1. Ouvrir `chrome://extensions/`
2. Activer \"Mode développeur\"
3. Cliquer \"Charger l'extension non empaquetée\"
4. Sélectionner le dossier `KAPTUR`

## Utilisation
1. Rejoindre une réunion Google Meet
2. Cliquer l'icône Kaptur → \"Démarrer\"
3. Captures auto toutes 5min
4. \"Exporter PDF\" pour rapport complet
5. \"Arrêter\" quand fini

## Structure fichiers
```
KAPTUR/
├── manifest.json      (configuration)
├── background.js      (alarmes & captures)
├── content.js         (extraction DOM Meet)
├── popup.html/js/css  (interface)
├── rapport_final.html (rapport PDF)
├── assets/            (icônes kaptur.png)
└── README.md
```

## Tests
- Vérifier console extension (F12 → Extensions)
- Captures stockées en base64 dans chrome.storage.local
- Rapport affiche screenshots/participants/chat

Extension prête pour publication Chrome Web Store.

