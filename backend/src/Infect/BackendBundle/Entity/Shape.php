<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Shape
 *
 * @ORM\Table(name="shape")
 * @ORM\Entity
 */
class Shape
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
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\Bacteria", mappedBy="shape")
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
     * @return Shape
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
     * Add bacterias
     *
     * @param \Infect\BackendBundle\Entity\Bacteria $bacterias
     * @return Shape
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