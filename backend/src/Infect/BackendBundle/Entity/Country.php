<?php

namespace Infect\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Country
 *
 * @ORM\Table(name="country")
 * @ORM\Entity
 */
class Country
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
     * @var integer
     *
     * @ORM\Column(name="iso2", type="integer")
     */
    private $iso2;

    /**
     * @var integer
     *
     * @ORM\Column(name="iso3", type="integer")
     */
    private $iso3;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Infect\BackendBundle\Entity\Language", inversedBy="countries")
     * @ORM\JoinTable(name="country_language",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_country", referencedColumnName="id")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_language", referencedColumnName="id")
     *   }
     * )
     */
    private $languages;

}