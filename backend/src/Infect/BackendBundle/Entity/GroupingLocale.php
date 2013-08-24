<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="groupingLocale")
 * @ORM\Entity
 */
class GroupingLocale
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
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Grouping", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_grouping", referencedColumnName="id")
     * })
     */
    private $grouping;

        /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=false)
     */
    private $name;



    /**
     * Set name
     *
     * @param string $name
     * @return GroupingLocale
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
     * @return GroupingLocale
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
     * Set grouping
     *
     * @param \Infect\BackendBundle\Entity\Grouping $grouping
     * @return GroupingLocale
     */
    public function setGrouping(\Infect\BackendBundle\Entity\Grouping $grouping)
    {
        $this->grouping = $grouping;
    
        return $this;
    }

    /**
     * Get grouping
     *
     * @return \Infect\BackendBundle\Entity\Grouping 
     */
    public function getGrouping()
    {
        return $this->grouping;
    }
}