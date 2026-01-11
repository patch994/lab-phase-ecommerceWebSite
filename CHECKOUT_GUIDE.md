# Guide du Processus de Commande (Checkout)

Ce guide détaille le processus de commande avec paiement à la livraison (COD) implémenté dans l'application.

## Flux Utilisateur

### 1. Parcours Catalogue → Panier → Checkout → Confirmation

```
Produits (/") → Panier (/cart) → Checkout (/checkout) → Confirmation (/order-confirmation/:id)
```

## Page Checkout (/checkout)

### Sections Principales

#### 1. Résumé de la Commande (Sidebar)
Affiche en temps réel :
- Liste des articles avec images, noms et quantités
- Sous-total des produits
- Frais de livraison (30 DH)
- Total final en Dirhams marocains (DH)

#### 2. Formulaire de Livraison

**Champs Obligatoires** (marqués par *) :
- **Nom complet** : Nom du destinataire
- **Numéro de téléphone** : Formats acceptés
  - `+212612345678` (international avec +)
  - `212612345678` (international sans +)
  - `0612345678` (format local)
  - Doit commencer par 5, 6 ou 7 après l'indicatif
- **Adresse de livraison** : Adresse complète (rue, numéro, quartier)
- **Ville** : Dropdown avec les principales villes du Maroc

**Champs Optionnels** :
- **Code postal** : Code postal de la zone de livraison
- **Email** : Pour recevoir des notifications (recommandé)

#### 3. Méthode de Paiement

Une seule option disponible :
- **Paiement à la livraison (COD)**
- Message informatif : "Vous paierez au livreur lors de la réception"

#### 4. Actions

- **Retour au panier** : Modifier les articles avant de commander
- **Confirmer la commande** : Lance le processus de création de commande

### Validation Frontend

Les validations suivantes sont effectuées :
1. **Tous les champs obligatoires** sont remplis
2. **Numéro de téléphone marocain** valide
3. **Email valide** (si fourni)
4. **Ville sélectionnée** dans la liste

### Modal de Confirmation

Avant de créer la commande, un modal de confirmation affiche :
- Nom du client
- Numéro de téléphone
- Adresse complète
- Montant total à payer

Actions :
- **Annuler** : Retour au formulaire
- **Confirmer** : Création de la commande

## Traitement Backend

### Endpoint : POST /api/checkout

**Requête** :
```json
{
  "customer_name": "Ahmed Benali",
  "customer_phone": "+212612345678",
  "customer_address": "123 Rue Mohammed V, Quartier Maarif",
  "city": "Casablanca",
  "postal_code": "20000",
  "email": "ahmed@example.com",
  "sessionId": "session_xyz123"
}
```

### Processus de Création de Commande

1. **Validation des données**
   - Vérification des champs obligatoires
   - Validation du format du téléphone marocain

2. **Vérification du panier**
   - Le panier ne doit pas être vide
   - Tous les produits doivent exister

3. **Vérification du stock**
   - Pour chaque article, vérifier que `stock >= quantité`
   - Si insuffisant, retourner une erreur avec le stock disponible

4. **Calcul des montants**
   - Sous-total = Σ (prix × quantité)
   - Taxes = sous-total × taux de taxe (actuellement 0)
   - Total = sous-total + taxes + frais de livraison

5. **Création de la commande** (Transaction)
   - Générer un numéro de commande unique (format: `ORDYYMMDDXXXX`)
   - Créer l'enregistrement Order
   - Créer les OrderItems
   - Déduire les quantités du stock
   - Vider le panier

6. **Réponse**
   - Retourner les détails de la commande
   - Frontend redirige vers la page de confirmation

### Gestion des Erreurs

Erreurs possibles :
- `400` : Champs obligatoires manquants
- `400` : Numéro de téléphone invalide
- `400` : Panier vide
- `400` : Stock insuffisant pour un produit
- `500` : Erreur serveur

Exemple de réponse d'erreur :
```json
{
  "success": false,
  "message": "Stock insuffisant pour Smartphone Samsung Galaxy A54. Stock disponible: 5"
}
```

## Page de Confirmation (/order-confirmation/:orderId)

### Sections Affichées

#### 1. En-tête de Confirmation
- Icône de succès ✓
- Message de confirmation
- Information sur le contact téléphonique

