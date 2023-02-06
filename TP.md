# Tps

## TP1

- Transformer la gestion des formats en middleware *negociate_format*.
- Appliquer la fonction render à toutes les routes de User.
- Faire en sorte de pouvoir configurer les formats autorisés grâce à un objet de paramétrage.
```js
app.use(negociate_format({
    formats: ["application/json", "text/csv"]
}));
```