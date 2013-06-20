<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Genus
 *
 * @ORM\Table(name="genus")
 * @ORM\Entity
 */
class Genus
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=200, nullable=false)
     */
    private $name;

    /**
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\Species", mappedBy="genus")
     */
    private $species;

}