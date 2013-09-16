<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="shapeLocale")
 * @ORM\Entity
 */
class ShapeLocale
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
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Shape", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_shape", referencedColumnName="id")
     * })
     */
    private $shape;

        /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     */
    private $name;



    /**
     * Set name
     *
     * @param string $name
     * @return ShapeLocale
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
     * @return ShapeLocale
     */
    public function setLanguage(\Infect\BackendBundle\Entity\Language $language)
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
     * Set shape
     *
     * @param \Infect\BackendBundle\Entity\Shape $shape
     * @return ShapeLocale
     */
    public function setShape(\Infect\BackendBundle\Entity\Shape $shape)
    {
        $this->shape = $shape;
    
        return $this;
    }

    /**
     * Get shape
     *
     * @return \Infect\BackendBundle\Entity\Shape 
     */
    public function getShape()
    {
        return $this->shape;
    }
}