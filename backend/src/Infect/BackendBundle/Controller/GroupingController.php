<?php

namespace Infect\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Infect\BackendBundle\Entity\Grouping;
use Infect\BackendBundle\Entity\GroupingLocale;
use Infect\BackendBundle\Form\GroupingType;

/**
 * Grouping controller.
 *
 */
class GroupingController extends Controller
{

    /**
     * Lists all Grouping entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('InfectBackendBundle:Grouping')->findAll();

        return $this->render('InfectBackendBundle:Grouping:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Grouping entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Grouping();
        $form = $this->createForm(new GroupingType(), $entity);
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

            return $this->redirect($this->generateUrl('grouping_show', array('id' => $entity->getId())));
        }

        return $this->render('InfectBackendBundle:Grouping:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to create a new Grouping entity.
     *
     */
    public function newAction()
    {
        $entity = new Grouping();
        $entity->addLocale(new GroupingLocale());
        $form   = $this->createForm(new GroupingType(), $entity);

        return $this->render('InfectBackendBundle:Grouping:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Grouping entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Grouping')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Grouping entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Grouping:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Grouping entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Grouping')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Grouping entity.');
        }

        $editForm = $this->createForm(new GroupingType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('InfectBackendBundle:Grouping:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Grouping entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('InfectBackendBundle:Grouping')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Grouping entity.');
        }

                $originalLocales = array();
        foreach ($entity->getLocales() as $locale) {
            $originalLocales[] = $locale;
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new GroupingType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
                        foreach ($entity->getLocales() as $locale) {
                foreach ($originalLocales as $key => $toDel) {
                    if ($toDel->getLanguage() === $locale->getLanguage() && $toDel->getGrouping() === $locale->getGrouping()) {
                        unset($originalLocales[$key]);
                    }
                }
            }
            foreach ($originalLocales as $locale) {
                $em->remove($locale);
            }
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('grouping_edit', array('id' => $id)));
        }

        return $this->render('InfectBackendBundle:Grouping:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Grouping entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('InfectBackendBundle:Grouping')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Grouping entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('grouping'));
    }

    /**
     * Creates a form to delete a Grouping entity by id.
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
