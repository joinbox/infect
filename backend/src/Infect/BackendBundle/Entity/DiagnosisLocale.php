<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="diagnosisLocale")
 * @ORM\Entity
 */
class DiagnosisLocale
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
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Diagnosis", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_diagnosis", referencedColumnName="id")
     * })
     */
    private $diagnosis;

        /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=false)
     */
    private $title;

       /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=false)
     */
    private $description;



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
     * Set title
     *
     * @param string $title
     * @return DiagnosisLocale
     */
    public function setTitle($title)
    {
        $this->title = $title;
    
        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return DiagnosisLocale
     */
    public function setDescription($description)
    {
        $this->description = $description;
    
        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set language
     *
     * @param \Infect\BackendBundle\Entity\Language $language
     * @return DiagnosisLocale
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
     * Set diagnosis
     *
     * @param \Infect\BackendBundle\Entity\Diagnosis $diagnosis
     * @return DiagnosisLocale
     */
    public function setDiagnosis(\Infect\BackendBundle\Entity\Diagnosis $diagnosis = null)
    {
        $this->diagnosis = $diagnosis;
    
        return $this;
    }

    /**
     * Get diagnosis
     *
     * @return \Infect\BackendBundle\Entity\Diagnosis 
     */
    public function getDiagnosis()
    {
        return $this->diagnosis;
    }
}