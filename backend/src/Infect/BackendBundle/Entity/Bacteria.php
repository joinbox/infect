<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Bacteria
 *
 * @ORM\Table(name="bacteria")
 * @ORM\Entity
 */
class Bacteria
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
     * @var \Infect\BackendBundle\Entity\Species
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Species")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_species", referencedColumnName="id")
     * })
     */
    private $species;

    /**
     * @var \Infect\BackendBundle\Entity\Shape
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Shape")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_shape", referencedColumnName="id")
     * })
     */
    private $shape;

    /**
     * @var \Infect\BackendBundle\Entity\Grouping
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Grouping")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_grouping", referencedColumnName="id")
     * })
     */
    private $grouping;

    /**
     * @var boolean
     *
     * @ORM\Column(name="gram", type="boolean", nullable=false)
     */
    private $gram;

    /**
     * @var boolean
     *
     * @ORM\Column(name="aerobic", type="boolean", nullable=false)
     */
    private $aerobic;

    /**
     * @var boolean
     *
     * @ORM\Column(name="aerobic-optional", type="boolean", nullable=false)
     */
    private $aerobicOptional;

    /**
     * @var boolean
     *
     * @ORM\Column(name="anaerobic", type="boolean", nullable=false)
     */
    private $anaerobic;

    /**
     * @var boolean
     *
     * @ORM\Column(name="anaerobic-optional", type="boolean", nullable=false)
     */
    private $anaerobicOptional;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Diagnosis", mappedBy="bacteria")
     */
    private $diagnosis;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\BacteriaLocale", mappedBy="bacteria")
     */
    private $locales;


}