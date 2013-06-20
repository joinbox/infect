<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Infect\BackendBundle\Entity\Bacteria;
use Infect\BackendBundle\Form\BacteriaType;

class BacteriaController extends Controller
{
    /**
     * @Route()
     * @Template()
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route()
     * @Template()
     */
   	public function addEditAction($edit = false, $id = false)
    {

        if($edit)
        {
            if(!$id)
            {
                throw $this->createNotFoundException('Unable to find entity.');
            }

            $em     = $this->getDoctrine()->getManager();
            $entity = $em->getRepository("InfectBackendBundle:Bacteria")->find($id);

            if (!$entity) 
            {
                throw $this->createNotFoundException('Unable to find entity.');
            }                   
        
        }
        else
        {
            $entity = new Bacteria();            
        }
        
        $form = $this->createForm(new BacteriaType(), $entity);

        if ($this->getRequest()->isMethod('POST')) 
        {
            $form->bind($this->getRequest());            

            if ($form->isValid()) 
            {
                $em = $this->getDoctrine()->getManager();
                $em->persist($entity);
                $em->flush();

				$transAction = $edit ? "aktualisiert" : 'hinzugefügt';
				$translator  = $this->get('translator');
				$message     = $translator->trans($transAction);

                $this->getRequest()->getSession()->getFlashBag()->add('success', $message);

                //return $this->redirect($this->generateUrl($this->overViewPath));

            }
            else
            {
                $this->request->getSession()->getFlashBag()->add('error', $form->getErrorsAsString());
            }
        }

        return  array(
                    	'form'      => $form->createView()
                    );

    }

}
