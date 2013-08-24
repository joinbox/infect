<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Bacterianame
 *
 * @ORM\Table(name="drugLocale")
 * @ORM\Entity
 */
class DrugLocale
{

    /**
     * @var \Infect\BackendBundle\Entity\Language
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Language")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_language", referencedColumnName="id")
     * })
     */
    private $language;

    /**
     * @var \Infect\BackendBundle\Entity\Language
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Country")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_country", referencedColumnName="id")
     * })
     */
    private $country;

    /**
     * @var \Infect\BackendBundle\Entity\Drug
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Drug", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_drug", referencedColumnName="id")
     * })
     */
    private $drug;

    /**
     * @ORM\Column(type="string", length=200)
     */
    private $name;


    /**
     * Set language
     *
     * @param \Infect\BackendBundle\Entity\Language $language
     * @return DrugLocale
     */
    public function setLanguage(\Infect\BackendBundle\Entity\Language $language = null)
    {
        $this->language = $language;
    
        return $this;
    }

    /**
     * Get language
     *
     * @return \Infect\BackendBundle\Entity\Language 
     */
    public function getLanguage()
    {
        return $this->language;
    }

    /**
     * Set country
     *
     * @param \Infect\BackendBundle\Entity\Country $country
     * @return DrugLocale
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
     * Set drug
     *
     * @param \Infect\BackendBundle\Entity\Drug $drug
     * @return DrugLocale
     */
    public function setDrug(\Infect\BackendBundle\Entity\Drug $drug = null)
    {
        $this->drug = $drug;
    
        return $this;
    }

    /**
     * Get drug
     *
     * @return \Infect\BackendBundle\Entity\Drug 
     */
    public function getDrug()
    {
        return $this->drug;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return DrugLocale
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
}