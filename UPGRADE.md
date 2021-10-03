# Mise a jour de sentry


## Mise a jour du repo depuis celui de Sentry

Pour récupérer les dernières modifications depuis le repository github de sentry, il est nécessaire d'exécuter les commandes suitantes :

```sh
git remote add json https://github.com/getsentry/onpremise.git
git pull json master
git push origin master
```

## Déploiement

Le push précédent devrais déclencher le webhook, et la nouvelle version de sentry se déployer de manière automatique.

## Points d'attention
### sentry.conf.py
SENTRY_SINGLE_ORGANIZATION = True

### config.yml
Config Slack