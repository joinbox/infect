<?php

namespace Infect\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class BacteriaType extends AbstractType
{
        /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            //->add('name')
            ->add('locales', 'collection', array(
                    'type'         => new BacteriaLocaleType(),
                    'allow_add'    => true,
                    'allow_delete' => true,
                    'by_reference' => false,                                        
                ))
            ->add('gram', 'choice', array(
                    'expanded' => true,
                    'choices' => array(0 => 'Gram Negative', 1 => 'Gram Positive'),
                    'required' => false
                ))
            ->add('aerobic', null, array('required' => false))
            ->add('aerobicOptional', null, array('required' => false))
            ->add('anaerobic', null, array('required' => false))
            ->add('anaerobicOptional', null, array('required' => false))
            ->add('species', null, array('required' => true))
            ->add('shape')
            ->add('grouping')
            //->add('diagnosis', null, array('required' => false))
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Infect\BackendBundle\Entity\Bacteria'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'infect_backendbundle_bacteria';
    }
}
