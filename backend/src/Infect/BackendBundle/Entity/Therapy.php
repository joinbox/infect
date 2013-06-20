<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Therapy
 *
 * @ORM\Table(name="therapy")
 * @ORM\Entity
 */
class Therapy
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
     * @var \Infect\BackendBundle\Entity\Diagnosis
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Diagnosis")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_diagnosis", referencedColumnName="id")
     * })
     */
    private $diagnosis;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Compound", inversedBy="therapies")
     * @ORM\JoinTable(name="therapy_compounds",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_therapy", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_compounds", referencedColumnName="id")
     *   }
     * )
     */
    private $compounds;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\TherapyLocale", mappedBy="therapy")
     */
    private $locales;


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->compounds = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set diagnosis
     *
     * @param \Infect\BackendBundle\Entity\Diagnosis $diagnosis
     * @return Therapy
     */
    public function setDiagnosis(\Infect\BackendBundle\Entity\Diagnosis $diagnosis = null)
    {
        $this->diagnosis = $diagnosis;
    
        return $this;
    }

    /**
     * Get diagnosis
     *
     * @return \Infect\BackendBundle\Entity\Diagnosis 
     */
    public function getDiagnosis()
    {
        return $this->diagnosis;
    }

    /**
     * Add compounds
     *
     * @param \Infect\BackendBundle\Entity\Compound $compounds
     * @return Therapy
     */
    public function addCompound(\Infect\BackendBundle\Entity\Compound $compounds)
    {
        $this->compounds[] = $compounds;
    
        return $this;
    }

    /**
     * Remove compounds
     *
     * @param \Infect\BackendBundle\Entity\Compound $compounds
     */
    public function removeCompound(\Infect\BackendBundle\Entity\Compound $compounds)
    {
        $this->compounds->removeElement($compounds);
    }

    /**
     * Get compounds
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getCompounds()
    {
        return $this->compounds;
    }

    /**
     * Add locales
     *
     * @param \Infect\BackendBundle\Entity\TherapyLocale $locales
     * @return Therapy
     */
    public function addLocale(\Infect\BackendBundle\Entity\TherapyLocale $locales)
    {
        $this->locales[] = $locales;
    
        return $this;
    }

    /**
     * Remove locales
     *
     * @param \Infect\BackendBundle\Entity\TherapyLocale $locales
     */
    public function removeLocale(\Infect\BackendBundle\Entity\TherapyLocale $locales)
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