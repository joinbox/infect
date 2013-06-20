<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Species
 *
 * @ORM\Table(name="species")
 * @ORM\Entity
 */
class Species
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
     * @var \Infect\BackendBundle\Entity\Genus
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Genus")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_genus", referencedColumnName="id")
     * })
     */
    private $genus;

    /**
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\Bacteria" mappedBy="species")
     */
    private $bacterias;

}