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
}