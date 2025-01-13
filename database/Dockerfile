# Utiliser l'image officielle MariaDB
FROM mariadb:10.5

# Meilleure pratique : Déclarer les variables d'environnement au lieu de hardcoder
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=mydatabase
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=mypassword

# Copier le script SQL d'initialisation dans le répertoire dédié de MariaDB
COPY ./init.sql /docker-entrypoint-initdb.d/

# Meilleure pratique : Utiliser un volume pour persister les données
VOLUME /var/lib/mysql

# Exposer le port MariaDB par défaut
EXPOSE 3306

# Meilleure pratique : Utiliser CMD pour le processus principal du conteneur
CMD ["mysqld"]
