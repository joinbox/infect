<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Compound;
use Infect\BackendBundle\Entity\CompoundLocale;
use Infect\BackendBundle\Form\CompoundType;

/**
 * Compound controller.
 *
 */
class CompoundController extends Controller
{

    /**
     * Lists all Compound entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Compound')->findAll();

        return $this->render('InfectBackendBundle:Compound:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Compound entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Compound();
        $form = $this->createForm(new CompoundType(), $entity);
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

            return $this->redirect($this->generateUrl('compound_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Compound:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Compound entity.
     *
     */
    public function newAction()
    {
        $entity = new Compound();
        $entity->addLocale(new CompoundLocale());
        $form   = $this->createForm(new CompoundType(), $entity);

        return $this->render('InfectBackendBundle:Compound:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Compound entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Compound')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Compound entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Compound:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Compound entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Compound')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Compound entity.');
        }
        $entity->addLocale(new CompoundLocale());
        $editForm = $this->createForm(new CompoundType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Compound:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Compound entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Compound')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Compound entity.');
        }

        $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new CompoundType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
                        foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getCompound() === $locale->getCompound()) {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('compound_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Compound:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Compound entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Compound')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Compound entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('compound'));
    }

    /**
     * Creates a form to delete a Compound entity by id.
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
