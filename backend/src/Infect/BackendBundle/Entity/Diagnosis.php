<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Diagnosis
 *
 * @ORM\Table(name="diagnosis")
 * @ORM\Entity
 */
class Diagnosis
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
     * @var \Infect\BackendBundle\Entity\Country
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Country")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_country", referencedColumnName="id")
     * })
     */
    private $country;

    /**
     * @var \Infect\BackendBundle\Entity\Topic
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Topic")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_topic", referencedColumnName="id")
     * })
     */
    private $topic;

    /**
     * @var \Infect\BackendBundle\Entity\Topic
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\Therapy" mappedBy="diagnosis")
     */
    private $therapies;

    /**
     * @var \Infect\BackendBundle\Entity\Therapy
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Therapy")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_primaryTherapy", referencedColumnName="id")
     * })
     */
    private $idPrimarytherapy;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Bacteria", inversedBy="diagnosis")
     * @ORM\JoinTable(name="diagnosis_bacteria",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_diagnosis", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_bacteria", referencedColumnName="id")
     *   }
     * )
     */
    private $bacterias;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\DiagnosisLocale", mappedBy="diagnosis")
     */
    private $locales;

}