# Usa la imagen base de PHP súper estable
FROM php:8.2-apache-bullseye

# Habilita el módulo de reescritura de Apache
RUN a2enmod rewrite

# 1. Instala herramientas básicas y librerías necesarias para Oracle
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libaio1 \
    && rm -rf /var/lib/apt/lists/*

# 2. Descarga e instala Oracle Instant Client (El "traductor" de Oracle)
RUN mkdir -p /opt/oracle \
    && curl -o /opt/oracle/instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/1920000/instantclient-basiclite-linux.x64-19.20.0.0.0dbru.zip \
    && curl -o /opt/oracle/sdk.zip https://download.oracle.com/otn_software/linux/instantclient/1920000/instantclient-sdk-linux.x64-19.20.0.0.0dbru.zip \
    && unzip /opt/oracle/instantclient.zip -d /opt/oracle/ \
    && unzip /opt/oracle/sdk.zip -d /opt/oracle/ \
    && rm /opt/oracle/*.zip \
    && echo /opt/oracle/instantclient_19_20 > /etc/ld.so.conf.d/oracle-instantclient.conf \
    && ldconfig

# 3. Instala y activa OCI8 (La extensión de PHP para Oracle)
RUN docker-php-ext-configure oci8 --with-oci8=instantclient,/opt/oracle/instantclient_19_20 \
    && docker-php-ext-install oci8

# 4. Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# 5. Establece el directorio de trabajo
WORKDIR /var/www/html