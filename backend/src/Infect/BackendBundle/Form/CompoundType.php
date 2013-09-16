<?php

namespace Infect\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class CompoundType extends AbstractType
{
        /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('locales', 'collection', array(
                    'type'         => new CompoundLocaleType(),
                    'allow_add'    => true,
                    'allow_delete' => true,
                    'by_reference' => false,                                        
                ))
            ->add('iv', null, array('required' => false))
            ->add('po', null, array('required' => false))
            //->add('therapies')
            ->add('substances', null, array('required' => false))
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Infect\BackendBundle\Entity\Compound'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'infect_backendbundle_compound';
    }
}
