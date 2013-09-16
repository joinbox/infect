<?php

namespace Infect\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class DrugLocaleType extends AbstractType
{
        /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('language', null, array(
                        'required' => true,
                    )
                )
            ->add('country', null, array(
                        'required' => true,
                    )
                )
            ->add('name')
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Infect\BackendBundle\Entity\DrugLocale'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'infect_backendbundle_drug_locale';
    }
}
