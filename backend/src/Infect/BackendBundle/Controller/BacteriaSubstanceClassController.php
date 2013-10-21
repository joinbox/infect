<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\BacteriaSubstanceClass;
use Infect\BackendBundle\Form\BacteriaSubstanceClassType;

/**
 * Resistance controller.
 *
 */
class BacteriaSubstanceClassController extends Controller
{

    /**
     * Lists all Resistance entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:BacteriaSubstanceClass')->findAll();

        return $this->render('InfectBackendBundle:BacteriaSubstanceClass:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Resistance entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new BacteriaSubstanceClass();
        $form = $this->createForm(new BacteriaSubstanceClassType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('bacteriaSubstanceClass'));
        }

        return $this->render('InfectBackendBundle:BacteriaSubstanceClass:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Resistance entity.
     *
     */
    public function newAction()
    {
        $entity = new BacteriaSubstanceClass();
        $form   = $this->createForm(new BacteriaSubstanceClassType(), $entity);

        return $this->render('InfectBackendBundle:BacteriaSubstanceClass:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Resistance entity.
     *
     */
    public function showAction($id_bacteria, $id_substanceClass)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:BacteriaSubstanceClass')->findOneBy(array('bacteria' => $id_bacteria, 'substanceClass' => $id_substanceClass));

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resistance entity.');
        }

        $deleteForm = $this->createDeleteForm($id_bacteria, $id_substanceClass);

        return $this->render('InfectBackendBundle:BacteriaSubstanceClass:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Resistance entity.
     *
     */
    public function editAction($id_bacteria, $id_substanceClass)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:BacteriaSubstanceClass')->findOneBy(array('bacteria' => $id_bacteria, 'substanceClass' => $id_substanceClass));

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resistance entity.');
        }

        $editForm = $this->createForm(new BacteriaSubstanceClassType(), $entity);
        $deleteForm = $this->createDeleteForm($id_bacteria, $id_substanceClass);

        return $this->render('InfectBackendBundle:BacteriaSubstanceClass:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Resistance entity.
     *
     */
    public function updateAction(Request $request, $id_bacteria, $id_substanceClass)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:BacteriaSubstanceClass')->findOneBy(array('bacteria' => $id_bacteria, 'substanceClass' => $id_substanceClass));

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resistance entity.');
        }

        $deleteForm = $this->createDeleteForm($id_bacteria, $id_substanceClass);
        $editForm = $this->createForm(new BacteriaSubstanceClassType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('bacteriaSubstanceClass'));
        }

        return $this->render('InfectBackendBundle:BacteriaSubstanceClass:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Resistance entity.
     *
     */
    public function deleteAction(Request $request, $id_bacteria, $id_substanceClass)
    {
        $form = $this->createDeleteForm($id_bacteria, $id_substanceClass);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:BacteriaSubstanceClass')->findOneBy(array('bacteria' => $id_bacteria, 'substanceClass' => $id_substanceClass));

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Resistance entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('bacteriaSubstanceClass'));
    }

    /**
     * Creates a form to delete a Resistance entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id_bacteria, $id_substanceClass)
    {
        return $this->createFormBuilder(array('id_bacteria' => $id_bacteria, 'substanceClass' => $id_substanceClass))
            ->add('id_bacteria', 'hidden')
            ->add('id_substanceClass', 'hidden')
            ->getForm()
        ;
    }
}