#### 2. Informations de Commande
- **Numéro de commande** : Identifiant unique
- **Date** : Date et heure de la commande
- **Statut** : "En attente"
- **Méthode de paiement** : COD

#### 3. Informations de Livraison
- Nom du destinataire
- Numéro de téléphone
- Email (si fourni)
- Adresse complète avec ville et code postal

#### 4. Articles Commandés
Liste détaillée avec :
- Image du produit
- Nom du produit
- Quantité × Prix unitaire
- Prix total par article

#### 5. Résumé du Paiement
- Sous-total
- Taxes (si applicable)
- Frais de livraison
- **Total à payer au livreur** (mis en évidence)

#### 6. Prochaines Étapes
Boîte d'information avec :
- Contact téléphonique dans les prochaines heures
- Vérification de l'adresse
- Préparation et expédition
- Paiement au livreur

### Actions Disponibles
- **Retour au catalogue** : Continuer les achats

## Fonctionnalités Techniques

### Gestion du Panier
- **SessionId** : Identifiant unique stocké dans localStorage
- **Persistance** : Le panier persiste entre les sessions
- **Vidage automatique** : Le panier est vidé après commande réussie

### Gestion du Stock
- **Vérification temps réel** : Avant ajout au panier
- **Vérification pré-commande** : Avant création de la commande
- **Mise à jour atomique** : Stock déduit dans une transaction

### Formatage des Prix
- Format : `XXXX.XX DH`
- Exemple : `3499.00 DH`
- Utilise la fonction `formatPriceDH()` pour la cohérence

### Génération de Numéro de Commande
Format : `ORDYYMMDDXXXX`
- `ORD` : Préfixe
- `YY` : Année (2 chiffres)
- `MM` : Mois (2 chiffres)
- `DD` : Jour (2 chiffres)
- `XXXX` : Nombre aléatoire (4 chiffres)

Exemple : `ORD24011210001`

## Responsive Design

L'interface s'adapte aux différents écrans :

### Desktop (>968px)
- Layout en 2 colonnes (formulaire + résumé)
- Résumé sticky lors du défilement

### Mobile (<968px)
- Layout en 1 colonne
- Résumé en haut
- Formulaire dessous
- Boutons pleine largeur

## Tests

### Test Manuel

1. Ajouter des produits au panier
2. Aller à la page checkout
3. Remplir le formulaire avec :
   - Nom : Test User
   - Téléphone : +212612345678
   - Adresse : 123 Test Street
   - Ville : Casablanca
4. Confirmer la commande
5. Vérifier la page de confirmation

### Test des Validations

**Téléphone invalide** :
- `0912345678` → Erreur (doit commencer par 5, 6 ou 7)
- `+212412345678` → Erreur (doit commencer par 5, 6 ou 7)
- `061234567` → Erreur (trop court)

**Téléphone valide** :
- `+212612345678` ✓
- `0612345678` ✓
- `212612345678` ✓

### Test du Stock

1. Créer une commande avec une grande quantité
2. Vérifier que le stock est mis à jour
3. Essayer de commander plus que le stock disponible
4. Vérifier le message d'erreur avec le stock disponible

## API Reference

### Créer une Commande
```
POST /api/checkout
Content-Type: application/json

{
  "customer_name": string (required),
  "customer_phone": string (required, Moroccan format),
  "customer_address": string (required),
  "city": string (required),
  "postal_code": string (optional),
  "email": string (optional),
  "sessionId": string (required)
}
```

### Récupérer une Commande
```
GET /api/checkout/order/:orderId
```

### Réponse Succès
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

## Sécurité

### Côté Backend
- Validation stricte des données
- Transactions SQL pour l'intégrité
- Vérification du stock avant commit
- Nettoyage des données (trim, format)

### Côté Frontend
- Validation avant soumission
- Confirmation avant création
- Messages d'erreur clairs
- Désactivation des boutons pendant le traitement

## Améliorations Futures

1. **Authentification utilisateur**
   - Sauvegarde automatique des informations
   - Historique des commandes

2. **Notifications**
   - Email de confirmation
   - SMS de confirmation
   - Suivi de livraison

3. **Gestion des commandes**
   - Panel admin
   - Mise à jour du statut
   - Gestion des livraisons

4. **Paiement en ligne**
   - Intégration de passerelles de paiement
   - Options de paiement multiples

5. **Calcul dynamique des frais de livraison**
   - Basé sur la ville
   - Basé sur le poids/volume
