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
     * @ORM\GeneratedValue(strategy="IDENTITY")
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
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\SubstanceLocale", mappedBy="substance")
     */
    private $locales;

}