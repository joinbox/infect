<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Substanceclass
 *
 * @ORM\Table(name="substanceClass")
 * @ORM\Entity
 */
class Substanceclass
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
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Substance", mappedBy="substanceClasses")
     */
    private $substances;

    /**
     * @var \Infect\BackendBundle\Entity\Substance
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Substance")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_parent", referencedColumnName="id")
     * })
     */
    private $parent;


     /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\SubstanceClassLocale", mappedBy="substanceClass")
     */
    private $locales;

}