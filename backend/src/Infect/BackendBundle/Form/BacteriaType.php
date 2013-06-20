<?php

namespace Infect\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class BacteriaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('gram')
            ->add('aerobic')
            ->add('aerobicOptional')
            ->add('anaerobic')
            ->add('anaerobicOptional')
            ->add('species')
            ->add('shape')
            ->add('grouping')
            ->add('diagnosis')
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Infect\BackendBundle\Entity\Bacteria'
        ));
    }

    public function getName()
    {
        return 'infect_backendbundle_bacteriatype';
    }
}
