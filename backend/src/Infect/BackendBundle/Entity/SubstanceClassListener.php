<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
// for doctrine 2.4: Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Infect\BackendBundle\Entity\SubstanceClass;

use Doctrine\ORM\Query;

class SubstanceClassListener implements EventSubscriber
{

    private $em;
    private $entity;

    public function getSubscribedEvents()
    {
        return array(
            'prePersist',
            'postLoad',
            'preRemove',
            'preUpdate',
        );
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        if($this->initData($args))
        {

            $offset = $this->entity->getParent() ? $this->entity->getParent()->getLft() : 0;

            $conn = $this->em->getConnection();

            $conn->executeUpdate('UPDATE substanceClass SET lft = lft + 2 WHERE lft > ?', array($offset));
            $conn->executeUpdate('UPDATE substanceClass SET rgt = rgt + 2 WHERE rgt > ?', array($offset));

            $this->entity->setLft($offset + 1);
            $this->entity->setRgt($offset + 2);

        }
    }

    public function postLoad(LifecycleEventArgs $args)
    {
        if($this->initData($args))
        {

            $parentId = $this->em->getConnection()->executeQuery("

                SELECT parent.id
                  FROM substanceClass node, substanceClass parent
                    WHERE parent.lft < node.lft
                      AND parent.rgt > node.rgt
                      AND node.id = ?
                  ORDER BY parent.lft DESC
                  LIMIT 1

            ", array($this->entity->getId()))->fetch()['id'];

            if($parentId)
            {
                $this->entity->setParent($this->em->getRepository('InfectBackendBundle:SubstanceCLass')->find($parentId));
            }

        }
    }

    public function preRemove(LifecycleEventArgs $args)
    {
        if($this->initData($args))
        {
            
            $conn = $this->em->getConnection();

            $conn->executeUpdate('UPDATE substanceClass SET lft = lft - 2, rgt = rgt - 2 WHERE lft > ?', array($this->entity->getRgt()));

        }
    }

    public function preUpdate(LifecycleEventArgs $args)
    {

        if($this->initData($args))
        {



        }

    }

    private function initData(LifecycleEventArgs $args)
    {
        $this->entity = $args->getEntity();

        if($this->entity instanceof SubstanceClass)
        {
            $this->em = $args->getEntityManager();

            return true;
        }

        return false;
    }

}