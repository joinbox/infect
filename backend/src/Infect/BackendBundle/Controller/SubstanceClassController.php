<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\SubstanceClass;
use Infect\BackendBundle\Entity\SubstanceClassLocale;
use Infect\BackendBundle\Form\SubstanceClassType;

/**
 * SubstanceClass controller.
 *
 */
class SubstanceClassController extends Controller
{

    /**
     * Lists all SubstanceClass entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:SubstanceClass')->findAll();

        return $this->render('InfectBackendBundle:SubstanceClass:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new SubstanceClass entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new SubstanceClass();
        $form = $this->createForm(new SubstanceClassType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
                        $locales = array();
            foreach ($entity->getLocales() as $locale) 
            {
                $locales[] = $locale;
                $entity->removeLocale($locale);
            }

            $em->persist($entity);
            $em->flush();

            foreach($locales as $locale)
            {
                $entity->addLocale($locale);
                $em->persist($locale);
            }
            $em->flush();

            return $this->redirect($this->generateUrl('substanceclass_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:SubstanceClass:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new SubstanceClass entity.
     *
     */
    public function newAction()
    {
        $entity = new SubstanceClass();
        $entity->addLocale(new SubstanceClassLocale());
        $form   = $this->createForm(new SubstanceClassType(), $entity);

        return $this->render('InfectBackendBundle:SubstanceClass:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a SubstanceClass entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:SubstanceClass')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find SubstanceClass entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:SubstanceClass:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing SubstanceClass entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:SubstanceClass')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find SubstanceClass entity.');
        }

        $editForm = $this->createForm(new SubstanceClassType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:SubstanceClass:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing SubstanceClass entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:SubstanceClass')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find SubstanceClass entity.');
        }

        $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new SubstanceClassType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getSubstanceClass() === $locale->getSubstanceClass()) 
                    {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('substanceclass_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:SubstanceClass:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a SubstanceClass entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:SubstanceClass')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find SubstanceClass entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('substanceclass'));
    }

    /**
     * Creates a form to delete a SubstanceClass entity by id.
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
