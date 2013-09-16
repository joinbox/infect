<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Drug
 *
 * @ORM\Table(name="drug")
 * @ORM\Entity
 */
class Drug
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
     * @var \Infect\BackendBundle\Entity\Compound
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Compound", inversedBy="drugs")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_compound", referencedColumnName="id")
     * })
     */
    private $compound;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\DrugLocale", mappedBy="drug", cascade={"persist", "remove"})
     */
    private $locales;

    /**
     * Constructor
     */
    public function __construct()
    {
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
     * Set compound
     *
     * @param \Infect\BackendBundle\Entity\Compound $compound
     * @return Drug
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

    /**
     * Add locales
     *
     * @param \Infect\BackendBundle\Entity\DrugLocale $locales
     * @return Drug
     */
    public function addLocale(\Infect\BackendBundle\Entity\DrugLocale $locales)
    {
        $locales->setDrug($this);
        $this->locales[] = $locales;        
    
        return $this;
    }

    /**
     * Remove locales
     *
     * @param \Infect\BackendBundle\Entity\DrugLocale $locales
     */
    public function removeLocale(\Infect\BackendBundle\Entity\DrugLocale $locales)
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