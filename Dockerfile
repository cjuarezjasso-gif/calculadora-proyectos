# Usa la imagen base de PHP con Apache
FROM php:8.2-apache

# Instala la extensión MySQLi y la extensión PDO de MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilita el módulo de reescritura de Apache
RUN a2enmod rewrite

# Permite que Apache sirva archivos de la carpeta
WORKDIR /var/www/html