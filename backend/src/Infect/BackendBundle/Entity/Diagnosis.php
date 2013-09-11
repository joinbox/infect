<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Diagnosis
 *
 * @ORM\Table(name="diagnosis")
 * @ORM\Entity
 */
class Diagnosis
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
     * @var \Infect\BackendBundle\Entity\Country
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Country")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_country", referencedColumnName="id")
     * })
     */
    private $country;

    /**
     * @var \Infect\BackendBundle\Entity\Topic
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Topic", inversedBy="diagnosis")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_topic", referencedColumnName="id")
     * })
     */
    private $topic;

    /**
     * @var \Infect\BackendBundle\Entity\Topic
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\Therapy", mappedBy="diagnosis")
     */
    private $therapies;

    /**
     * @var \Infect\BackendBundle\Entity\Therapy
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Therapy")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_primaryTherapy", referencedColumnName="id")
     * })
     */
    private $idPrimarytherapy;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Bacteria", inversedBy="diagnosis")
     * @ORM\JoinTable(name="diagnosis_bacteria",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_diagnosis", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_bacteria", referencedColumnName="id")
     *   }
     * )
     */
    private $bacterias;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\DiagnosisLocale", mappedBy="diagnosis", cascade={"persist", "remove"})
     */
    private $locales;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->therapies = new \Doctrine\Common\Collections\ArrayCollection();
        $this->bacterias = new \Doctrine\Common\Collections\ArrayCollection();
        $this->locales = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    public function __toString()
    {
        $out = false;
        foreach ($this->getLocales() as $locale) 
        {
            if(!$out) $out = "";
            $out .= $locale->getLanguage()->getName().':'.$locale->getTitle().' | ';
        }

        return $out ? $out : 'no Name';
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
     * Set country
     *
     * @param \Infect\BackendBundle\Entity\Country $country
     * @return Diagnosis
     */
    public function setCountry(\Infect\BackendBundle\Entity\Country $country = null)
    {
        $this->country = $country;
    
        return $this;
    }

    /**
     * Get country
     *
     * @return \Infect\BackendBundle\Entity\Country 
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set topic
     *
     * @param \Infect\BackendBundle\Entity\Topic $topic
     * @return Diagnosis
     */
    public function setTopic(\Infect\BackendBundle\Entity\Topic $topic = null)
    {
        $this->topic = $topic;
    
        return $this;
    }

    /**
     * Get topic
     *
     * @return \Infect\BackendBundle\Entity\Topic 
     */
    public function getTopic()
    {
        return $this->topic;
    }

    /**
     * Add therapies
     *
     * @param \Infect\BackendBundle\Entity\Therapy $therapies
     * @return Diagnosis
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
     * Set idPrimarytherapy
     *
     * @param \Infect\BackendBundle\Entity\Therapy $idPrimarytherapy
     * @return Diagnosis
     */
    public function setIdPrimarytherapy(\Infect\BackendBundle\Entity\Therapy $idPrimarytherapy = null)
    {
        $this->idPrimarytherapy = $idPrimarytherapy;
    
        return $this;
    }

    /**
     * Get idPrimarytherapy
     *
     * @return \Infect\BackendBundle\Entity\Therapy 
     */
    public function getIdPrimarytherapy()
    {
        return $this->idPrimarytherapy;
    }

    /**
     * Add bacterias
     *
     * @param \Infect\BackendBundle\Entity\Bacteria $bacterias
     * @return Diagnosis
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

    /**
     * Add locales
     *
     * @param \Infect\BackendBundle\Entity\DiagnosisLocale $locales
     * @return Diagnosis
     */
    public function addLocale(\Infect\BackendBundle\Entity\DiagnosisLocale $locales)
    {
        $locales->setDiagnosis($this);
        $this->locales[] = $locales;
    
        return $this;
    }

    /**
     * Remove locales
     *
     * @param \Infect\BackendBundle\Entity\DiagnosisLocale $locales
     */
    public function removeLocale(\Infect\BackendBundle\Entity\DiagnosisLocale $locales)
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