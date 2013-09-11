<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Shape;
use Infect\BackendBundle\Entity\ShapeLocale;
use Infect\BackendBundle\Form\ShapeType;

/**
 * Shape controller.
 *
 */
class ShapeController extends Controller
{

    /**
     * Lists all Shape entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Shape')->findAll();

        return $this->render('InfectBackendBundle:Shape:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Shape entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Shape();
        $form = $this->createForm(new ShapeType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
                        $locales = array();
            
            if ($entity->getLocales()) {
                                        foreach ($entity->getLocales() as $locale) 
            {
                $locales[] = $locale;
                $entity->removeLocale($locale);
            }
                                    }                        
            

            $em->persist($entity);
            $em->flush();

            foreach($locales as $locale)
            {
                $entity->addLocale($locale);
                $em->persist($locale);
            }
            $em->flush();

            return $this->redirect($this->generateUrl('shape_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Shape:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Shape entity.
     *
     */
    public function newAction()
    {
        $entity = new Shape();
        $entity->addLocale(new ShapeLocale());
        $form   = $this->createForm(new ShapeType(), $entity);

        return $this->render('InfectBackendBundle:Shape:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Shape entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Shape')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Shape entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Shape:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Shape entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Shape')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Shape entity.');
        }

        $editForm = $this->createForm(new ShapeType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Shape:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Shape entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Shape')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Shape entity.');
        }

        $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new ShapeType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
                        foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getShape() === $locale->getShape()) {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('shape_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Shape:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Shape entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Shape')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Shape entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('shape'));
    }

    /**
     * Creates a form to delete a Shape entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
