<?php

namespace Infect\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class TherapyType extends AbstractType
{
        /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('locales', 'collection', array(
                        'type'         => new TherapyLocaleType(),
                        'allow_add'    => true,
                        'allow_delete' => true,
                        'by_reference' => false,                                        
                    ))
            ->add('diagnosis', null, array('required' => false))
            ->add('compounds', null, array('required' => false))
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Infect\BackendBundle\Entity\Therapy'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'infect_backendbundle_therapy';
    }
}
