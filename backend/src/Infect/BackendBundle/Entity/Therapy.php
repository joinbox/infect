<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Therapy
 *
 * @ORM\Table(name="therapy")
 * @ORM\Entity
 */
class Therapy
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
     * @var \Infect\BackendBundle\Entity\Diagnosis
     *
     * @ORM\ManyToOne(targetEntity="Infect\BackendBundle\Entity\Diagnosis")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_diagnosis", referencedColumnName="id")
     * })
     */
    private $diagnosis;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Compound", inversedBy="therapies")
     * @ORM\JoinTable(name="therapy_compounds",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_therapy", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_compounds", referencedColumnName="id")
     *   }
     * )
     */
    private $compounds;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Infect\BackendBundle\Entity\TherapyLocale", mappedBy="therapy")
     */
    private $locales;


}