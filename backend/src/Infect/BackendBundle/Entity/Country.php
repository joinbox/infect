<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Country
 *
 * @ORM\Table(name="country")
 * @ORM\Entity
 */
class Country
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
     * @var integer
     *
     * @ORM\Column(name="iso2", type="integer")
     */
    private $iso2;

    /**
     * @var integer
     *
     * @ORM\Column(name="iso3", type="integer")
     */
    private $iso3;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Language", inversedBy="countries")
     * @ORM\JoinTable(name="country_language",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_country", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_language", referencedColumnName="id")
     *   }
     * )
     */
    private $languages;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->languages = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set iso2
     *
     * @param integer $iso2
     * @return Country
     */
    public function setIso2($iso2)
    {
        $this->iso2 = $iso2;
    
        return $this;
    }

    /**
     * Get iso2
     *
     * @return integer 
     */
    public function getIso2()
    {
        return $this->iso2;
    }

    /**
     * Set iso3
     *
     * @param integer $iso3
     * @return Country
     */
    public function setIso3($iso3)
    {
        $this->iso3 = $iso3;
    
        return $this;
    }

    /**
     * Get iso3
     *
     * @return integer 
     */
    public function getIso3()
    {
        return $this->iso3;
    }

    /**
     * Add languages
     *
     * @param \Infect\BackendBundle\Entity\Language $languages
     * @return Country
     */
    public function addLanguage(\Infect\BackendBundle\Entity\Language $languages)
    {
        $this->languages[] = $languages;
    
        return $this;
    }

    /**
     * Remove languages
     *
     * @param \Infect\BackendBundle\Entity\Language $languages
     */
    public function removeLanguage(\Infect\BackendBundle\Entity\Language $languages)
    {
        $this->languages->removeElement($languages);
    }

    /**
     * Get languages
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getLanguages()
    {
        return $this->languages;
    }
}