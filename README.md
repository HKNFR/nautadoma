# nautadoma.com

Site vitrine de **NAUTA DOMA** — courtage en opérations de banque (IOBSP niveau II)
et prises de vues par drone.

Site statique, sans build ni dépendance. Hébergé sur GitHub Pages.

## Structure

```
index.html              Accueil — les deux pôles d'activité
courtage.html           Courtage bancaire
drone.html              Prises de vues par drone
contact.html            Formulaire + coordonnées
mentions-legales.html   Mentions légales, CGV, RGPD, médiation
CNAME                   Domaine personnalisé (nautadoma.com)
assets/css/style.css    Feuille de style unique
assets/js/main.js       Menu, animations, envoi du formulaire
assets/img/             Logo, favicon, photos
```

## Logo

Le logo fourni a été détouré et décliné en quatre fichiers :

| Fichier | Usage |
|---|---|
| `logo-emblem.png` | Emblème seul (rose des vents + carrés), en-tête du site |
| `logo-complet-sombre.png` | Bloc-marque complet, texte clair — pour fonds sombres |
| `logo-complet-clair.png` | Bloc-marque complet, texte noir — pour fonds clairs, documents, signature mail |
| `favicon.png` / `apple-touch-icon.png` | Icône d'onglet et d'écran d'accueil |

Tous ont un fond transparent. Le doré du logo est `#BA8437` ; la palette du site
en reprend la teinte, éclaircie pour rester lisible sur fond sombre
(`--gold: #D9B168`, définie en haut de `style.css`).

## Modifier le site

Le site est en HTML pur : on ouvre le fichier, on change le texte, on enregistre,
on pousse. Aucune compilation.

```bash
git clone https://github.com/HKNFR/nautadoma.git
cd nautadoma
python3 -m http.server 8000   # aperçu sur http://localhost:8000
```

Pour publier :

```bash
git add -A
git commit -m "Mise à jour du contenu"
git push
```

GitHub Pages redéploie automatiquement en une à deux minutes.

## À faire

### 1. Activer le formulaire de contact

Le formulaire fonctionne actuellement en repli : il ouvre le logiciel de messagerie
du visiteur. Pour recevoir les demandes directement par e-mail :

1. créer un compte gratuit sur [formspree.io](https://formspree.io) ;
2. créer un formulaire, récupérer son identifiant ;
3. dans `contact.html`, remplacer `VOTRE_ID` dans l'attribut `action`.

### 2. Ajouter les photos et vidéos drone

Déposer les fichiers dans `assets/img/`, puis dans `drone.html` remplacer chaque
bloc `<figure class="media">` par :

```html
<figure class="media" style="margin:0">
  <img src="assets/img/mon-image.jpg" alt="Description de l'image">
</figure>
```

Formats conseillés : JPEG de 1600 px de large environ, moins de 400 Ko par image.

### 3. Compléter les mentions drone

Vérifier et compléter dans `mentions-legales.html` les références liées à
l'activité de prises de vues aériennes (enregistrement exploitant, attestation
de télépilote, assurance responsabilité civile).

## Domaine

`nautadoma.com` — enregistré chez OVH. Les enregistrements DNS pointent vers
GitHub Pages ; le fichier `CNAME` à la racine du dépôt doit rester en place.
