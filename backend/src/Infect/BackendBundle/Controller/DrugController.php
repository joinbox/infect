<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Drug;
use Infect\BackendBundle\Entity\DrugLocale;
use Infect\BackendBundle\Form\DrugType;

/**
 * Drug controller.
 *
 */
class DrugController extends Controller
{

    /**
     * Lists all Drug entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Drug')->findAll();

        return $this->render('InfectBackendBundle:Drug:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Drug entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Drug();
        $form = $this->createForm(new DrugType(), $entity);
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

            return $this->redirect($this->generateUrl('drug_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Drug:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Drug entity.
     *
     */
    public function newAction()
    {
        $entity = new Drug();
        $entity->addLocale(new DrugLocale());
        $form   = $this->createForm(new DrugType(), $entity);

        return $this->render('InfectBackendBundle:Drug:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Drug entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Drug')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Drug entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Drug:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Drug entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Drug')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Drug entity.');
        }

        $editForm = $this->createForm(new DrugType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Drug:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Drug entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Drug')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Drug entity.');
        }

        $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new DrugType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {


            foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getCountry() === $locale->getCountry() && $toDel->getDrug() === $locale->getDrug()) {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }

            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('drug_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Drug:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Drug entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Drug')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Drug entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('drug'));
    }

    /**
     * Creates a form to delete a Drug entity by id.
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
