<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Diagnosis;
use Infect\BackendBundle\Entity\DiagnosisLocale;
use Infect\BackendBundle\Form\DiagnosisType;

/**
 * Diagnosis controller.
 *
 */
class DiagnosisController extends Controller
{

    /**
     * Lists all Diagnosis entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Diagnosis')->findAll();

        return $this->render('InfectBackendBundle:Diagnosis:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Diagnosis entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Diagnosis();
        $form = $this->createForm(new DiagnosisType(), $entity);
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

            return $this->redirect($this->generateUrl('diagnosis_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Diagnosis:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Diagnosis entity.
     *
     */
    public function newAction()
    {
        $entity = new Diagnosis();
        $entity->addLocale(new DiagnosisLocale());
        $form   = $this->createForm(new DiagnosisType(), $entity);

        return $this->render('InfectBackendBundle:Diagnosis:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Diagnosis entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Diagnosis')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Diagnosis entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Diagnosis:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Diagnosis entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Diagnosis')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Diagnosis entity.');
        }

        $editForm = $this->createForm(new DiagnosisType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Diagnosis:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Diagnosis entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Diagnosis')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Diagnosis entity.');
        }

        $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new DiagnosisType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getDiagnosis() === $locale->getDiagnosis()) {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('diagnosis_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Diagnosis:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Diagnosis entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Diagnosis')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Diagnosis entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('diagnosis'));
    }

    /**
     * Creates a form to delete a Diagnosis entity by id.
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
