<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Bacteria;
use Infect\BackendBundle\Entity\BacteriaLocale;
use Infect\BackendBundle\Form\BacteriaType;

/**
 * Bacteria controller.
 *
 */
class BacteriaController extends Controller
{

    /**
     * Lists all Bacteria entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Bacteria')->findAll();

        return $this->render('InfectBackendBundle:Bacteria:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Bacteria entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Bacteria();
        $form = $this->createForm(new BacteriaType(), $entity);
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

            return $this->redirect($this->generateUrl('bacteria_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Bacteria:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Bacteria entity.
     *
     */
    public function newAction()
    {
        $entity = new Bacteria();
        $entity->addLocale(new BacteriaLocale());
        $form   = $this->createForm(new BacteriaType(), $entity);

        return $this->render('InfectBackendBundle:Bacteria:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Bacteria entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Bacteria')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Bacteria entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Bacteria:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Bacteria entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Bacteria')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Bacteria entity.');
        }

        $editForm = $this->createForm(new BacteriaType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Bacteria:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Bacteria entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Bacteria')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Bacteria entity.');
        }

                $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new BacteriaType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getBacteria() === $locale->getBacteria()) {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }

            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('bacteria_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Bacteria:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Bacteria entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Bacteria')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Bacteria entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('bacteria'));
    }

    /**
     * Creates a form to delete a Bacteria entity by id.
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
