<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Bacterianame
 *
 * @ORM\Table(name="resistance", uniqueConstraints={@ORM\UniqueConstraint(name="bacteria_compound_idx", columns={"id_bacteria", "id_compound"})})
 * @ORM\Entity
 */
class Resistance
{

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;


    /**
     * @var \Infect\BackendBundle\Entity\Bacteria
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Bacteria")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_bacteria", referencedColumnName="id")
     * })
     */
    private $bacteria;

    /**
     * @var \Infect\BackendBundle\Entity\Compound
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Compound")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_compound", referencedColumnName="id")
     * })
     */
    private $compound;

    /**
     *
     * @ORM\Column(name="resistance_manual", type="integer", length=100, nullable=true)
     */
    private $resistance_manual;

     /**
     *
     * @ORM\Column(name="resistance_fetch", type="integer", length=100, nullable=true)
     */
    private $resistance_fetch;

    /**
     *
     * @ORM\Column(name="default_resistance", type="integer", length=1, nullable=true)
     */
    private $default_resistance;

    /**
     * Constructor
     */
    public function __construct()
    {
    }

    /**
     * @param mixed $default_resistance
     */
    public function setDefaultResistance($default_resistance)
    {
        $this->default_resistance = $default_resistance;
    }

    /**
     * @return mixed
     */
    public function getDefaultResistance()
    {
        return $this->default_resistance;
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
     * Set resistance_manual
     *
     * @param integer $resistanceManual
     * @return Resistance
     */
    public function setResistanceManual($resistanceManual)
    {
        $this->resistance_manual = $resistanceManual;
    
        return $this;
    }

    /**
     * Get resistance_manual
     *
     * @return integer 
     */
    public function getResistanceManual()
    {
        return $this->resistance_manual;
    }

    /**
     * Set resistance_fetch
     *
     * @param integer $resistanceFetch
     * @return Resistance
     */
    public function setResistanceFetch($resistanceFetch)
    {
        $this->resistance_fetch = $resistanceFetch;
    
        return $this;
    }

    /**
     * Get resistance_fetch
     *
     * @return integer 
     */
    public function getResistanceFetch()
    {
        return $this->resistance_fetch;
    }

    /**
     * Set bacteria
     *
     * @param \Infect\BackendBundle\Entity\Bacteria $bacteria
     * @return Resistance
     */
    public function setBacteria(\Infect\BackendBundle\Entity\Bacteria $bacteria = null)
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
    public function setCompound(\Infect\BackendBundle\Entity\Compound $compound = null)
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