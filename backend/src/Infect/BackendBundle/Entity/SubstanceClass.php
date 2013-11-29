<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Substanceclass
 *
 * @ORM\Table(name="substanceClass")
 * @ORM\Entity
 */
class SubstanceClass
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Substance", mappedBy="substanceClasses")
     */
    private $substances;

    /**
     * @ORM\Column(name="lft", type="integer")
     */
    private $lft;

    /**
     * @ORM\Column(name="rgt", type="integer")
     */
    private $rgt;

     /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\SubstanceClassLocale", mappedBy="substanceClass", cascade={"persist", "remove"})
     */
    private $locales;

    /**
     * @var id_substanceClass
     * "virtual property" -> see SubstanceClassListener
     *
     */
    private $parent;

    /**
     * @var
     * "virtual property" -> see SubstanceClassListener
     *
     */
    private $depth;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->substances = new \Doctrine\Common\Collections\ArrayCollection();
        $this->locales = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function __toString()
    {
        $out = false;
        foreach ($this->getLocales() as $locale) 
        {
            if(!$out) $out = "";
            $out .= $locale->getLanguage()->getName().':'.$locale->getName().' | ';
        }

        return $out ? $out : 'no Name';
    }

    /**
     * @param mixed $parent
     */
    public function setParent($parent)
    {
        $this->parent = $parent;
    }

    /**
     * @return mixed
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * @param mixed $depth
     */
    public function setDepth($depth)
    {
        $this->depth = $depth;
    }

    /**
     * @return mixed
     */
    public function getDepth()
    {
        return $this->depth;
    }

    /**
     * @param mixed $lft
     */
    public function setLft($lft)
    {
        $this->lft = $lft;
    }

    /**
     * @return mixed
     */
    public function getLft()
    {
        return $this->lft;
    }

    /**
     * @param mixed $rgt
     */
    public function setRgt($rgt)
    {
        $this->rgt = $rgt;
    }

    /**
     * @return mixed
     */
    public function getRgt()
    {
        return $this->rgt;
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
     * Add substances
     *
     * @param \Infect\BackendBundle\Entity\Substance $substances
     * @return SubstanceClass
     */
    public function addSubstance(\Infect\BackendBundle\Entity\Substance $substances)
    {
        $this->substances[] = $substances;
    
        return $this;
    }

    /**
     * Remove substances
     *
     * @param \Infect\BackendBundle\Entity\Substance $substances
     */
    public function removeSubstance(\Infect\BackendBundle\Entity\Substance $substances)
    {
        $this->substances->removeElement($substances);
    }

    /**
     * Get substances
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getSubstances()
    {
        return $this->substances;
    }

    /**
     * Add locales
     *
     * @param \Infect\BackendBundle\Entity\SubstanceClassLocale $locales
     * @return SubstanceClass
     */
    public function addLocale(\Infect\BackendBundle\Entity\SubstanceClassLocale $locales)
    {
        $locales->setSubstanceClass($this);
        $this->locales[] = $locales;
    
        return $this;
    }

    /**
     * Remove locales
     *
     * @param \Infect\BackendBundle\Entity\SubstanceClassLocale $locales
     */
    public function removeLocale(\Infect\BackendBundle\Entity\SubstanceClassLocale $locales)
    {
        $this->locales->removeElement($locales);
    }

    /**
     * Get locales
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getLocales()
    {
        return $this->locales;
    }
}