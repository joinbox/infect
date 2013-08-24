#!/usr/bin/env bash

php app/console generate:doctrine:crud --entity=InfectBackendBundle:Bacteria --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:BacteriaLocale --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Compound --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:CompoundLocale --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Country --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Diagnosis --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:DiagnosisLocale --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Drug --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:DrugLocale --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Genus --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Grouping --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:GroupingLocale --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Language --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Shape --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:ShapeLocale --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Species --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Substance --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:SubstanceClass --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:SubstanceClassLocale --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:SubstanceLocale --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Therapy --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:TherapyLocale --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:Topic --format=yml --with-write --no-interaction
php app/console generate:doctrine:crud --entity=InfectBackendBundle:TopicLocale --format=yml --with-write --no-interaction