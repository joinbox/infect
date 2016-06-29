#!/usr/bin/env bash

# php composer.phar install --optimize-autoloader
php app/console cache:clear --env=prod --no-debug
php app/console cache:warmup --env=prod --no-debug
php app/console assetic:dump --env=prod --no-debug
# php app/console doctrine:schema:update --force
