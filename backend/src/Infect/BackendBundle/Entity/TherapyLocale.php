<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="therapyLocale")
 * @ORM\Entity
 */
class TherapyLocale
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
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Therapy", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_therapy", referencedColumnName="id")
     * })
     */
    private $therapy;

        /**
     * @var string
     *
     * @ORM\Column(name="text", type="text", nullable=false)
     */
    private $text;


    /**
     * Set text
     *
     * @param string $text
     * @return TherapyLocale
     */
    public function setText($text)
    {
        $this->text = $text;
    
        return $this;
    }

    /**
     * Get text
     *
     * @return string 
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set language
     *
     * @param \Infect\BackendBundle\Entity\Language $language
     * @return TherapyLocale
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
     * Set therapy
     *
     * @param \Infect\BackendBundle\Entity\Therapy $therapy
     * @return TherapyLocale
     */
    public function setTherapy(\Infect\BackendBundle\Entity\Therapy $therapy = null)
    {
        $this->therapy = $therapy;
    
        return $this;
    }

    /**
     * Get therapy
     *
     * @return \Infect\BackendBundle\Entity\Therapy 
     */
    public function getTherapy()
    {
        return $this->therapy;
    }
}