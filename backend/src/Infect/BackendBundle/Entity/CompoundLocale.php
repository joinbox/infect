<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="compoundLocale")
 * @ORM\Entity
 */
class CompoundLocale
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
     * @var \Infect\BackendBundle\Entity\Compound
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Compound", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_compound", referencedColumnName="id")
     * })
     */
    private $compound;

        /**
     * @var string
     *
     * @ORM\Column(name="clue", type="string", length=200, nullable=false)
     */
    private $key;

       /**
     * @var string
     *
     * @ORM\Column(name="value", type="text", nullable=false)
     */
    private $value;


    /**
     * Set key
     *
     * @param string $key
     * @return CompoundLocale
     */
    public function setKey($key)
    {
        $this->key = $key;
    
        return $this;
    }

    /**
     * Get key
     *
     * @return string 
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * Set value
     *
     * @param string $value
     * @return CompoundLocale
     */
    public function setValue($value)
    {
        $this->value = $value;
    
        return $this;
    }

    /**
     * Get value
     *
     * @return string 
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * Set language
     *
     * @param \Infect\BackendBundle\Entity\Language $language
     * @return CompoundLocale
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
     * Set compound
     *
     * @param \Infect\BackendBundle\Entity\Compound $compound
     * @return CompoundLocale
     */
    public function setCompound(\Infect\BackendBundle\Entity\Compound $compound = null)
    {
        $this->compound = $compound;
    
        return $this;
    }

    /**
     * Get compound
     *
     * @return \Infect\BackendBundle\Entity\Compound 
     */
    public function getCompound()
    {
        return $this->compound;
    }
}