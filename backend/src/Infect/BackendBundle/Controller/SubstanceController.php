<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Substance;
use Infect\BackendBundle\Entity\SubstanceLocale;
use Infect\BackendBundle\Entity\Compound;
use Infect\BackendBundle\Form\SubstanceType;

/**
 * Substance controller.
 *
 */
class SubstanceController extends Controller
{

    /**
     * Lists all Substance entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Substance')->findAll();

        return $this->render('InfectBackendBundle:Substance:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Substance entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Substance();
        $form = $this->createForm(new SubstanceType(), $entity);
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

            if ($request->request->get('generateCompound', false)) 
            {
                $compound = new Compound();
                $compound->addSubstance($entity);
                $em->persist($compound);
                $em->flush();    
            }

            return $this->redirect($this->generateUrl('substance_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Substance:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Substance entity.
     *
     */
    public function newAction()
    {
        $entity = new Substance();
        $entity->addLocale(new SubstanceLocale());
        $form   = $this->createForm(new SubstanceType(), $entity);

        return $this->render('InfectBackendBundle:Substance:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Substance entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Substance')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Substance entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Substance:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Substance entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Substance')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Substance entity.');
        }

        $editForm = $this->createForm(new SubstanceType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Substance:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Substance entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Substance')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Substance entity.');
        }

        $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new SubstanceType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getSubstance() === $locale->getSubstance()) {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('substance_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Substance:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Substance entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Substance')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Substance entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('substance'));
    }

    /**
     * Creates a form to delete a Substance entity by id.
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
