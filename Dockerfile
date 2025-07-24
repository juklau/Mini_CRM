#utilisation de l'image officielle Nginx
FROM nginx:alpine

#supprimer la config par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

#copier mon app dans le dossier web de Nginx
# il ne faut pas utiliser le COPY ici si j'utilise "volumes" dans docker-compose.yml
# ou COPY ou volumes
# COPY html/ /usr/share/nginx/html/
# COPY js/ /usr/share/nginx/html/js/

#exposer le port 80
EXPOSE 80

#lancement de Nginx en mode premier plan => sinon Nginx se lance en arrière plan
CMD ["nginx", "-g", "daemon off;"]