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

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->species = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Genus
     */
    public function setName($name)
    {
        $this->name = $name;
    
        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Add species
     *
     * @param \Infect\BackendBundle\Entity\Species $species
     * @return Genus
     */
    public function addSpecie(\Infect\BackendBundle\Entity\Species $species)
    {
        $this->species[] = $species;
    
        return $this;
    }

    /**
     * Remove species
     *
     * @param \Infect\BackendBundle\Entity\Species $species
     */
    public function removeSpecie(\Infect\BackendBundle\Entity\Species $species)
    {
        $this->species->removeElement($species);
    }

    /**
     * Get species
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getSpecies()
    {
        return $this->species;
    }
}