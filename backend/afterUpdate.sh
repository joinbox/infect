#!/usr/bin/env bash

php composer.phar update
php app/console cache:clear
php app/console assets:install
php app/console assetic:dump --env=dev
php app/console doctrine:schema:update --force