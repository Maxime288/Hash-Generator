# #️⃣ Hash Generator

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Licence](https://img.shields.io/badge/Licence-MIT-blue)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20local-green)

> Générateur et comparateur de hash cryptographiques — MD5, SHA-1, SHA-256, SHA-512.
> Entièrement côté client, sans serveur, sans envoi de données, en local.

---

## Fonctionnalités

- **Génération instantanée** — les 4 algorithmes calculés en temps réel à chaque frappe
- **Comparaison de hash** — vérifie qu'un texte correspond à une empreinte connue
- **100% local** — tout s'exécute dans le navigateur via la Web Crypto API native
- **Copie en un clic** — chaque hash est copiable directement dans le presse-papiers
- **Fiche pédagogique** — explication de chaque algorithme, son état de sécurité et ses usages
- **Design sombre** — interface propre et lisible, responsive mobile

---

## Algorithmes supportés

| Algorithme | Taille | État | Usage recommandé |
|---|---|---|---|
| MD5 | 128 bits / 32 chars | 🔴 Obsolète | Cache non-critique uniquement |
| SHA-1 | 160 bits / 40 chars | 🟠 Déprécié | À éviter (migrer) |
| SHA-256 | 256 bits / 64 chars | 🟢 Recommandé | Tout usage général |
| SHA-512 | 512 bits / 128 chars | 🔵 Haute sécurité | Applications critiques |

---

## Installation

Aucune dépendance, aucun build nécessaire. Clonez et ouvrez directement dans un navigateur :

```bash
git clone https://github.com/Maxime288/Hash-Generator.git
cd Hash-Generator
# Ouvrir index.html dans votre navigateur
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

---

## Structure du projet

```
Hash-Generator/
├── index.html   ← Structure HTML et interface
├── style.css    ← Styles (thème sombre, responsive)
├── hash.js      ← Logique : MD5, SHA via Web Crypto API, UI
└── README.md
```

---

## Implémentation technique

### Web Crypto API (SHA-1, SHA-256, SHA-512)

Les algorithmes SHA sont calculés via l'API native du navigateur, sans bibliothèque externe :

```javascript
async function sha(text, algo) {
  const encoded = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

### MD5

MD5 est implémenté en JavaScript pur (l'API Web Crypto ne le supporte pas, car il est considéré comme non sécurisé).

### Pourquoi tout côté client ?

- **Confidentialité** : aucune donnée ne quitte l'appareil de l'utilisateur
- **Rapidité** : pas de latence réseau
- **Disponibilité** : fonctionne hors ligne

---

## Auteur

**Maxime288** — [github.com/Maxime288](https://github.com/Maxime288)

---

*⭐ Si ce projet t'a été utile, n'hésite pas à laisser une étoile !*
