<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Language
 *
 * @ORM\Table(name="language")
 * @ORM\Entity
 */
class Language
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
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=100, nullable=false)
     */
    private $name;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Country", mappedBy="languages")
     */
    private $countries;

    /**
     * @var integer
     *
     * @ORM\Column(name="iso2", type="string", length=2, unique=true)
     */
    private $iso2;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->countries = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set name
     *
     * @param string $name
     * @return Language
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

    public function setCountries(\Doctrine\Common\Collections\ArrayCollection $countries)
    {
        foreach ($countries as $c) 
        {
            $c->addLanguage($this);
        }

        $this->countries = $countries;
    }

    /**
     * Add countries
     *
     * @param \Infect\BackendBundle\Entity\Country $countries
     * @return Language
     */
    public function addCountrie(\Infect\BackendBundle\Entity\Country $countries)
    {
        $this->countries[] = $countries;
    
        return $this;
    }

    /**
     * Remove countries
     *
     * @param \Infect\BackendBundle\Entity\Country $countries
     */
    public function removeCountrie(\Infect\BackendBundle\Entity\Country $countries)
    {
        $this->countries->removeElement($countries);
    }

    /**
     * Get countries
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getCountries()
    {
        return $this->countries;
    }

    /**
     * Set iso2
     *
     * @param string $iso2
     * @return Language
     */
    public function setIso2($iso2)
    {
        $this->iso2 = $iso2;
    
        return $this;
    }

    /**
     * Get iso2
     *
     * @return string 
     */
    public function getIso2()
    {
        return $this->iso2;
    }
}