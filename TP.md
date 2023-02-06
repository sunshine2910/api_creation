# Tps

## TP1 : Gestion Format
- Transformer la gestion des formats en middleware **negociate_format**.
- Appliquer la fonction render à toutes les routes de User.
- Faire en sorte de pouvoir configurer les formats autorisés grâce à un objet de paramétrage.
```js
app.use(negociate_format({
    formats: ["application/json", "text/csv"]
}));
```

## TP2 : Gestion Version

- Gérer le versioning des routes au niveau d'un middleware.
- Faire en sorte de pouvoir configurer les versions autorisés grâce à un objet de paramétrage.
- Il faut s'assurer que la value de l'objet est de type **Router**
```js
const routerV1 = require('./routes/v1/users.js');
const routerV2 = require('./routes/v2/users.js');
app.use("/users", apiVersions({
    v1: routerV1,
    v2: routerV2,
}));
```
