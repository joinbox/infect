<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Substanceclass
 *
 * @ORM\Table(name="substanceClass")
 * @ORM\Entity
 */
class SubstanceClass
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
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Substance", mappedBy="substanceClasses")
     */
    private $substances;

    /**
     * @var \Infect\BackendBundle\Entity\Substance
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Substance")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_parent", referencedColumnName="id")
     * })
     */
    private $parent;


     /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\SubstanceClassLocale", mappedBy="substanceClass")
     */
    private $locales;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->substances = new \Doctrine\Common\Collections\ArrayCollection();
        $this->locales = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Add substances
     *
     * @param \Infect\BackendBundle\Entity\Substance $substances
     * @return SubstanceClass
     */
    public function addSubstance(\Infect\BackendBundle\Entity\Substance $substances)
    {
        $this->substances[] = $substances;
    
        return $this;
    }

    /**
     * Remove substances
     *
     * @param \Infect\BackendBundle\Entity\Substance $substances
     */
    public function removeSubstance(\Infect\BackendBundle\Entity\Substance $substances)
    {
        $this->substances->removeElement($substances);
    }

    /**
     * Get substances
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getSubstances()
    {
        return $this->substances;
    }

    /**
     * Set parent
     *
     * @param \Infect\BackendBundle\Entity\Substance $parent
     * @return SubstanceClass
     */
    public function setParent(\Infect\BackendBundle\Entity\Substance $parent = null)
    {
        $this->parent = $parent;
    
        return $this;
    }

    /**
     * Get parent
     *
     * @return \Infect\BackendBundle\Entity\Substance 
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Add locales
     *
     * @param \Infect\BackendBundle\Entity\SubstanceClassLocale $locales
     * @return SubstanceClass
     */
    public function addLocale(\Infect\BackendBundle\Entity\SubstanceClassLocale $locales)
    {
        $this->locales[] = $locales;
    
        return $this;
    }

    /**
     * Remove locales
     *
     * @param \Infect\BackendBundle\Entity\SubstanceClassLocale $locales
     */
    public function removeLocale(\Infect\BackendBundle\Entity\SubstanceClassLocale $locales)
    {
        $this->locales->removeElement($locales);
    }

    /**
     * Get locales
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getLocales()
    {
        return $this->locales;
    }
}