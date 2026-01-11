# E-commerce Maroc - Plateforme avec Paiement à la Livraison (COD)

Application e-commerce complète pour le marché marocain avec support du paiement à la livraison (Cash on Delivery).

## Fonctionnalités

### Frontend
- 🛍️ **Catalogue de produits** avec affichage des stocks
- 🛒 **Panier d'achat** avec gestion des quantités
- 📋 **Page de checkout** avec formulaire de commande
- 📱 **Validation du numéro de téléphone marocain** (+212XXXXXXXXX ou 0XXXXXXXXX)
- 🏙️ **Sélection de ville** parmi les principales villes du Maroc
- 💵 **Paiement à la livraison (COD)** comme méthode de paiement unique
- ✅ **Page de confirmation** avec détails complets de la commande
- 💰 **Formatage des prix en Dirhams marocains (DH)**
- 📱 **Design responsive** pour mobile et desktop

### Backend
- 🔌 **API RESTful** avec Express.js
- 🗄️ **Base de données SQLite** avec Sequelize ORM
- ✅ **Validation des données** côté serveur
- 📦 **Vérification du stock** avant création de commande
- 🔄 **Mise à jour automatique du stock** après commande
- 🧹 **Vidage automatique du panier** après commande réussie
- 📝 **Génération de numéro de commande unique**
- 🛡️ **Gestion des erreurs** avec messages explicites

## Structure du projet

```
/
├── backend/              # API Express.js
│   ├── src/
│   │   ├── controllers/  # Logique métier
│   │   ├── models/       # Modèles Sequelize
│   │   ├── routes/       # Routes API
│   │   ├── database/     # Configuration DB
│   │   ├── utils/        # Utilitaires
│   │   └── server.js     # Point d'entrée
│   └── package.json
│
├── frontend/             # Application React
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── pages/        # Pages de l'application
│   │   ├── context/      # Context API (Panier)
│   │   ├── utils/        # Fonctions utilitaires
│   │   └── App.jsx       # Composant principal
│   └── package.json
│
└── package.json          # Scripts racine
```

## Installation

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation complète

```bash
# Cloner le repository
git clone <repository-url>
cd ecommerce-morocco

# Installer toutes les dépendances (racine, backend, frontend)
npm run install-all
```

Ou installer manuellement :

```bash
# Installer les dépendances racine
npm install

# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

## Configuration

### Backend

Créer un fichier `.env` dans le dossier `backend` :

```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
SHIPPING_FEE=30
TAX_RATE=0
```

### Initialiser la base de données

```bash
cd backend
npm run init-db
```

Cette commande va :
- Créer les tables de la base de données
- Ajouter des produits d'exemple

## Démarrage

### Développement

Depuis la racine du projet, lancer frontend et backend simultanément :

```bash
npm run dev
```

Ou séparément :

```bash
# Backend (port 5000)
npm run dev:backend

# Frontend (port 3000)
npm run dev:frontend
```

### Production

```bash
# Build frontend
npm run build

# Start backend
npm start
```

## API Endpoints

### Produits
- `GET /api/products` - Liste tous les produits en stock
- `GET /api/products/:id` - Détails d'un produit

### Panier
- `GET /api/cart?sessionId=xxx` - Récupérer le panier
- `POST /api/cart` - Ajouter un produit au panier
- `PUT /api/cart/:id` - Modifier la quantité
- `DELETE /api/cart/:id` - Supprimer un article

### Checkout
- `POST /api/checkout` - Créer une commande
- `GET /api/checkout/order/:orderId` - Détails d'une commande

## Format des données

### Créer une commande (POST /api/checkout)

```json
{
  "customer_name": "Ahmed Benali",
  "customer_phone": "+212612345678",
  "customer_address": "123 Rue Mohammed V, Quartier Maarif",
  "city": "Casablanca",
  "postal_code": "20000",
  "email": "ahmed@example.com",
  "sessionId": "session_xxx"
}
```

### Réponse

```json
{
  "success": true,
  "message": "Commande créée avec succès",
  "order": {
    "id": 1,
    "orderNumber": "ORD24011210001",
    "total": "3529.00",
    "customerName": "Ahmed Benali",
    "customerPhone": "+212612345678",
    "customerAddress": "123 Rue Mohammed V, Quartier Maarif",
    "city": "Casablanca"
  }
}
```

## Validation du numéro de téléphone marocain

L'application accepte les formats suivants :
- `+212612345678` (format international avec +)
- `212612345678` (format international sans +)
- `0612345678` (format local)

Les numéros doivent :
- Commencer par 5, 6 ou 7 (après l'indicatif)
- Contenir 9 chiffres après l'indicatif

## Villes supportées

Les principales villes du Maroc sont disponibles dans le formulaire de commande :
- Casablanca, Rabat, Fès, Marrakech, Tanger, Agadir, Meknès, Oujda, etc.

Liste complète dans `frontend/src/utils/moroccanCities.js`

## Technologies utilisées

### Backend
- **Express.js** - Framework web
- **Sequelize** - ORM pour SQLite
- **SQLite3** - Base de données
- **express-validator** - Validation des données
- **CORS** - Gestion des requêtes cross-origin

### Frontend
- **React 18** - Framework UI
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Context API** - Gestion d'état
- **Vite** - Build tool

## Fonctionnalités futures possibles

- [ ] Authentification utilisateur
- [ ] Historique des commandes
- [ ] Suivi de commande en temps réel
- [ ] Notifications par email/SMS
- [ ] Panel admin pour gérer les commandes
- [ ] Intégration avec services de livraison
- [ ] Système de notes et avis produits
- [ ] Recherche et filtrage de produits
- [ ] Wishlist
- [ ] Code promo / réductions

## Licence

MIT
