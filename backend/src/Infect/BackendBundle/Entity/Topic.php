<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Topic
 *
 * @ORM\Table(name="topic")
 * @ORM\Entity
 */
class Topic
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
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\Diagnosis", mappedBy="topic")
     */
    private $diagnosis;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\TopicLocale", mappedBy="topic")
     */
    private $locales;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->diagnosis = new \Doctrine\Common\Collections\ArrayCollection();
        $this->locales = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Add diagnosis
     *
     * @param \Infect\BackendBundle\Entity\Diagnosis $diagnosis
     * @return Topic
     */
    public function addDiagnosi(\Infect\BackendBundle\Entity\Diagnosis $diagnosis)
    {
        $this->diagnosis[] = $diagnosis;
    
        return $this;
    }

    /**
     * Remove diagnosis
     *
     * @param \Infect\BackendBundle\Entity\Diagnosis $diagnosis
     */
    public function removeDiagnosi(\Infect\BackendBundle\Entity\Diagnosis $diagnosis)
    {
        $this->diagnosis->removeElement($diagnosis);
    }

    /**
     * Get diagnosis
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getDiagnosis()
    {
        return $this->diagnosis;
    }

    /**
     * Add locales
     *
     * @param \Infect\BackendBundle\Entity\TopicLocale $locales
     * @return Topic
     */
    public function addLocale(\Infect\BackendBundle\Entity\TopicLocale $locales)
    {
        $this->locales[] = $locales;
    
        return $this;
    }

    /**
     * Remove locales
     *
     * @param \Infect\BackendBundle\Entity\TopicLocale $locales
     */
    public function removeLocale(\Infect\BackendBundle\Entity\TopicLocale $locales)
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