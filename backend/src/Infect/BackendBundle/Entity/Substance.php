<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Substance
 *
 * @ORM\Table(name="substance")
 * @ORM\Entity
 */
class Substance
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
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Compound", mappedBy="substances")
     */
    private $compounds;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\SubstanceClass", inversedBy="substances")
     * @ORM\JoinTable(name="substance_substanceclass",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_substance", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_substanceClass", referencedColumnName="id")
     *   }
     * )
     */
    private $substanceClasses;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\SubstanceClass", mappedBy="parent")
     */
    private $childs;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\SubstanceLocale", mappedBy="substance", cascade={"persist", "remove"})
     */
    private $locales;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->compounds = new \Doctrine\Common\Collections\ArrayCollection();
        $this->substanceClasses = new \Doctrine\Common\Collections\ArrayCollection();
        $this->childs = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Add compounds
     *
     * @param \Infect\BackendBundle\Entity\Compound $compounds
     * @return Substance
     */
    public function addCompound(\Infect\BackendBundle\Entity\Compound $compounds)
    {
        $this->compounds[] = $compounds;
    
        return $this;
    }

    /**
     * Remove compounds
     *
     * @param \Infect\BackendBundle\Entity\Compound $compounds
     */
    public function removeCompound(\Infect\BackendBundle\Entity\Compound $compounds)
    {
        $this->compounds->removeElement($compounds);
    }

    /**
     * Get compounds
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getCompounds()
    {
        return $this->compounds;
    }

    /**
     * Add substanceClasses
     *
     * @param \Infect\BackendBundle\Entity\SubstanceClass $substanceClasses
     * @return Substance
     */
    public function addSubstanceClasse(\Infect\BackendBundle\Entity\SubstanceClass $substanceClasses)
    {
        $this->substanceClasses[] = $substanceClasses;
    
        return $this;
    }

    /**
     * Remove substanceClasses
     *
     * @param \Infect\BackendBundle\Entity\SubstanceClass $substanceClasses
     */
    public function removeSubstanceClasse(\Infect\BackendBundle\Entity\SubstanceClass $substanceClasses)
    {
        $this->substanceClasses->removeElement($substanceClasses);
    }

    /**
     * Get substanceClasses
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getSubstanceClasses()
    {
        return $this->substanceClasses;
    }

    /**
     * Add childs
     *
     * @param \Infect\BackendBundle\Entity\SubstanceClass $childs
     * @return Substance
     */
    public function addChild(\Infect\BackendBundle\Entity\SubstanceClass $childs)
    {
        $this->childs[] = $childs;
    
        return $this;
    }

    /**
     * Remove childs
     *
     * @param \Infect\BackendBundle\Entity\SubstanceClass $childs
     */
    public function removeChild(\Infect\BackendBundle\Entity\SubstanceClass $childs)
    {
        $this->childs->removeElement($childs);
    }

    /**
     * Get childs
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getChilds()
    {
        return $this->childs;
    }

    /**
     * Add locales
     *
     * @param \Infect\BackendBundle\Entity\SubstanceLocale $locales
     * @return Substance
     */
    public function addLocale(\Infect\BackendBundle\Entity\SubstanceLocale $locales)
    {
        $locales->setSubstance($this);
        $this->locales[] = $locales;
    
        return $this;
    }

    /**
     * Remove locales
     *
     * @param \Infect\BackendBundle\Entity\SubstanceLocale $locales
     */
    public function removeLocale(\Infect\BackendBundle\Entity\SubstanceLocale $locales)
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