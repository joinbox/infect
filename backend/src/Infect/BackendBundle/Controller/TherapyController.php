<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Therapy;
use Infect\BackendBundle\Entity\TherapyLocale;
use Infect\BackendBundle\Form\TherapyType;

/**
 * Therapy controller.
 *
 */
class TherapyController extends Controller
{

    /**
     * Lists all Therapy entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Therapy')->findAll();

        return $this->render('InfectBackendBundle:Therapy:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Therapy entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Therapy();
        $form = $this->createForm(new TherapyType(), $entity);
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

            return $this->redirect($this->generateUrl('therapy_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Therapy:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Therapy entity.
     *
     */
    public function newAction()
    {
        $entity = new Therapy();
        $entity->addLocale(new TherapyLocale());
        $form   = $this->createForm(new TherapyType(), $entity);

        return $this->render('InfectBackendBundle:Therapy:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Therapy entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Therapy')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Therapy entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Therapy:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Therapy entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Therapy')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Therapy entity.');
        }

        $editForm = $this->createForm(new TherapyType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Therapy:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Therapy entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Therapy')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Therapy entity.');
        }

        $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new TherapyType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getTherapy() === $locale->getTherapy()) {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('therapy_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Therapy:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Therapy entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Therapy')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Therapy entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('therapy'));
    }

    /**
     * Creates a form to delete a Therapy entity by id.
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
