<?php

namespace Infect\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class BacteriaSubstanceClassType extends AbstractType
{
        /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('bacteria', null, array('required' => true))
            ->add('substanceClass', null, array('required' => true))
            ->add('resistanceUser', null, array('required' => false))
            ->add('resistanceDefault', 'choice', array(
                'choices' => array(1 => 'low', 2 => 'intermediate', 3 => 'high'),
                'required' => false
            ))
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Infect\BackendBundle\Entity\BacteriaSubstanceClass'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'infect_backendbundle_bacteriaSubstanceClass';
    }
}
