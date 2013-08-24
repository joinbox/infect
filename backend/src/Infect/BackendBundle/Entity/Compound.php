<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Compound
 *
 * @ORM\Table(name="compound")
 * @ORM\Entity
 */
class Compound
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
     * @var boolean
     *
     * @ORM\Column(name="iv", type="boolean", nullable=false)
     */
    private $iv;

    /**
     * @var boolean
     *
     * @ORM\Column(name="po", type="boolean", nullable=false)
     */
    private $po;



    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Therapy", mappedBy="compounds")
     */
    private $therapies;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Substance", inversedBy="compounds")
     * @ORM\JoinTable(name="compound_substance",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_compound", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_substance", referencedColumnName="id")
     *   }
     * )
     */
    private $substances;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\Drug", mappedBy="compound")
     */
    private $drugs;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\CompoundLocale", mappedBy="compound")
     */
    private $locales;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->therapies = new \Doctrine\Common\Collections\ArrayCollection();
        $this->substances = new \Doctrine\Common\Collections\ArrayCollection();
        $this->drugs = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set iv
     *
     * @param boolean $iv
     * @return Compound
     */
    public function setIv($iv)
    {
        $this->iv = $iv;
    
        return $this;
    }

    /**
     * Get iv
     *
     * @return boolean 
     */
    public function getIv()
    {
        return $this->iv;
    }

    /**
     * Set po
     *
     * @param boolean $po
     * @return Compound
     */
    public function setPo($po)
    {
        $this->po = $po;
    
        return $this;
    }

    /**
     * Get po
     *
     * @return boolean 
     */
    public function getPo()
    {
        return $this->po;
    }

    /**
     * Add therapies
     *
     * @param \Infect\BackendBundle\Entity\Therapy $therapies
     * @return Compound
     */
    public function addTherapie(\Infect\BackendBundle\Entity\Therapy $therapies)
    {
        $this->therapies[] = $therapies;
    
        return $this;
    }

    /**
     * Remove therapies
     *
     * @param \Infect\BackendBundle\Entity\Therapy $therapies
     */
    public function removeTherapie(\Infect\BackendBundle\Entity\Therapy $therapies)
    {
        $this->therapies->removeElement($therapies);
    }

    /**
     * Get therapies
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getTherapies()
    {
        return $this->therapies;
    }

    /**
     * Add substances
     *
     * @param \Infect\BackendBundle\Entity\Substance $substances
     * @return Compound
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
     * Add drugs
     *
     * @param \Infect\BackendBundle\Entity\Drug $drugs
     * @return Compound
     */
    public function addDrug(\Infect\BackendBundle\Entity\Drug $drugs)
    {
        $this->drugs[] = $drugs;
    
        return $this;
    }

    /**
     * Remove drugs
     *
     * @param \Infect\BackendBundle\Entity\Drug $drugs
     */
    public function removeDrug(\Infect\BackendBundle\Entity\Drug $drugs)
    {
        $this->drugs->removeElement($drugs);
    }

    /**
     * Get drugs
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getDrugs()
    {
        return $this->drugs;
    }

    /**
     * Add locales
     *
     * @param \Infect\BackendBundle\Entity\CompoundLocale $locales
     * @return Compound
     */
    public function addLocale(\Infect\BackendBundle\Entity\CompoundLocale $locales)
    {
        $this->locales[] = $locales;
    
        return $this;
    }

    /**
     * Remove locales
     *
     * @param \Infect\BackendBundle\Entity\CompoundLocale $locales
     */
    public function removeLocale(\Infect\BackendBundle\Entity\CompoundLocale $locales)
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