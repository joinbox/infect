<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Drug
 *
 * @ORM\Table(name="drug")
 * @ORM\Entity
 */
class Drug
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
     * @var \Infect\BackendBundle\Entity\Compound
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Compound")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_compound", referencedColumnName="id")
     * })
     */
    private $compound;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\DiagnosisLocale", mappedBy="diagnosis")
     */
    private $locales;

}