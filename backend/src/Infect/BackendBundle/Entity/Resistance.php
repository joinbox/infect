<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Bacterianame
 *
 * @ORM\Table(name="bacteria_compound", uniqueConstraints={@ORM\UniqueConstraint(name="bacteria_compound_idx", columns={"id_bacteria", "id_compound"})})
 * @ORM\Entity
 */
class Resistance
{

    /**
     * @var \Infect\BackendBundle\Entity\Bacteria
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Bacteria")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_bacteria", referencedColumnName="id")
     * })
     */
    private $bacteria;

    /**
     * @var \Infect\BackendBundle\Entity\Compound
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Compound")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_compound", referencedColumnName="id")
     * })
     */
    private $compound;

    /**
     *
     * @ORM\Column(name="resistanceUser", type="integer", length=100, nullable=true)
     */
    private $resistanceUser;

     /**
     *
     * @ORM\Column(name="resistanceImport", type="integer", length=100, nullable=true)
     */
    private $resistanceImport;

    /**
     *
     * @ORM\Column(name="resistanceDefault", type="integer", length=1, nullable=true)
     */
    private $resistanceDefault;

    /**
     * Constructor
     */
    public function __construct()
    {
    }



    /**
     * Set resistanceUser
     *
     * @param integer $resistanceUser
     * @return Resistance
     */
    public function setResistanceUser($resistanceUser)
    {
        $this->resistanceUser = $resistanceUser;
    
        return $this;
    }

    /**
     * Get resistanceUser
     *
     * @return integer 
     */
    public function getResistanceUser()
    {
        return $this->resistanceUser;
    }

    /**
     * Set resistanceImport
     *
     * @param integer $resistanceImport
     * @return Resistance
     */
    public function setResistanceImport($resistanceImport)
    {
        $this->resistanceImport = $resistanceImport;
    
        return $this;
    }

    /**
     * Get resistanceImport
     *
     * @return integer 
     */
    public function getResistanceImport()
    {
        return $this->resistanceImport;
    }

    /**
     * Set resistanceDefault
     *
     * @param integer $resistanceDefault
     * @return Resistance
     */
    public function setResistanceDefault($resistanceDefault)
    {
        $this->resistanceDefault = $resistanceDefault;
    
        return $this;
    }

    /**
     * Get resistanceDefault
     *
     * @return integer 
     */
    public function getResistanceDefault()
    {
        return $this->resistanceDefault;
    }

    /**
     * Set bacteria
     *
     * @param \Infect\BackendBundle\Entity\Bacteria $bacteria
     * @return Resistance
     */
    public function setBacteria(\Infect\BackendBundle\Entity\Bacteria $bacteria)
    {
        $this->bacteria = $bacteria;
    
        return $this;
    }

    /**
     * Get bacteria
     *
     * @return \Infect\BackendBundle\Entity\Bacteria 
     */
    public function getBacteria()
    {
        return $this->bacteria;
    }

    /**
     * Set compound
     *
     * @param \Infect\BackendBundle\Entity\Compound $compound
     * @return Resistance
     */
    public function setCompound(\Infect\BackendBundle\Entity\Compound $compound)
    {
        $this->compound = $compound;
    
        return $this;
    }

    /**
     * Get compound
     *
     * @return \Infect\BackendBundle\Entity\Compound 
     */
    public function getCompound()
    {
        return $this->compound;
    }
}