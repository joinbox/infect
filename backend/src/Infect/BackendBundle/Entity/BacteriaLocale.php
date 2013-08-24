<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Bacterianame
 *
 * @ORM\Table(name="bacteriaLocale")
 * @ORM\Entity
 */
class BacteriaLocale
{

    /**
     * @ORM\Column(type="boolean")
     */
    private $isPrimary;

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
     * @var \Infect\BackendBundle\Entity\Drug
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Bacteria", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_bacteria", referencedColumnName="id")
     * })
     */
    private $bacteria;

        /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=200, nullable=false)
     */
    private $name;



    /**
     * Constructor
     */
    public function __construct()
    {
        $this->isPrimary = false;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return BacteriaLocale
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

    /**
     * Set language
     *
     * @param \Infect\BackendBundle\Entity\Language $language
     * @return BacteriaLocale
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
     * Set bacteria
     *
     * @param \Infect\BackendBundle\Entity\Bacteria $bacteria
     * @return BacteriaLocale
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
     * Set isPrimary
     *
     * @param boolean $isPrimary
     * @return BacteriaLocale
     */
    public function setIsPrimary($isPrimary)
    {
        $this->isPrimary = $isPrimary;
    
        return $this;
    }

    /**
     * Get isPrimary
     *
     * @return boolean 
     */
    public function getIsPrimary()
    {
        return $this->isPrimary;
    }
}