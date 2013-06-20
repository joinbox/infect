<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="topicLocale")
 * @ORM\Entity
 */
class TopicLocale
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
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Topic", inversedBy="locales")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_substance", referencedColumnName="id")
     * })
     */
    private $topic;

        /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=200, nullable=false)
     */
    private $title;


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
     * @return TopicLocale
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
     * Set language
     *
     * @param \Infect\BackendBundle\Entity\Language $language
     * @return TopicLocale
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
     * Set topic
     *
     * @param \Infect\BackendBundle\Entity\Topic $topic
     * @return TopicLocale
     */
    public function setTopic(\Infect\BackendBundle\Entity\Topic $topic = null)
    {
        $this->topic = $topic;
    
        return $this;
    }

    /**
     * Get topic
     *
     * @return \Infect\BackendBundle\Entity\Topic 
     */
    public function getTopic()
    {
        return $this->topic;
    }
}