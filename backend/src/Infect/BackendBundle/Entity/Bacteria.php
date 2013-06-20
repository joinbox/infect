<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Bacteria
 *
 * @ORM\Table(name="bacteria")
 * @ORM\Entity
 */
class Bacteria
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
     * @var \Infect\BackendBundle\Entity\Species
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Species")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_species", referencedColumnName="id")
     * })
     */
    private $species;

    /**
     * @var \Infect\BackendBundle\Entity\Shape
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Shape")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_shape", referencedColumnName="id")
     * })
     */
    private $shape;

    /**
     * @var \Infect\BackendBundle\Entity\Grouping
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Grouping")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_grouping", referencedColumnName="id")
     * })
     */
    private $grouping;

    /**
     * @var boolean
     *
     * @ORM\Column(type="boolean")
     */
    private $gram;

    /**
     * @var boolean
     *
     * @ORM\Column(type="boolean")
     */
    private $aerobic;

    /**
     * @var boolean
     *
     * @ORM\Column(type="boolean")
     */
    private $aerobicOptional;

    /**
     * @var boolean
     *
     * @ORM\Column(type="boolean")
     */
    private $anaerobic;

    /**
     * @var boolean
     *
     * @ORM\Column(type="boolean")
     */
    private $anaerobicOptional;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Diagnosis", mappedBy="bacteria")
     */
    private $diagnosis;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\BacteriaLocale", mappedBy="bacteria")
     */
    private $locales;


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->diagnosis = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set gram
     *
     * @param boolean $gram
     * @return Bacteria
     */
    public function setGram($gram)
    {
        $this->gram = $gram;
    
        return $this;
    }

    /**
     * Get gram
     *
     * @return boolean 
     */
    public function getGram()
    {
        return $this->gram;
    }

    /**
     * Set aerobic
     *
     * @param boolean $aerobic
     * @return Bacteria
     */
    public function setAerobic($aerobic)
    {
        $this->aerobic = $aerobic;
    
        return $this;
    }

    /**
     * Get aerobic
     *
     * @return boolean 
     */
    public function getAerobic()
    {
        return $this->aerobic;
    }

    /**
     * Set aerobicOptional
     *
     * @param boolean $aerobicOptional
     * @return Bacteria
     */
    public function setAerobicOptional($aerobicOptional)
    {
        $this->aerobicOptional = $aerobicOptional;
    
        return $this;
    }

    /**
     * Get aerobicOptional
     *
     * @return boolean 
     */
    public function getAerobicOptional()
    {
        return $this->aerobicOptional;
    }

    /**
     * Set anaerobic
     *
     * @param boolean $anaerobic
     * @return Bacteria
     */
    public function setAnaerobic($anaerobic)
    {
        $this->anaerobic = $anaerobic;
    
        return $this;
    }

    /**
     * Get anaerobic
     *
     * @return boolean 
     */
    public function getAnaerobic()
    {
        return $this->anaerobic;
    }

    /**
     * Set anaerobicOptional
     *
     * @param boolean $anaerobicOptional
     * @return Bacteria
     */
    public function setAnaerobicOptional($anaerobicOptional)
    {
        $this->anaerobicOptional = $anaerobicOptional;
    
        return $this;
    }

    /**
     * Get anaerobicOptional
     *
     * @return boolean 
     */
    public function getAnaerobicOptional()
    {
        return $this->anaerobicOptional;
    }

    /**
     * Set species
     *
     * @param \Infect\BackendBundle\Entity\Species $species
     * @return Bacteria
     */
    public function setSpecies(\Infect\BackendBundle\Entity\Species $species = null)
    {
        $this->species = $species;
    
        return $this;
    }

    /**
     * Get species
     *
     * @return \Infect\BackendBundle\Entity\Species 
     */
    public function getSpecies()
    {
        return $this->species;
    }

    /**
     * Set shape
     *
     * @param \Infect\BackendBundle\Entity\Shape $shape
     * @return Bacteria
     */
    public function setShape(\Infect\BackendBundle\Entity\Shape $shape = null)
    {
        $this->shape = $shape;
    
        return $this;
    }

    /**
     * Get shape
     *
     * @return \Infect\BackendBundle\Entity\Shape 
     */
    public function getShape()
    {
        return $this->shape;
    }

    /**
     * Set grouping
     *
     * @param \Infect\BackendBundle\Entity\Grouping $grouping
     * @return Bacteria
     */
    public function setGrouping(\Infect\BackendBundle\Entity\Grouping $grouping = null)
    {
        $this->grouping = $grouping;
    
        return $this;
    }

    /**
     * Get grouping
     *
     * @return \Infect\BackendBundle\Entity\Grouping 
     */
    public function getGrouping()
    {
        return $this->grouping;
    }

    /**
     * Add diagnosis
     *
     * @param \Infect\BackendBundle\Entity\Diagnosis $diagnosis
     * @return Bacteria
     */
    public function addDiagnosi(\Infect\BackendBundle\Entity\Diagnosis $diagnosis)
    {
        $this->diagnosis[] = $diagnosis;
    
        return $this;
    }

    /**
     * Remove diagnosis
     *
     * @param \Infect\BackendBundle\Entity\Diagnosis $diagnosis
     */
    public function removeDiagnosi(\Infect\BackendBundle\Entity\Diagnosis $diagnosis)
    {
        $this->diagnosis->removeElement($diagnosis);
    }

    /**
     * Get diagnosis
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getDiagnosis()
    {
        return $this->diagnosis;
    }

    /**
     * Add locales
     *
     * @param \Infect\BackendBundle\Entity\BacteriaLocale $locales
     * @return Bacteria
     */
    public function addLocale(\Infect\BackendBundle\Entity\BacteriaLocale $locales)
    {
        $this->locales[] = $locales;
    
        return $this;
    }

    /**
     * Remove locales
     *
     * @param \Infect\BackendBundle\Entity\BacteriaLocale $locales
     */
    public function removeLocale(\Infect\BackendBundle\Entity\BacteriaLocale $locales)
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