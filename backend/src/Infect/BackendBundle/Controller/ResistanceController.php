<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Resistance;
use Infect\BackendBundle\Form\ResistanceType;

/**
 * Resistance controller.
 *
 */
class ResistanceController extends Controller
{

    /**
     * Lists all Resistance entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Resistance')->findAll();

        return $this->render('InfectBackendBundle:Resistance:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Resistance entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Resistance();
        $form = $this->createForm(new ResistanceType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('resistance'));
        }

        return $this->render('InfectBackendBundle:Resistance:new.html.twig', array(
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
        $entity = new Resistance();
        $form   = $this->createForm(new ResistanceType(), $entity);

        return $this->render('InfectBackendBundle:Resistance:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Resistance entity.
     *
     */
    public function showAction($id_bacteria, $id_compound)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Resistance')->findOneBy(array('bacteria' => $id_bacteria, 'compound' => $id_compound));

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resistance entity.');
        }

        $deleteForm = $this->createDeleteForm($id_bacteria, $id_compound);

        return $this->render('InfectBackendBundle:Resistance:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Resistance entity.
     *
     */
    public function editAction($id_bacteria, $id_compound)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Resistance')->findOneBy(array('bacteria' => $id_bacteria, 'compound' => $id_compound));

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resistance entity.');
        }

        $editForm = $this->createForm(new ResistanceType(), $entity);
        $deleteForm = $this->createDeleteForm($id_bacteria, $id_compound);

        return $this->render('InfectBackendBundle:Resistance:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Resistance entity.
     *
     */
    public function updateAction(Request $request, $id_bacteria, $id_compound)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Resistance')->findOneBy(array('bacteria' => $id_bacteria, 'compound' => $id_compound));

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resistance entity.');
        }

        $deleteForm = $this->createDeleteForm($id_bacteria, $id_compound);
        $editForm = $this->createForm(new ResistanceType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('resistance'));
        }

        return $this->render('InfectBackendBundle:Resistance:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Resistance entity.
     *
     */
    public function deleteAction(Request $request, $id_bacteria, $id_compound)
    {
        $form = $this->createDeleteForm($id_bacteria, $id_compound);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Resistance')->findOneBy(array('bacteria' => $id_bacteria, 'compound' => $id_compound));

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Resistance entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('resistance'));
    }

    /**
     * Creates a form to delete a Resistance entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id_bacteria, $id_compound)
    {
        return $this->createFormBuilder(array('id_bacteria' => $id_bacteria, 'id_compound' => $id_compound))
            ->add('id_bacteria', 'hidden')
            ->add('id_compound', 'hidden')
            ->getForm()
        ;
    }
}
