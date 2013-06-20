<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Compound
 *
 * @ORM\Table(name="compound")
 * @ORM\Entity
 */
class Compound
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
     * @var boolean
     *
     * @ORM\Column(name="iv", type="boolean", nullable=false)
     */
    private $iv;

    /**
     * @var boolean
     *
     * @ORM\Column(name="po", type="boolean", nullable=false)
     */
    private $po;



    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Therapy", mappedBy="compounds")
     */
    private $therapies;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Substance", inversedBy="compounds")
     * @ORM\JoinTable(name="compound_substance",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_compound", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_substance", referencedColumnName="id")
     *   }
     * )
     */
    private $substances;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\Drug", mappedBy="compound")
     */
    private $drugs;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\BacteriaLocale", mappedBy="bacteria")
     */
    private $locales;

}