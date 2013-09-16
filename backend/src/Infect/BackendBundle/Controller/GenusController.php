<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Genus;
use Infect\BackendBundle\Form\GenusType;

/**
 * Genus controller.
 *
 */
class GenusController extends Controller
{

    /**
     * Lists all Genus entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Genus')->findAll();

        return $this->render('InfectBackendBundle:Genus:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Genus entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Genus();
        $form = $this->createForm(new GenusType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('genus_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Genus:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Genus entity.
     *
     */
    public function newAction()
    {
        $entity = new Genus();
        $form   = $this->createForm(new GenusType(), $entity);

        return $this->render('InfectBackendBundle:Genus:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Genus entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Genus')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Genus entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Genus:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Genus entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Genus')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Genus entity.');
        }

        $editForm = $this->createForm(new GenusType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Genus:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Genus entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Genus')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Genus entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new GenusType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('genus_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Genus:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Genus entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Genus')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Genus entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('genus'));
    }

    /**
     * Creates a form to delete a Genus entity by id.
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
