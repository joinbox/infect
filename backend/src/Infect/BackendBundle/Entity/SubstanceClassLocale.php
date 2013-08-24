<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="substanceClassLocale")
 * @ORM\Entity
 */
class SubstanceClassLocale
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
     * @var \Infect\BackendBundle\Entity\Drug
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\SubstanceClass", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_substanceClass", referencedColumnName="id")
     * })
     */
    private $substanceClass;

        /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=200, nullable=false)
     */
    private $name;


    /**
     * Set name
     *
     * @param string $name
     * @return SubstanceClassLocale
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
     * @return SubstanceClassLocale
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
     * Set substanceClass
     *
     * @param \Infect\BackendBundle\Entity\SubstanceClass $substanceClass
     * @return SubstanceClassLocale
     */
    public function setSubstanceClass(\Infect\BackendBundle\Entity\SubstanceClass $substanceClass = null)
    {
        $this->substanceClass = $substanceClass;
    
        return $this;
    }

    /**
     * Get substanceClass
     *
     * @return \Infect\BackendBundle\Entity\SubstanceClass 
     */
    public function getSubstanceClass()
    {
        return $this->substanceClass;
    }
}