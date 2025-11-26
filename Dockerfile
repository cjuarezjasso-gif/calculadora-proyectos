# Usa la imagen base de PHP con Apache
FROM php:8.2-apache

# Habilita el módulo de reescritura de Apache
RUN a2enmod rewrite

# 1. Instala todo (MySQLi y herramientas)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    && docker-php-ext-install mysqli pdo pdo_mysql

# 2. Instala Composer (el manejador de paquetes de PHP)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 3. Establece el directorio de trabajo
WORKDIR /var/www/html