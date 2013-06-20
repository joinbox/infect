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
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\Bacteria", mappedBy="species")
     */
    private $bacterias;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->bacterias = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return Species
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
     * Set genus
     *
     * @param \Infect\BackendBundle\Entity\Genus $genus
     * @return Species
     */
    public function setGenus(\Infect\BackendBundle\Entity\Genus $genus = null)
    {
        $this->genus = $genus;
    
        return $this;
    }

    /**
     * Get genus
     *
     * @return \Infect\BackendBundle\Entity\Genus 
     */
    public function getGenus()
    {
        return $this->genus;
    }

    /**
     * Add bacterias
     *
     * @param \Infect\BackendBundle\Entity\Bacteria $bacterias
     * @return Species
     */
    public function addBacteria(\Infect\BackendBundle\Entity\Bacteria $bacterias)
    {
        $this->bacterias[] = $bacterias;
    
        return $this;
    }

    /**
     * Remove bacterias
     *
     * @param \Infect\BackendBundle\Entity\Bacteria $bacterias
     */
    public function removeBacteria(\Infect\BackendBundle\Entity\Bacteria $bacterias)
    {
        $this->bacterias->removeElement($bacterias);
    }

    /**
     * Get bacterias
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getBacterias()
    {
        return $this->bacterias;
    }
}