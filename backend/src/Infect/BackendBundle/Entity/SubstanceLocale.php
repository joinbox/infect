<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="substanceLocale")
 * @ORM\Entity
 */
class SubstanceLocale
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
     * @var \Infect\BackendBundle\Entity\Language
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Language")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_language", referencedColumnName="id")
     * })
     */
    private $language;

    /**
     * @var \Infect\BackendBundle\Entity\Drug
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Substance", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_substance", referencedColumnName="id")
     * })
     */
    private $substance;

        /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=250, nullable=false)
     */
    private $name;


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
     * @return SubstanceLocale
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
     * @return SubstanceLocale
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
     * Set substance
     *
     * @param \Infect\BackendBundle\Entity\Substance $substance
     * @return SubstanceLocale
     */
    public function setSubstance(\Infect\BackendBundle\Entity\Substance $substance = null)
    {
        $this->substance = $substance;
    
        return $this;
    }

    /**
     * Get substance
     *
     * @return \Infect\BackendBundle\Entity\Substance 
     */
    public function getSubstance()
    {
        return $this->substance;
    }
}