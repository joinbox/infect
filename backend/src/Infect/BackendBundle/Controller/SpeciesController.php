<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Species;
use Infect\BackendBundle\Form\SpeciesType;

/**
 * Species controller.
 *
 */
class SpeciesController extends Controller
{

    /**
     * Lists all Species entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Species')->findAll();

        return $this->render('InfectBackendBundle:Species:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Species entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Species();
        $form = $this->createForm(new SpeciesType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('species_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Species:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Species entity.
     *
     */
    public function newAction()
    {
        $entity = new Species();
        $form   = $this->createForm(new SpeciesType(), $entity);

        return $this->render('InfectBackendBundle:Species:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Species entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Species')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Species entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Species:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Species entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Species')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Species entity.');
        }

        $editForm = $this->createForm(new SpeciesType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Species:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Species entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Species')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Species entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new SpeciesType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('species_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Species:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Species entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Species')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Species entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('species'));
    }

    /**
     * Creates a form to delete a Species entity by id.
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
